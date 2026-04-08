from flask import Blueprint, jsonify
from utils.db import supabase, supabase_service

products_bp = Blueprint("products", __name__)

@products_bp.route("/products/<skin_type>", methods=["GET"])
def get_products(skin_type):
    try:
        if not skin_type:
            return jsonify({"error": "Skin type is required"}), 400

        # Map model output to database issue names
        # Model returns: "dry", "acne", "normal", "oily"
        # DB 'skin_issues' has: "Dry Skin", "Acne Prone Skin", "Healthy Skin", "Oily Skin"
        issue_map = {
            "dry": "Dry Skin",
            "acne": "Acne Prone Skin",
            "normal": "Healthy Skin",
            "oily": "Oily Skin"
        }
        
        db_issue_name = issue_map.get(skin_type.lower())
        
        if not db_issue_name:
            # Fallback: Try exact match or ILIKE if mapping fails
            db_issue_name = skin_type

        # Step 1: Get issue_id from skin_issues table (using service role)
        issue_response = supabase_service.table("skin_issues").select("issue_id").ilike("issue_name", f"%{db_issue_name}%").execute()
        
        if not issue_response.data:
            return jsonify({"error": "No products found for this skin type"}), 404

        # Assuming the first match is correct (usually only one)
        issue_id = issue_response.data[0]['issue_id']

        # Step 2: Fetch products suitable for this issue (using service role)
        # 'products' table uses 'suitable_for_issue' FK
        products_response = supabase_service.table("products").select("*").eq("suitable_for_issue", issue_id).execute()

        # Format response - map 'category' column to 'product_type' for consistency with frontend
        products = []
        for product in products_response.data:
            formatted_product = {
                "product_id": product.get("product_id"),
                "product_name": product.get("product_name"),
                "product_type": product.get("category"),  # Map category column to product_type field
                "suitable_for_issue": product.get("suitable_for_issue")
            }
            products.append(formatted_product)

        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500