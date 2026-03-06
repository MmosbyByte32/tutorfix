# ExamIQ — Full Setup Guide

## What's included
- **Supabase** — stores library folders & files
- **Firebase** — superuser authentication (email/password login)
- **Claude Haiku** — AI tutor + assessment grading

---

## Part 1 — Supabase (Library Storage)

### 1.1 Create a free Supabase project
1. Go to https://supabase.com → **New Project** → name it `examiq`
2. Choose region `eu-west-2` (London — closest to South Africa)
3. Wait ~2 minutes

### 1.2 Run the database schema
1. Supabase → **SQL Editor** → **New query**
2. Paste contents of `supabase-schema.sql` → **Run**

### 1.3 Create the Storage bucket
1. Supabase → **Storage** → **New bucket**
2. Name: `library` → toggle **Public** ON → **Save**

### 1.4 Get Supabase keys
Settings → API → copy:
- **Project URL** → `SUPABASE_URL`
- **service_role key** (NOT anon) → `SUPABASE_SERVICE_ROLE_KEY`

---

## Part 2 — Firebase (Authentication)

### 2.1 Create a Firebase project
1. https://console.firebase.google.com → **Add project** → name `examiq`
2. Disable Google Analytics → **Create**

### 2.2 Enable Email/Password sign-in
Authentication → Sign-in method → Email/Password → **Enable** → Save

### 2.3 Get client config (safe to expose)
Project Settings → General → scroll to **Your apps** → **</>** (Web) → Register
Copy: `apiKey`, `authDomain`, `projectId`

### 2.4 Get service account key (keep private)
Project Settings → **Service accounts** → **Generate new private key** → download JSON
Minify to one line → paste as `FIREBASE_SERVICE_ACCOUNT_JSON`

---

## Part 3 — Add all env vars to Vercel

Settings → Environment Variables:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | from console.anthropic.com |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | minified JSON string |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | from Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | from Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | from Firebase web app config |
| `ADMIN_SECRET` | any long random string e.g. `xK9$mP2!qR7` |

---

## Part 4 — Deploy & create your superuser

### Push to GitHub
```bash
git add .
git commit -m "Add Firebase auth"
git push
```

### Create your first superuser (run once after deploy)
```bash
curl -X POST https://YOUR-APP.vercel.app/api/admin/create-superuser \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_ADMIN_SECRET","email":"you@school.co.za","password":"StrongPass123!"}'
```

Response: `{"ok":true,"message":"Superuser created: you@school.co.za"}`

### Sign in
Open your app → login screen → enter email + password → done.

---

## Adding more superusers later
Same curl command with a different email/password.

---

## How it works
1. Firebase Auth (browser) signs user in → returns ID token
2. `/api/auth/verify` (server) verifies token with Firebase Admin SDK
3. Checks custom claim `role === "superuser"` — set only by your server
4. Session saved in sessionStorage (clears when browser tab closes)

---

## Free tier limits
| Service | Limit |
|---|---|
| Firebase Auth | 10,000 sign-ins/month |
| Supabase DB | 500 MB |
| Supabase Storage | 1 GB |
| Vercel | Unlimited |
