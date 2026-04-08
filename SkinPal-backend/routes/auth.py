from flask import Blueprint, request, jsonify
from utils.db import supabase, supabase_service
from werkzeug.security import generate_password_hash, check_password_hash

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

        print(f"📝 Signup attempt for: {email}")

        # First check if profile already exists in users table
        existing_profile = supabase_service.table("users").select("*").eq("email", email).execute()
        if existing_profile.data:
            print(f"⚠️  Profile already exists for {email}")
            return jsonify({"error": "This email is already registered. Please login instead."}), 400

        # Now try to sign up with Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        if response.user:
            user_id = response.user.id
            print(f"✅ Supabase signup succeeded, user_id: {user_id}")
            
            # Create entry in public 'users' table using service role (bypasses RLS)
            try:
                # Hash the password before storing
                password_hash = generate_password_hash(password)
                insert_data = {
                    "user_id": user_id,
                    "email": email,
                    "name": name,
                    "password_hash": password_hash
                }
                print(f"📝 Creating user profile: {insert_data}")
                result = supabase_service.table("users").insert(insert_data).execute()
                print(f"✅ SUCCESS: User profile created: {result.data}")
            except Exception as db_err:
                error_msg = str(db_err) if isinstance(db_err, dict) else str(db_err)
                print(f"⚠️  Warning when creating user profile: {error_msg}")
                
                # Check if user already exists in users table (duplicate on different field)
                if 'duplicate' in error_msg.lower():
                    print(f"🔍 Checking if user profile already exists...")
                    try:
                        user_check = supabase_service.table("users").select("*").eq("user_id", user_id).execute()
                        if user_check.data:
                            print(f"✅ User profile already exists")
                            # Profile already exists, this is fine
                        else:
                            # Different duplicate error - could be email or other constraint
                            print(f"❌ Duplicate key error but user not found by user_id")
                            return jsonify({"error": f"Email may already be registered"}), 400
                    except:
                        return jsonify({"error": f"Failed to create user profile: {error_msg}"}), 500
                else:
                    print(f"❌ Database error creating user profile: {error_msg}")
                    return jsonify({"error": f"Database error: {error_msg}"}), 500
            
            # Now sign in the user immediately to get session/token
            print(f"🔓 Attempting immediate login for newly created user...")
            try:
                login_response = supabase.auth.sign_in_with_password({
                    "email": email,
                    "password": password
                })
                
                if login_response.user and login_response.session:
                    print(f"✅ Auto-login successful")
                    return jsonify({
                        "message": "User created successfully",
                        "user_id": user_id,
                        "access_token": login_response.session.access_token,
                        "auto_logged_in": True
                    }), 200
                else:
                    print(f"⚠️  Auto-login failed, but user was created. User will need to login separately.")
                    return jsonify({
                        "message": "User created successfully, please login",
                        "user_id": user_id,
                        "auto_logged_in": False
                    }), 200
            except Exception as login_err:
                print(f"⚠️  Auto-login attempt failed: {str(login_err)}, but user was created")
                return jsonify({
                    "message": "User created successfully, please login",
                    "user_id": user_id,
                    "auto_logged_in": False
                }), 200
        else:
            error_response = str(response) if response else "Unknown error"
            print(f"❌ Supabase signup failed: {error_response}")
            
            # Check if email already exists
            if "user_already_exists" in error_response.lower() or "already registered" in error_response.lower():
                print(f"   Email already exists in Supabase Auth, checking if profile exists...")
                # Try to login instead - profile might exist
                try:
                    login_test = supabase.auth.sign_in_with_password({
                        "email": email,
                        "password": password
                    })
                    if login_test.user:
                        return jsonify({"error": "This email is already registered. Please login instead."}), 400
                except:
                    pass
                return jsonify({"error": "This email is already registered. Please login instead."}), 400
            
            return jsonify({"error": "Signup failed. Please check your email and password."}), 400
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Signup exception: {error_msg}")
        return jsonify({"error": error_msg}), 400


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

        print(f"� Login attempt: {email}")
        
        # Find user by email in database
        user_profile = supabase_service.table("users").select("*").eq("email", email).execute()
        
        if not user_profile.data:
            print(f"❌ No user found for email: {email}")
            return jsonify({"error": "Invalid email or password"}), 401
        
        profile = user_profile.data[0]
        password_hash = profile.get("password_hash")
        user_id = profile.get("user_id")
        user_name = profile.get("name")
        
        # Verify password against stored hash
        if not password_hash or not check_password_hash(password_hash, password):
            print(f"❌ Password verification failed for {email}")
            return jsonify({"error": "Invalid email or password"}), 401
        
        print(f"✅ Password verified for {email}")
        
        print(f"Login successful for {email}")
        return jsonify({
            "access_token": user_id,  # Use user_id as token
            "user_id": user_id,
            "email": email,
            "name": user_name
        }), 200
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Login exception: {error_msg}")
        return jsonify({"error": "An error occurred during login"}), 500


# -------------------------
# FORGOT PASSWORD
# -------------------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        email = data.get("email")
        if not email:
            return jsonify({"error": "Email is required"}), 400

        print(f"📧 Attempting password reset for: {email}")

        # Configure where Supabase should redirect after user clicks the recovery link
        from config import FRONTEND_URL
        redirect_to_url = f"{FRONTEND_URL}/reset-password"
        
        # Use Supabase's built-in password reset function
        response = supabase.auth.reset_password_for_email(
            email,
            options={
                "redirect_to": redirect_to_url
            }
        )
        
        print(f"✅ Password reset email sent for: {email}")
        print(f"   Redirect URL: {redirect_to_url}")
        
        return jsonify({
            "message": "Password reset email sent successfully. Please check your inbox."
        }), 200
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Password reset error for {email}: {error_msg}")
        
        # Provide specific error messages
        if "not found" in error_msg.lower() or "user not found" in error_msg.lower():
            return jsonify({"error": "Email not found. Please check the email address."}), 404
        elif "rate" in error_msg.lower():
            return jsonify({"error": "Too many requests. Please try again later."}), 429
        else:
            # Still return the actual error for debugging
            print(f"Full error: {error_msg}")
            return jsonify({"error": f"Failed to send reset email: {error_msg}"}), 400


# -------------------------
# UPDATE PASSWORD WITH TOKEN
# -------------------------
@auth_bp.route("/update-password", methods=["POST"])
def update_password():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        access_token = data.get("access_token")
        new_password = data.get("new_password")
        
        if not access_token or not new_password:
            return jsonify({"error": "Access token and new password are required"}), 400

        if len(new_password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # Update user password using the access token from the reset link
        supabase.auth.admin.update_user_by_id(
            access_token,
            {"password": new_password}
        )
        
        return jsonify({
            "message": "Password updated successfully"
        }), 200
    except Exception as e:
        error_msg = str(e)
        print(f"Password update error: {error_msg}")
        return jsonify({"error": f"Failed to update password: {error_msg}"}), 400



# -------------------------
# GET USER DETAILS
# -------------------------
@auth_bp.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    response = supabase.table("users").select("*").eq("user_id", user_id).execute()
    return jsonify(response.data)