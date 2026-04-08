from flask import Blueprint, request, jsonify
from utils.db import supabase, supabase_service
import os
import uuid

admin_bp = Blueprint("admin", __name__)

# Simple admin credentials - in production, use proper authentication
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

print(f"✅ Admin credentials loaded: username='{ADMIN_USERNAME}'")

# -------------------------
# ADMIN LOGIN
# -------------------------
@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    """
    Simple admin login endpoint.
    In production, integrate with Supabase Auth for admin users.
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Basic authentication - replace with proper auth in production
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            return jsonify({
                "message": "Login successful",
                "admin_token": "admin_session_token_123",
                "admin_username": username
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# GET ALL PRODUCTS (for admin dashboard)
# -------------------------
@admin_bp.route("/admin/products", methods=["GET"])
def admin_get_all_products():
    """Get all products with their skin type information"""
    try:
        # Fetch all products with their associated skin issue
        response = supabase_service.table("products").select(
            "product_id, product_name, category, suitable_for_issue, skin_issues(issue_name)"
        ).execute()

        if not response.data:
            return jsonify([]), 200

        # Format response
        products = []
        for product in response.data:
            skin_issue = product.get("skin_issues")
            skin_type = skin_issue.get("issue_name") if skin_issue else "Unknown"
            
            products.append({
                "product_id": product["product_id"],
                "product_name": product["product_name"],
                "product_type": product["category"],
                "skin_type": skin_type
            })

        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# CREATE PRODUCT
# -------------------------
@admin_bp.route("/admin/products", methods=["POST"])
def admin_create_product():
    """Create a new product"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        product_name = data.get("product_name")
        category = data.get("product_type")  # Frontend sends as product_type, store as category
        skin_type = data.get("skin_type")

        if not product_name or not category or not skin_type:
            return jsonify({"error": "product_name, product_type, and skin_type are required"}), 400

        # Map skin_type to issue_id
        # Simplified skin type mapping: dry, acne, normal, oily -> full database names
        issue_map = {
            "dry": "Dry Skin",
            "acne": "Acne Prone Skin",
            "normal": "Healthy Skin",
            "oily": "Oily Skin"
        }

        db_issue_name = issue_map.get(skin_type.lower(), skin_type)

        # Get issue_id
        issue_response = supabase_service.table("skin_issues").select("issue_id").ilike("issue_name", f"%{db_issue_name}%").execute()

        if not issue_response.data:
            return jsonify({"error": f"Skin type '{skin_type}' not found"}), 404

        issue_id = issue_response.data[0]["issue_id"]

        # Get the next product_id by finding the max
        max_response = supabase_service.table("products").select("product_id").order("product_id", desc=True).limit(1).execute()
        next_product_id = 1
        if max_response.data and max_response.data[0].get("product_id"):
            next_product_id = max_response.data[0]["product_id"] + 1

        # Create product with explicit product_id
        product_response = supabase_service.table("products").insert({
            "product_id": next_product_id,
            "product_name": product_name,
            "category": category,
            "suitable_for_issue": issue_id
        }).execute()

        if product_response.data and len(product_response.data) > 0:
            product = product_response.data[0]
            return jsonify({
                "message": "Product created successfully",
                "product": {
                    "product_id": product.get("product_id"),
                    "product_name": product.get("product_name"),
                    "product_type": product.get("category"),
                    "skin_type": skin_type
                }
            }), 201
        else:
            # If no data returned, assume it worked and return the id we set
            return jsonify({
                "message": "Product created successfully",
                "product": {
                    "product_id": next_product_id,
                    "product_name": product_name,
                    "product_type": category,
                    "skin_type": skin_type
                }
            }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# UPDATE PRODUCT
# -------------------------
@admin_bp.route("/admin/products/<int:product_id>", methods=["PUT"])
def admin_update_product(product_id):
    """Update an existing product"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        product_name = data.get("product_name")
        category = data.get("product_type")  # Frontend sends as product_type, store as category
        skin_type = data.get("skin_type")

        if not product_name or not category or not skin_type:
            return jsonify({"error": "product_name, product_type, and skin_type are required"}), 400

        # Map skin_type to issue_id
        # Simplified skin type mapping: dry, acne, normal, oily -> full database names
        issue_map = {
            "dry": "Dry Skin",
            "acne": "Acne Prone Skin",
            "normal": "Healthy Skin",
            "oily": "Oily Skin"
        }

        db_issue_name = issue_map.get(skin_type.lower(), skin_type)

        # Get issue_id
        issue_response = supabase_service.table("skin_issues").select("issue_id").ilike("issue_name", f"%{db_issue_name}%").execute()

        if not issue_response.data:
            return jsonify({"error": f"Skin type '{skin_type}' not found"}), 404

        issue_id = issue_response.data[0]["issue_id"]

        # Update product
        update_response = supabase_service.table("products").update({
            "product_name": product_name,
            "category": category,
            "suitable_for_issue": issue_id
        }).eq("product_id", product_id).execute()

        if update_response.data:
            return jsonify({
                "message": "Product updated successfully",
                "product": {
                    "product_id": update_response.data[0]["product_id"],
                    "product_name": update_response.data[0]["product_name"],
                    "product_type": update_response.data[0]["category"],
                    "skin_type": skin_type
                }
            }), 200
        else:
            return jsonify({"error": "Product not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# DELETE PRODUCT
# -------------------------
@admin_bp.route("/admin/products/<int:product_id>", methods=["DELETE"])
def admin_delete_product(product_id):
    """Delete a product"""
    try:
        delete_response = supabase_service.table("products").delete().eq("product_id", product_id).execute()

        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# GET SKIN TYPES (for dropdown)
# -------------------------
@admin_bp.route("/admin/skin-types", methods=["GET"])
def admin_get_skin_types():
    """Get all available skin types for the dropdown"""
    try:
        response = supabase_service.table("skin_issues").select("issue_id, issue_name").execute()

        skin_types = [
            {"id": item["issue_id"], "name": item["issue_name"]}
            for item in response.data
        ]

        return jsonify(skin_types), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
