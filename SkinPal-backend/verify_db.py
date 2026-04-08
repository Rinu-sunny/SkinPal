#!/usr/bin/env python3
"""Verify database has analysis results"""
import sys
sys.path.insert(0, '.')

from utils.db import supabase_service

print("=== DATABASE VERIFICATION ===\n")

# Check users
print("1️⃣  USERS TABLE")
try:
    users = supabase_service.table("users").select("*").execute()
    print(f"   Total users: {len(users.data)}")
    for user in users.data[:3]:
        print(f"   - {user['email']}: {user['name']}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Check analysis results
print("\n2️⃣  ANALYSIS_RESULTS TABLE")
try:
    analyses = supabase_service.table("analysis_results").select("*").order("analysis_date", desc=True).execute()
    print(f"   Total analyses: {len(analyses.data)}")
    for a in analyses.data[:5]:
        print(f"   - ID:{a['analysis_id']} | {a['skin_type']} | Score:{a['confidence_score']:.2f} | User:{a['user_id'][:8]}...")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Check products
print("\n3️⃣  PRODUCTS TABLE")
try:
    products = supabase_service.table("products").select("*").execute()
    print(f"   Total products: {len(products.data)}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n=== END VERIFICATION ===")
