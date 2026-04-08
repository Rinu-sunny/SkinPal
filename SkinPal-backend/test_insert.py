#!/usr/bin/env python3
"""Test direct table insert to diagnose schema"""
import sys
import uuid
from datetime import datetime
sys.path.insert(0, '.')

from utils.db import supabase_service

# Test insert
print("=== TESTING ANALYSIS INSERT ===")
try:
    user_id = "bb90773b-d19a-49af-b6c4-ed8b3fda6671"
    analysis_id = str(uuid.uuid4())
    
    data = {
        "analysis_id": analysis_id,
        "user_id": user_id,
        "skin_type": "oily",
        "confidence_score": 0.85,
        "analysis_date": datetime.utcnow().isoformat() + "Z"
    }
    
    print(f"Inserting: {data}")
    response = supabase_service.table("analysis_results").insert(data).execute()
    print(f"✓ Success: {response.data}")
except Exception as e:
    print(f"✗ Failed: {e}")

# Check table structure
print("\n=== CHECKING TABLE STRUCTURE ===")
try:
    response = supabase_service.table("analysis_results").select("*").limit(1).execute()
    print(f"✓ Table accessible. First row: {response.data}")
except Exception as e:
    print(f"✗ Failed: {e}")
