/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Explicitly expose server-side env vars to API routes
  env: {
    SUPABASE_URL:              process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_API_KEY:         process.env.ANTHROPIC_API_KEY,
  },
};
