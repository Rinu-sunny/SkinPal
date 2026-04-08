
def get_skin_tips(scores):
    """
    Returns a list of recommendations/tips based on a dictionary of scores 
    for different skin types (e.g., {'oily': 0.6, 'dry': 0.2, ...}).
    Focuses mainly on the two highest scoring types.
    """
    if not scores or not isinstance(scores, dict):
        return ["Consult a dermatologist for personalized advice."]

    # Sort skin types by score in descending order
    sorted_types = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    
    # Get top 2 types
    top_types = sorted_types[:2]
    
    # Extract info: we need at least one type
    if not top_types:
         return ["Consult a dermatologist for personalized advice."]
         
    primary_type, primary_score = top_types[0]
    secondary_type, secondary_score = top_types[1] if len(top_types) > 1 else (None, 0)
    
    # Tip Database (similar to before but structured for lookup)
    tips_db = {
        "oily": {
            "mild": [
                "Wash your face morning and night with a gentle, foaming cleanser.",
                "Use a lightweight, oil-free moisturizer.",
                "Use blotting papers if you get shiny during the day.",
                "Avoid heavy, pore-clogging creams."
            ],
            "moderate": [
                "Incorporate a cleanser with Niacinamide to help regulate sebum.",
                "Exfoliate 1-2 times a week with a gentle scrub or enzyme powder.",
                "Use a clay mask weekly to draw out impurities.",
                "Always finish with a matte sunscreen."
            ],
            "severe": [
                "Use a Salicylic Acid (BHA) cleanser to deep clean pores.",
                "Apply a mattifying toner with Witch Hazel or Tea Tree Oil.",
                "Use a stronger clay or charcoal mask 1-2 times a week.",
                "Consider a lightweight gel moisturizer with Hyaluronic Acid."
            ]
        },
        "dry": {
            "mild": [
                "Use a gentle, creamy cleanser that doesn't foam excessively.",
                "Apply moisturizer daily to keep skin soft.",
                "Drink plenty of water.",
                "Protect skin from cold wind."
            ],
            "moderate": [
                "Apply moisturizer immediately after washing while skin is damp.",
                "Switch to a hydrating cleanser with Glycerin or Ceramides.",
                "Avoid hot water; use lukewarm water only.",
                "Consider a humidifier in your bedroom."
            ],
            "severe": [
                "Use rich creams with Shea Butter, Squalane, or heavier oils.",
                "Layer a facial oil over your moisturizer at night to lock in hydration.",
                "Avoid toners with alcohol entirely.",
                "Limit exfoliation to once every two weeks."
            ]
        },
        "acne_prone": {
            "mild": [
                "Wash your face gently twice a day.",
                "Keep hair off your face.",
                "Change pillowcases regularly.",
                "Avoid touching your face."
            ],
            "moderate": [
                "Use a cleanser with Salicylic Acid or Benzoyl Peroxide once daily.",
                "Spot treat pimples with tea tree oil or hydrocolloid patches.",
                "Shower immediately after sweating.",
                "Use only non-comedogenic makeup."
            ],
            "severe": [
                "Incorporate a Retinoid (like Adapalene) into your night routine.",
                "Use Benzoyl Peroxide gel on active breakouts.",
                "Avoid physical scrubs that can spread bacteria.",
                "Be patient; results can take 4-6 weeks."
            ]
        },
        "normal": {
            "mild": [
                "Cleanse, Moisturize, Sunscreen daily.",
                "Drink water and eat a balanced diet."
            ],
            "moderate": [
                "Add a Vitamin C serum for antioxidants.",
                "Exfoliate once a week for radiance."
            ],
            "severe": [
                 "Focus on anti-aging prevention.",
                 "Consider adding a gentle retinol.",
                 "Double cleanse in the evening."
            ]
        }
    }
    
    final_tips = []
    
    # Helper to get level from score
    def get_level(score):
        if score > 0.8: return "severe"
        if score > 0.5: return "moderate"
        return "mild"

    # Process Primary Type
    if primary_type:
        p_level = get_level(primary_score)
        # Handle case where key might not exist in db
        type_dict = tips_db.get(primary_type.lower())
        
        if type_dict:
            p_tips = type_dict.get(p_level, [])
            final_tips.append(f"Primary Focus ({primary_type.replace('_', ' ').capitalize()} - {p_level}):")
            final_tips.extend(p_tips)
        else:
            final_tips.append(f"Primary Focus ({primary_type}): No specific tips found.")


    # Define specific thresholds for each skin type to be considered as a "Secondary" concern
    # - Acne: Lower threshold (0.20) because even mild acne needs attention.
    # - Oily/Dry: Standard threshold (0.25).
    # - Normal: Higher threshold (0.40) because it's the default state and less "actionable" as a secondary trait.
    SECONDARY_THRESHOLDS = {
        "acne_prone": 0.20,
        "oily": 0.25,
        "dry": 0.25,
        "normal": 0.40
    }

    # Process Secondary Type
    threshold = SECONDARY_THRESHOLDS.get(secondary_type.lower(), 0.25) if secondary_type else 0.25

    if secondary_type and secondary_score > threshold:
        s_level = get_level(secondary_score)
        type_dict = tips_db.get(secondary_type.lower())
        
        if type_dict:
            s_tips = type_dict.get(s_level, [])
            final_tips.append(f"Secondary Focus ({secondary_type.replace('_', ' ').capitalize()} - {s_level}):")
            final_tips.extend(s_tips)

    if not final_tips:
        return ["Consult a dermatologist for personalized advice."]

    return final_tips
