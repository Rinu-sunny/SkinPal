"""
Image storage utility for saving base64 images to Supabase
"""
import base64
from utils.db import supabase_service

def save_image(image_base64: str, user_id: str, analysis_id: int) -> int | None:
    """
    Save base64 image to uploaded_images table and return image_id.
    Falls back to null if storage fails (doesn't block analysis).
    """
    if not image_base64 or not analysis_id or not user_id:
        print(f"⚠️ Missing required fields: image={bool(image_base64)}, user_id={user_id}, analysis_id={analysis_id}")
        return None
    
    try:
        # Clean up base64 string - remove data URI prefix if present
        if "," in str(image_base64):
            image_base64 = image_base64.split(",", 1)[1]
        
        # Store as base64 text
        image_data_to_store = image_base64.strip()
        
        # Validate it's valid base64
        try:
            base64.b64decode(image_data_to_store, validate=True)
            print(f"✓ Base64 validation passed")
        except Exception as e:
            print(f"⚠️ WARNING: Invalid base64 image data: {e}")
            return None
        
        # Save to uploaded_images table
        print(f"Attempting to save image to uploaded_images: user_id={user_id}, analysis_id={analysis_id}")
        
        insert_data = {
            "user_id": user_id,
            "image_url": image_data_to_store,
            "analysis_id": analysis_id
        }
        
        print(f"Insert data: {list(insert_data.keys())}")
        response = supabase_service.table("uploaded_images").insert(insert_data).execute()
        
        print(f"Response status: {response}")
        print(f"Response data: {response.data}")
        
        if response.data and len(response.data) > 0:
            image_id = response.data[0].get('image_id')
            if image_id:
                print(f"✓ Image saved: ID={image_id}, Analysis={analysis_id}, User={user_id}")
                return image_id
            else:
                print(f"✓ Image inserted but no ID returned. Data: {response.data[0]}")
                return 1  # Return dummy ID since insert succeeded
        else:
            print(f"⚠️ No data in response")
            return None
                
    except Exception as e:
        error_msg = str(e)
        print(f"❌ ERROR saving image: {error_msg}")
        import traceback
        traceback.print_exc()
        return None
