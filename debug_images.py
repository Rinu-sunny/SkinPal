#!/usr/bin/env python3
"""
Debug script to check uploaded_images table and recent entries
"""
import sys
import os
from pathlib import Path

# Load environment
env_path = Path("D:\\programs\\SkinPal\\.env")
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                key, val = line.strip().split("=", 1)
                os.environ[key] = val

sys.path.insert(0, 'SkinPal-backend')

from utils.db import supabase_service

def check_uploaded_images():
    """Check uploaded_images table"""
    try:
        print("=" * 60)
        print("CHECKING UPLOADED_IMAGES TABLE")
        print("=" * 60)
        
        # Get all images
        response = supabase_service.table("uploaded_images").select("*").execute()
        
        print(f"\n✓ Total images in table: {len(response.data)}\n")
        
        if response.data:
            for i, img in enumerate(response.data[-5:]):  # Show last 5
                print(f"\n--- Image {i+1} ---")
                print(f"Image ID: {img.get('image_id')}")
                print(f"User ID: {img.get('user_id', 'N/A')}")
                print(f"Analysis ID: {img.get('analysis_id', 'N/A')}")
                print(f"Uploaded At: {img.get('uploaded_at', 'N/A')}")
                image_url = img.get('image_url', '')
                print(f"Image URL Length: {len(image_url) if image_url else 0} chars")
                if image_url:
                    print(f"Image URL Preview: {image_url[:50]}...")
        else:
            print("❌ No images found in table")
        
        print("\n" + "=" * 60)
        
        # Check analysis_results to see if they have image_id
        print("\nCHECKING ANALYSIS_RESULTS TABLE")
        print("=" * 60)
        
        analysis_response = supabase_service.table("analysis_results").select("*").limit(5).order("analysis_id", desc=True).execute()
        
        print(f"\n✓ Recent analyses: {len(analysis_response.data)}\n")
        
        if analysis_response.data:
            for i, analysis in enumerate(analysis_response.data):
                print(f"\n--- Analysis {i+1} ---")
                print(f"Analysis ID: {analysis.get('analysis_id')}")
                print(f"User ID: {analysis.get('user_id', 'N/A')}")
                print(f"Skin Type: {analysis.get('skin_type', 'N/A')}")
                print(f"Image ID: {analysis.get('image_id', 'N/A')}")
                print(f"Analysis Date: {analysis.get('analysis_date', 'N/A')}")
                print(f"Has Tips: {'skincare_tips' in analysis and bool(analysis.get('skincare_tips'))}")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_uploaded_images()
