// pages/api/auth/login.js

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const url     = process.env.SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Log what we have (values hidden, just presence)
  console.log("[login] SUPABASE_URL present:", !!url);
  console.log("[login] SUPABASE_SERVICE_ROLE_KEY present:", !!service);

  if (!url) {
    return res.status(500).json({ error: "SUPABASE_URL is not set. Add it in Vercel → Settings → Environment Variables then redeploy." });
  }
  if (!service) {
    return res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel → Settings → Environment Variables then redeploy." });
  }

  try {
    // Use service role key for everything — it works for both auth and DB
    const supabase = createClient(url, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Look up user directly in auth.users via admin API
    const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      return res.status(500).json({ error: "Auth admin error: " + listErr.message });
    }

    const user = userList.users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    // Verify password by signing in with a standard client using service key as anon fallback
    const signInClient = createClient(url, service, {
      auth: { persistSession: false },
    });

    const { data: signInData, error: signInError } = await signInClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const userId    = signInData.user.id;
    const userEmail = signInData.user.email;

    // Check role in profiles table
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileErr || !profile) {
      return res.status(403).json({
        error: "No profile found. Run this in Supabase SQL Editor: insert into profiles (id, role) select id, 'superuser' from auth.users where email = '" + userEmail + "' on conflict (id) do update set role = 'superuser';"
      });
    }

    if (profile.role !== "superuser") {
      return res.status(403).json({ error: "Access denied — superuser role required." });
    }

    return res.status(200).json({ uid: userId, email: userEmail, role: profile.role });

  } catch (err) {
    console.error("[auth/login] error:", err.message);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
