from utils.recommendations import get_skin_tips

def test_tips():
    print("--- Skin Care Tips Test Results (Multi-Score) ---\n")

    # Test Case 1: Clear dominator
    scores1 = {"oily": 0.85, "dry": 0.05, "normal": 0.05, "acne_prone": 0.05}
    print(f"Scenario 1: Clear Dominator {scores1}")
    for tip in get_skin_tips(scores1):
        print("-", tip)
    print("\n")

    # Test Case 2: Combination (Oily + Acne)
    scores2 = {"oily": 0.60, "acne_prone": 0.35, "normal": 0.02, "dry": 0.03}
    print(f"Scenario 2: Oily Moderate + Acne (Secondary) {scores2}")
    for tip in get_skin_tips(scores2):
        print("-", tip)
    print("\n")

    # Test Case 3: Combination (Dry + Normal)
    scores3 = {"dry": 0.55, "normal": 0.40, "oily": 0.0, "acne_prone": 0.05}
    print(f"Scenario 3: Dry Moderate + Normal (Secondary) {scores3}")
    for tip in get_skin_tips(scores3):
        print("-", tip)
    print("\n")

    # Test Case 4: Low secondary
    scores4 = {"normal": 0.80, "acne_prone": 0.10, "dry": 0.05, "oily": 0.05}
    print(f"Scenario 4: Normal High, others low (no secondary tips expected) {scores4}")
    for tip in get_skin_tips(scores4):
        print("-", tip)
    print("\n")

if __name__ == "__main__":
    test_tips()
