#!/usr/bin/env python3
"""
Test if recommendations are being saved after analysis.
"""
import sys
sys.path.insert(0, 'SkinPal-backend')

from utils.db import supabase_service

def check_recommendations():
    try:
        # Get all recommendations
        response = supabase_service.table("recommendations").select("*").execute()
        print(f"📊 Total recommendations in database: {len(response.data)}")
        
        if response.data:
            print("\n📋 Sample recommendations:")
            for rec in response.data[:5]:
                print(f"  - Recommendation ID: {rec.get('recommendation_id')}, Analysis: {rec.get('analysis_id')}, Product: {rec.get('product_id')}")
        else:
            print("❌ No recommendations found yet. Upload an image to generate recommendations.")
        
        # Also check analysis results
        analysis_response = supabase_service.table("analysis_results").select("*").execute()
        print(f"\n📊 Total analyses in database: {len(analysis_response.data)}")
        
        if analysis_response.data:
            print("\n📋 Latest analyses:")
            for analysis in analysis_response.data[-3:]:
                analysis_id = analysis.get('analysis_id')
                skin_type = analysis.get('skin_type')
                
                # Count recommendations for this analysis
                recs_for_analysis = supabase_service.table("recommendations").select("*").eq("analysis_id", analysis_id).execute()
                rec_count = len(recs_for_analysis.data) if recs_for_analysis.data else 0
                
                print(f"  - Analysis ID: {analysis_id}, Skin Type: {skin_type}, Recommendations: {rec_count}")
        
    except Exception as e:
        print(f"❌ Error checking recommendations: {str(e)}")

if __name__ == "__main__":
    check_recommendations()
