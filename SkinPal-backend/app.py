from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables FIRST, before importing routes
load_dotenv()

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.analysis import analysis_bp
from routes.products import products_bp
from routes.admin import admin_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(analysis_bp, url_prefix="/api")
app.register_blueprint(products_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api") 

if __name__ == "__main__":
    from config import SUPABASE_URL
    print("Supabase URL:", SUPABASE_URL)
    app.run(debug=True)