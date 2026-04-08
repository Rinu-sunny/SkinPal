#!/usr/bin/env python3
"""Seed database with test products and skin issues"""
import sys
import uuid
sys.path.insert(0, '.')

from utils.db import supabase_service

# Seed products with sequential IDs
print("=== SEEDING PRODUCTS ===")
products = [
    {
        "product_id": 1,
        "product_name": "Gentle Foam Cleanser",
        "suitable_for_issue": 1,
        "category": "Cleanser"
    },
    {
        "product_id": 2,
        "product_name": "Hydrating Moisturizer",
        "suitable_for_issue": 2,
        "category": "Moisturizer"
    },
    {
        "product_id": 3,
        "product_name": "Acne Treatment Serum",
        "suitable_for_issue": 3,
        "category": "Treatment"
    },
    {
        "product_id": 4,
        "product_name": "Daily UV Sunscreen",
        "suitable_for_issue": 4,
        "category": "Sun Care"
    },
]

created_count = 0
try:
    for product in products:
        try:
            response = supabase_service.table("products").insert(product).execute()
            print(f"✓ Created: {product['product_name']}")
            created_count += 1
        except Exception as e:
            print(f"⚠ {product['product_name']}: {e.get('message') if isinstance(e, dict) else str(e)}")
except Exception as e:
    print(f"Error: {e}")

print(f"\n=== SEEDING COMPLETE ({created_count} products created) ===")
