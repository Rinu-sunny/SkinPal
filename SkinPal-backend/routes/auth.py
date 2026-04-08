from flask import Blueprint, request, jsonify
from utils.db import supabase, supabase_service

auth_bp = Blueprint("auth", __name__)

# -------------------------
# SIGNUP
# -------------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        email = data.get("email")
        password = data.get("password")
        name = data.get("name") or email.split("@")[0] if email else "User"

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Compute default name only after email is validated.

        # Sign up with Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        if response.user:
            user_id = response.user.id
            
            # Create entry in public 'users' table using service role (bypasses RLS)
            # Store 'managed_by_supabase' in password_hash to avoid storing secrets in plain text
            try:
                supabase_service.table("users").insert({
                    "user_id": user_id,
                    "email": email,
                    "name": name,
                    "password_hash": "managed_by_supabase_auth"
                    # 'created_at' uses DB default
                }).execute()
            except Exception as db_err:
                error_msg = str(db_err) if isinstance(db_err, dict) else str(db_err)
                print(f"ERROR: Failed to create user profile: {error_msg}")
                # Return error because user profile creation failed
                return jsonify({"error": f"Database error: {error_msg}"}), 500
            
            return jsonify({"message": "User created successfully", "user_id": user_id}), 200
        else:
            return jsonify({"error": "Signup failed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# LOGIN
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if response.user and response.session:
            return jsonify({
                "access_token": response.session.access_token,
                "user_id": response.user.id
            }), 200
        elif response.user:
            return jsonify({"error": "Login succeeded but no active session was returned. Verify email and try again."}), 401
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 401


# -------------------------
# GET USER DETAILS
# -------------------------
@auth_bp.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    response = supabase.table("users").select("*").eq("user_id", user_id).execute()
    return jsonify(response.data)