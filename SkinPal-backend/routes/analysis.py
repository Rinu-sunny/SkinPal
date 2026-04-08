from flask import Blueprint, request, jsonify
from datetime import datetime
from models.predict import predict_skin
from utils.recommendations import get_skin_tips
from utils.db import supabase, supabase_service
from utils.images import save_image

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        user_id = data.get("user_id")
        image_base64 = data.get("image")

        if not user_id or not image_base64:
            return jsonify({"error": "Missing user_id or image"}), 400

        if isinstance(image_base64, str) and "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]

        # Now predict_skin returns a dictionary of probabilities {skin_type: score}
        scores = predict_skin(image_base64)
        
        # Determine the top prediction for database compatibility
        if not scores:
            return jsonify({"error": "Failed to predict skin type from image"}), 400
        prediction = max(scores, key=scores.get)
        confidence = scores[prediction]

        # Save to database using service role (bypasses RLS)
        analysis_id = None
        image_id = None
        try:
            # Get next analysis_id by finding the max and adding 1
            max_result = supabase_service.table("analysis_results").select("analysis_id").order("analysis_id", desc=True).limit(1).execute()
            next_id = (max_result.data[0]['analysis_id'] + 1) if max_result.data else 1
            analysis_id = next_id
            
            data_to_insert = {
                "analysis_id": next_id,
                "user_id": user_id,
                "skin_type": prediction,
                "confidence_score": float(confidence),
                "analysis_date": datetime.utcnow().isoformat() + "Z"
            }
            
            print(f"DEBUG: Inserting analysis (ID={next_id}): {data_to_insert}")
            response = supabase_service.table("analysis_results").insert(data_to_insert).execute()
            print(f"✓ SUCCESS: Analysis saved - {response.data}")
            
            # Now save image if provided
            if image_base64:
                image_id = save_image(image_base64, user_id, next_id)
                if image_id:
                    # Update analysis record with image_id
                    try:
                        supabase_service.table("analysis_results").update({
                            "image_id": image_id
                        }).eq("analysis_id", next_id).execute()
                        print(f"✓ Analysis updated with image_id={image_id}")
                    except Exception as e:
                        print(f"⚠️ WARNING: Failed to update analysis with image_id: {str(e)}")
            
            # Generate tips and save to database
            tips = get_skin_tips(scores)
            try:
                supabase_service.table("analysis_results").update({
                    "skincare_tips": tips,
                    "scores": scores  # Save all probability scores
                }).eq("analysis_id", next_id).execute()
                print(f"✓ Skincare tips and scores saved to analysis")
            except Exception as e:
                print(f"⚠️ WARNING: Failed to save skincare tips or scores: {str(e)}")
                        
        except Exception as e:
            # Log DB failure but allow analysis to continue for UX
            error_msg = str(e) if isinstance(e, dict) else str(e)
            print(f"❌ ERROR: Failed to save analysis: {error_msg}")

        # Save recommendations to database if analysis was saved successfully
        if analysis_id:
            try:
                # Get recommended products for this skin type
                issue_map = {
                    "oily": "Oily Skin",
                    "dry": "Dry Skin",
                    "normal": "Healthy Skin",
                    "acne_prone": "Acne Prone Skin"
                }
                db_issue_name = issue_map.get(prediction.lower(), prediction)
                
                # Get issue_id
                issue_response = supabase_service.table("skin_issues").select("issue_id").ilike("issue_name", f"%{db_issue_name}%").execute()
                
                if issue_response.data:
                    issue_id = issue_response.data[0]['issue_id']
                    
                    # Get products for this issue
                    products_response = supabase_service.table("products").select("product_id").eq("suitable_for_issue", issue_id).execute()
                    
                    if products_response.data:
                        # Get next rec_id by finding the max and adding 1
                        max_rec = supabase_service.table("recommendations").select("rec_id").order("rec_id", desc=True).limit(1).execute()
                        next_rec_id = (max_rec.data[0]['rec_id'] + 1) if max_rec.data else 1
                        
                        # Insert recommendations with explicit IDs
                        recommendations_to_insert = []
                        for i, product in enumerate(products_response.data):
                            recommendations_to_insert.append({
                                "rec_id": next_rec_id + i,
                                "analysis_id": analysis_id,
                                "product_id": product['product_id']
                            })
                        
                        rec_response = supabase_service.table("recommendations").insert(recommendations_to_insert).execute()
                        print(f"✓ SUCCESS: Saved {len(recommendations_to_insert)} recommendations")
            except Exception as e:
                # Don't fail the analysis if recommendations save fails
                error_msg = str(e) if isinstance(e, dict) else str(e)
                print(f"⚠️ WARNING: Failed to save recommendations: {error_msg}")

        # Pass the full dictionary of scores to get comprehensive tips
        tips = get_skin_tips(scores)
        
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "scores": scores,
            "tips": tips
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@analysis_bp.route("/delete-history", methods=["DELETE"])
def delete_history():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        user_id = data.get("user_id")
        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        # First, get all analysis IDs for the user to delete recommendations
        try:
            analysis_ids_response = supabase_service.table("analysis_results").select("analysis_id").eq("user_id", user_id).execute()
            analysis_ids = [a['analysis_id'] for a in analysis_ids_response.data]
            
            # Delete all recommendations for those analyses
            if analysis_ids:
                try:
                    supabase_service.table("recommendations").delete().in_("analysis_id", analysis_ids).execute()
                    print(f"✓ Deleted {len(analysis_ids)} recommendation records for user {user_id}")
                except Exception as e:
                    print(f"⚠️ WARNING: Failed to delete recommendations: {str(e)}")
        except Exception as e:
            print(f"⚠️ WARNING: Failed to fetch analysis IDs: {str(e)}")

        # Delete all uploaded images for the user
        try:
            images_response = supabase_service.table("uploaded_images").delete().eq("user_id", user_id).execute()
            print(f"✓ Deleted uploaded images for user {user_id}")
        except Exception as e:
            print(f"⚠️ WARNING: Failed to delete uploaded images: {str(e)}")

        # Delete all analysis results for the user
        try:
            analysis_response = supabase_service.table("analysis_results").delete().eq("user_id", user_id).execute()
            print(f"✓ Deleted analysis records for user {user_id}")
        except Exception as e:
            print(f"⚠️ WARNING: Failed to delete analysis records: {str(e)}")

        return jsonify({
            "message": "All history and related data deleted successfully",
            "user_id": user_id
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@analysis_bp.route("/delete-analysis/<analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id):
    try:
        print(f"DEBUG: Delete request received for analysis_id={analysis_id}")
        
        data = request.json
        if not data:
            print("DEBUG: Missing JSON data")
            return jsonify({"error": "Missing JSON data"}), 400

        user_id = data.get("user_id")
        if not user_id:
            print("DEBUG: Missing user_id")
            return jsonify({"error": "Missing user_id"}), 400

        print(f"DEBUG: user_id={user_id}")

        # Convert analysis_id to integer
        try:
            analysis_id = int(analysis_id)
            print(f"DEBUG: Converted analysis_id to int: {analysis_id}")
        except (ValueError, TypeError):
            print(f"DEBUG: Failed to convert analysis_id to int: {analysis_id}")
            return jsonify({"error": "Invalid analysis_id format"}), 400

        # Get the analysis to find associated image_id
        try:
            print(f"DEBUG: Querying analysis_results for analysis_id={analysis_id}, user_id={user_id}")
            analysis_response = supabase_service.table("analysis_results").select("image_id").eq("analysis_id", analysis_id).eq("user_id", user_id).execute()
            print(f"DEBUG: Query result: {analysis_response.data}")
            
            if not analysis_response.data:
                print(f"DEBUG: Analysis not found for analysis_id={analysis_id}, user_id={user_id}")
                return jsonify({"error": "Analysis not found or doesn't belong to user"}), 404
            
            image_id = analysis_response.data[0].get("image_id")
            print(f"DEBUG: Found image_id={image_id}")
            
            # Delete associated recommendations FIRST (before analysis, due to foreign key constraint)
            try:
                print(f"DEBUG: Deleting recommendations for analysis {analysis_id}")
                supabase_service.table("recommendations").delete().eq("analysis_id", analysis_id).execute()
                print(f"✓ Deleted recommendations for analysis {analysis_id}")
            except Exception as e:
                print(f"⚠️ WARNING: Failed to delete recommendations: {str(e)}")
            
            # Delete the analysis record
            print(f"DEBUG: Deleting analysis record {analysis_id}")
            supabase_service.table("analysis_results").delete().eq("analysis_id", analysis_id).execute()
            print(f"✓ Deleted analysis record {analysis_id}")
            
            # Delete associated image if exists
            if image_id:
                try:
                    print(f"DEBUG: Deleting image {image_id}")
                    supabase_service.table("uploaded_images").delete().eq("image_id", image_id).execute()
                    print(f"✓ Deleted image {image_id} for analysis {analysis_id}")
                except Exception as e:
                    print(f"⚠️ WARNING: Failed to delete image: {str(e)}")
            
            print(f"✓ SUCCESS: Analysis {analysis_id} deleted completely")
            return jsonify({
                "message": "Analysis deleted successfully",
                "analysis_id": analysis_id
            }), 200

        except Exception as e:
            print(f"❌ ERROR: Failed to delete analysis: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500

    except Exception as e:
        print(f"❌ ERROR: Outer exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500