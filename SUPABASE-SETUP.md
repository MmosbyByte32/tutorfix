# Setting Up Supabase Storage for ExamIQ Library

Follow these steps exactly. Takes about 10 minutes.

---

## Step 1 — Create a Supabase project

1. Go to **https://supabase.com** → click **Start your project** (free)
2. Sign up / sign in
3. Click **New project**
4. Fill in:
   - **Name:** `examiq`
   - **Database Password:** choose a strong password (save it somewhere)
   - **Region:** `West EU (London)` — closest to South Africa
5. Click **Create new project**
6. Wait about 2 minutes while it provisions

---

## Step 2 — Run the database schema

This creates the `lib_folders` and `lib_files` tables plus all the security policies.

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click the **+ New query** button (top left of the editor area)
3. Open the file `supabase-schema.sql` from this ZIP in a text editor
4. Select ALL the text (Ctrl+A) and copy it
5. Paste it into the Supabase SQL editor
6. Click the green **Run** button (or press Ctrl+Enter)
7. You should see: **"Success. No rows returned"** at the bottom

   ✅ If you see any error about policies already existing — that is fine, just means
      you ran it before. The schema uses `IF NOT EXISTS` and `DROP ... IF EXISTS`.

---

## Step 3 — Verify the storage bucket was created

The SQL script creates the `library` bucket automatically. Let's confirm it worked:

1. Click **Storage** in the left sidebar
2. You should see a bucket called **`library`** with a globe icon (🌐) indicating it's public

   If it's NOT there:
   1. Click **New bucket**
   2. Name: `library`
   3. Toggle **Public bucket** → **ON**
   4. Click **Create bucket**

---

## Step 4 — Get your Supabase credentials

1. Click the **gear icon** (Settings) in the bottom-left sidebar
2. Click **API** in the Settings menu
3. You'll see two values you need:

   **Project URL**
   ```
   https://abcdefghijklmnop.supabase.co
   ```
   Copy this → this is your `SUPABASE_URL`

   **Project API keys** — find the row labelled `service_role`
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...
   ```
   Click **Reveal** → copy the full key → this is your `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️  Use the `service_role` key, NOT the `anon public` key.
       The service_role key has full database access — keep it secret.

---

## Step 5 — Add credentials to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these two variables:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (the service_role key) |

4. Make sure both are set for **Production**, **Preview**, and **Development**
5. Click **Save** for each one

---

## Step 6 — Redeploy

After adding the env vars, Vercel needs a new deploy to pick them up:

```bash
# In your project folder:
git add .
git commit -m "Configure Supabase storage"
git push
```

Vercel will automatically redeploy. Takes about 1–2 minutes.

---

## Step 7 — Test it

1. Open your live app
2. Log in as superuser
3. Click **Study Library** in the sidebar
4. Click **⬆️ Upload Folder** (creates a folder + uploads files in one step)
   — OR —
   Click **📁 New Folder** to create an empty folder, then click the ⬆️ icon on the folder to upload files

5. Select a PDF or image from your computer
6. Click **Upload**

The file should appear in the folder with a **↓ Download** link.

---

## How to verify files are actually in Supabase

1. Supabase dashboard → **Storage** → click the `library` bucket
2. You should see folders named by UUID (the folder IDs from the database)
3. Inside each folder, your uploaded files appear with timestamps in the filename

You can also check the database:
1. Supabase → **Table Editor**
2. Click `lib_folders` — you'll see your folder rows
3. Click `lib_files` — you'll see your file rows with `storage_path` values

---

## Troubleshooting

**"Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"**
→ The env vars aren't set in Vercel, or Vercel hasn't redeployed yet.
→ Check Vercel → Settings → Environment Variables → make sure both are there → redeploy.

**"Storage upload failed: new row violates row-level security policy"**
→ The SQL schema wasn't run, or the storage policies didn't apply.
→ Go back to Step 2 and run the schema SQL again.

**"Storage upload failed: Bucket not found"**
→ The `library` bucket doesn't exist.
→ Go to Supabase → Storage → create it manually (Step 3).

**Upload gets stuck at 0%**
→ Check the browser console (F12) for errors.
→ Most likely an env var issue — check Vercel settings.

**Files disappear after refresh**
→ The database tables weren't created.
→ Run the SQL schema (Step 2) and try again.

---

## Storage limits (free tier)

| Resource | Free limit |
|---|---|
| Storage space | 1 GB |
| Bandwidth per month | 5 GB |
| File uploads | Unlimited count |
| Max file size | 50 MB per file |

For a school library, 1 GB fits roughly:
- ~200 PDF textbook chapters (5 MB each)
- ~1,000 notes PDFs (500 KB each)
- ~2,500 worksheet scans (200 KB each)
