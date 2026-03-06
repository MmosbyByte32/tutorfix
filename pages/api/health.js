// pages/api/health.js  — delete after confirming env vars work
export default function handler(req, res) {
  return res.status(200).json({
    SUPABASE_URL:              !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_API_KEY:         !!process.env.ANTHROPIC_API_KEY,
    SUPABASE_URL_value_start:  process.env.SUPABASE_URL?.slice(0, 30) || "NOT SET",
  });
}
