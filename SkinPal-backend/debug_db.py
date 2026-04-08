#!/usr/bin/env python3
"""Debug script to check database contents"""
import sys
sys.path.insert(0, '.')

from utils.db import supabase_service

try:
    # Check users table
    print("=== USERS TABLE ===")
    users = supabase_service.table("users").select("*").execute()
    print(f"Total users: {len(users.data)}")
    for user in users.data[:5]:  # Show first 5
        print(f"  {user['user_id']}: {user.get('email', 'N/A')} - {user.get('name', 'N/A')}")
except Exception as e:
    print(f"Error fetching users: {e}")

try:
    # Check skin_issues table
    print("\n=== SKIN_ISSUES TABLE ===")
    issues = supabase_service.table("skin_issues").select("*").execute()
    print(f"Total issues: {len(issues.data)}")
    for issue in issues.data:
        print(f"  {issue['issue_id']}: {issue.get('issue_name', 'N/A')}")
except Exception as e:
    print(f"Error fetching skin_issues: {e}")

try:
    # Check products table
    print("\n=== PRODUCTS TABLE ===")
    products = supabase_service.table("products").select("*").execute()
    print(f"Total products: {len(products.data)}")
    for p in products.data[:5]:  # Show first 5
        print(f"  {p.get('product_id', 'N/A')}: {p.get('product_name', 'N/A')}")
except Exception as e:
    print(f"Error fetching products: {e}")

try:
    # Check analysis_results table
    print("\n=== ANALYSIS_RESULTS TABLE ===")
    analyses = supabase_service.table("analysis_results").select("*").execute()
    print(f"Total analyses: {len(analyses.data)}")
    for a in analyses.data[:5]:  # Show first 5
        print(f"  {a.get('analysis_id', 'N/A')}: {a.get('user_id', 'N/A')} - {a.get('skin_type', 'N/A')}")
except Exception as e:
    print(f"Error fetching analysis_results: {e}")
