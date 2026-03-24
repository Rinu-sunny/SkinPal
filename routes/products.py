from flask import Blueprint, jsonify
from utils.db import supabase

products_bp = Blueprint("products", __name__)

@products_bp.route("/products/<skin_type>", methods=["GET"])
def get_products(skin_type):
    try:
        if not skin_type:
            return jsonify({"error": "Skin type is required"}), 400

        # Map model output to database issue names
        # Model returns: "oily", "dry", "normal", "acne_prone"
        # DB 'skin_issues' has: "Oily Skin", "Dry Skin", "Healthy Skin", "Acne Prone Skin"
        issue_map = {
            "oily": "Oily Skin",
            "dry": "Dry Skin",
            "normal": "Healthy Skin",
            "acne_prone": "Acne Prone Skin"
        }
        
        db_issue_name = issue_map.get(skin_type.lower())
        
        if not db_issue_name:
            # Fallback: Try exact match or ILIKE if mapping fails
            db_issue_name = skin_type

        # Step 1: Get issue_id from skin_issues table
        issue_response = supabase.table("skin_issues").select("issue_id").ilike("issue_name", f"%{db_issue_name}%").execute()
        
        if not issue_response.data:
            return jsonify([]) # No matching skin issue found

        # Assuming the first match is correct (usually only one)
        issue_id = issue_response.data[0]['issue_id']

        # Step 2: Fetch products suitable for this issue
        # 'products' table uses 'suitable_for_issue' FK
        products_response = supabase.table("products").select("*").eq("suitable_for_issue", issue_id).execute()

        return jsonify(products_response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500