from flask import Blueprint, jsonify, request
from utils.db import supabase_service

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        if not user_id or not user_id.strip():
            return jsonify({"error": "User ID is required"}), 400

        print(f"\n📋 /profile/{user_id}")
        
        # Get pagination params
        limit = request.args.get('limit', 10, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        limit = min(limit, 100)  # Cap at 100
        offset = max(offset, 0)  # No negative offsets

        print(f"  Pagination: limit={limit}, offset={offset}")

        # Step 1: Get user profile
        print(f"  Step 1: Fetching user profile...")
        user_response = supabase_service.table("users").select("*").eq("user_id", user_id).execute()
        
        if not user_response.data:
            # Auto-create placeholder
            print(f"  ⚠️  Profile doesn't exist, creating...")
            try:
                new_user = {
                    "user_id": user_id,
                    "email": f"user+{user_id[:8]}@app",
                    "name": "User",
                    "password_hash": "managed_by_supabase_auth"
                }
                supabase_service.table("users").insert(new_user).execute()
                user_response = supabase_service.table("users").select("*").eq("user_id", user_id).execute()
            except Exception as e:
                print(f"  ⚠️  Could not create profile: {e}")
                # Return minimal response
                user_response = [{
                    "user_id": user_id,
                    "email": f"user+{user_id[:8]}@app",
                    "name": "User"
                }]
        
        user_data = user_response.data[0] if user_response.data else {}
        print(f"  ✅ User: {user_data.get('email')}")

        # Step 2: Get analysis history
        print(f"  Step 2: Fetching history...")
        history_response = supabase_service.table("analysis_results").select("*").eq("user_id", user_id).order("analysis_date", desc=True).range(offset, offset + limit - 1).execute()
        history_data = history_response.data if history_response.data else []
        print(f"  ✅ Found {len(history_data)} analyses")

        # Step 3: Attach images to each analysis
        print(f"  Step 3: Fetching images...")
        image_ids = [h.get("image_id") for h in history_data if h.get("image_id")]
        
        images_map = {}
        if image_ids:
            try:
                img_response = supabase_service.table("uploaded_images").select("image_id, image_url").in_("image_id", image_ids).execute()
                for img in img_response.data if img_response.data else []:
                    images_map[img.get("image_id")] = img.get("image_url")
                print(f"  ✅ Found {len(images_map)} images")
            except Exception as e:
                print(f"  ⚠️  Image fetch failed: {e}")

        # Step 4: Enhance history with images
        for item in history_data:
            img_id = item.get("image_id")
            if img_id and img_id in images_map:
                img_url = images_map[img_id]
                if img_url:
                    if not img_url.startswith("data:"):
                        img_url = f"data:image/jpeg;base64,{img_url}"
                    item["image"] = img_url
            # Don't fail if image missing - just keep item without image

        print(f"  ✅ Returning {len(history_data)} items")
        
        response = {
            "user": user_data,
            "history": history_data
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = str(e)
        print(f"  ❌ ERROR: {error_msg}")
        return jsonify({"error": "Server error", "details": error_msg}), 500
