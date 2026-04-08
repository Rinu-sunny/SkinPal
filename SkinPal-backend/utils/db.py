from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in configuration")

# Use anon key for reads
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Use service role key for writes (bypasses RLS policies)
supabase_service = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)