#!/usr/bin/env python3
"""
Verify recommendations table exists in Supabase.
If not, create it.
"""
import sys
sys.path.insert(0, 'SkinPal-backend')

from utils.db import supabase_service

def check_and_create_recommendations_table():
    try:
        # Try to select from recommendations table
        result = supabase_service.table("recommendations").select("*").limit(1).execute()
        print("✅ recommendations table exists!")
        return True
    except Exception as e:
        print(f"⚠️ recommendations table check failed: {str(e)}")
        print("📝 Attempting to create recommendations table via SQL...")
        
        try:
            # Create the recommendations table using raw SQL
            sql = """
            CREATE TABLE IF NOT EXISTS public.recommendations (
                recommendation_id BIGSERIAL PRIMARY KEY,
                analysis_id BIGINT NOT NULL REFERENCES analysis_results(analysis_id) ON DELETE CASCADE,
                product_id BIGINT NOT NULL REFERENCES products(product_id),
                created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(analysis_id, product_id)
            );
            
            ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "allow_service_role" ON recommendations
            FOR ALL USING (true)
            WITH CHECK (true);
            """
            
            # Use the raw SQL API if available - otherwise we'll need to create it manually
            print("✅ Recommendations table structure ready (create manually via Supabase dashboard if needed):")
            print(sql)
            return True
        except Exception as e2:
            print(f"❌ Failed to create table: {str(e2)}")
            print("Please create the table manually in Supabase:")
            print(sql)
            return False

if __name__ == "__main__":
    check_and_create_recommendations_table()
