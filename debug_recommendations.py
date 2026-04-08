#!/usr/bin/env python3
"""
Debug recommendations insert - manually generate IDs like we do for analysis
"""
import sys
import os
from pathlib import Path

# Load environment
env_path = Path("D:\\programs\\SkinPal\\.env")
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line:
                key, val = line.strip().split("=", 1)
                os.environ[key] = val

sys.path.insert(0, 'SkinPal-backend')

from utils.db import supabase_service

# Check recommendations table structure
try:
    result = supabase_service.table("recommendations").select("*").limit(1).execute()
    if result.data:
        print("✅ Sample recommendation found:")
        print(result.data[0])
        print("\nColumn names:", list(result.data[0].keys()))
    else:
        print("❌ No recommendations exist yet")
        
    # Count existing recommendations
    count_result = supabase_service.table("recommendations").select("rrec_id", {"count": "exact"}).execute()
    print(f"\n📊 Total recommendations: {len(count_result.data) if count_result.data else 0}")
    
    # Get max ID
    max_result = supabase_service.table("recommendations").select("rrec_id").order("rrec_id", desc=True).limit(1).execute()
    if max_result.data:
        max_id = max_result.data[0]['rrec_id']
        print(f"Max rrec_id: {max_id}")
        print(f"Next ID should be: {max_id + 1}")
    else:
        print("Next ID should be: 1")
        
except Exception as e:
    print(f"❌ Error: {str(e)}")
