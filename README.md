# SkinPal (Frontend only preview)

This is a frontend-only scaffold for SkinPal with a simulated client-side analysis so you can preview the UI without a backend.

How to run locally (Windows PowerShell):

```powershell
cd D:/programs/skinpal
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Notes:
- The `Capture` page performs a client-side mock analysis and navigates to the `Results` page with a demo payload.
- To enable Supabase login flows, create a `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Colors used:
- Light Blue: `#DDEFFA`
- Beige: `#E8D8C3`
- Primary Text: `#2E2E2E`
- Deep Accent: `#240808`
