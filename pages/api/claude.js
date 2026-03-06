// pages/api/claude.js
// Secure server-side proxy for Anthropic API.
// Supports plain text AND vision (multipart content with base64 images).

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 25 MB — enough for high-res photos
export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in Vercel environment variables." });
  }

  try {
    const { system, messages, max_tokens = 1200 } = req.body;

    if (!messages?.length) return res.status(400).json({ error: "messages required" });

    // Normalise messages — pass multipart arrays through, stringify everything else
    const normalised = messages.map(m => ({
      role: m.role,
      content: Array.isArray(m.content) ? m.content : String(m.content || ""),
    }));

    const params = {
      model: "claude-haiku-4-5-20251001",
      max_tokens,
      messages: normalised,
    };
    if (system) params.system = system;

    const response = await client.messages.create(params);
    return res.status(200).json(response);

  } catch (err) {
    console.error("[claude.js] error:", err.message);

    // Return the error clearly so the bubble shows something useful
    return res.status(err.status || 500).json({
      error: err.message || "Claude API error",
      content: [{ type: "text", text: "⚠️ AI error: " + (err.message || "Unknown error") }]
    });
  }
}
