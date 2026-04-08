import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// If no env provided, export a harmless stub so the app can run frontend-only.
let supabase
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
	// minimal stub with the small auth surface we use in the UI
	supabase = {
		auth: {
			signUp: async ({ email, password }) => ({ data: null, error: null }),
			signInWithPassword: async ({ email, password }) => ({ data: null, error: null }),
			setSession: async (session) => ({ data: null, error: null }),
			updateUser: async (attributes) => ({ data: null, error: null }),
			resetPasswordForEmail: async (email) => ({ data: null, error: null }),
			getSession: async () => ({ data: { session: null }, error: null }),
			getUser: async () => ({ data: { user: null }, error: null }),
		}
	}
}

export { supabase }
