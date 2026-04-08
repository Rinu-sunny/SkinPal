#!/usr/bin/env python3
"""
Test inserting an image directly to uploaded_images table
"""
import sys
import os
from pathlib import Path
import base64

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

def test_insert_image():
    """Test inserting an image to uploaded_images"""
    try:
        print("=" * 60)
        print("TESTING IMAGE INSERT")
        print("=" * 60)
        
        # Create a simple test base64 image
        test_base64 = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
        
        user_id = "bb90773b-d19a-49af-b6c4-ed8b3fda6671"
        analysis_id = 11
        
        print(f"\nAttempting to insert test image:")
        print(f"  User ID: {user_id}")
        print(f"  Analysis ID: {analysis_id}")
        print(f"  Base64 length: {len(test_base64)}")
        
        insert_data = {
            "user_id": user_id,
            "image_url": test_base64,
            "analysis_id": analysis_id
        }
        
        print(f"\nInserting data...")
        response = supabase_service.table("uploaded_images").insert(insert_data).execute()
        
        print(f"\nResponse: {response}")
        print(f"Response data: {response.data}")
        
        if response.data:
            print(f"\n✓ SUCCESS! Image inserted with ID: {response.data[0].get('image_id')}")
        else:
            print(f"\n❌ No data returned from insert")
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_insert_image()
