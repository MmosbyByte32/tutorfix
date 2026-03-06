// pages/api/library.js
// Server-side proxy for all Supabase library operations.
// The Supabase service_role key NEVER reaches the browser.

import { createClient } from "@supabase/supabase-js";

const BUCKET = "library";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — add them in Vercel → Settings → Environment Variables."
  );
  return createClient(url, key, { auth: { persistSession: false } });
}

export const config = { api: { bodyParser: { sizeLimit: "55mb" } } };

function detectType(mime = "", name = "") {
  const m = mime.toLowerCase(), n = name.toLowerCase();
  if (m.includes("pdf") || n.endsWith(".pdf")) return "pdf";
  if (m.startsWith("image/") || /\.(png|jpg|jpeg|gif|webp|svg)$/.test(n)) return "image";
  return "file";
}

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
}

function publicUrl(supabase, path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data?.publicUrl || null;
}

function fmtFile(row, supabase) {
  return {
    id: row.id, folder_id: row.folder_id,
    name: row.name, type: row.type, size: row.size,
    storage_path: row.storage_path,
    added: row.created_at ? row.created_at.split("T")[0] : "",
    url: row.storage_path ? publicUrl(supabase, row.storage_path) : null,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let sb;
  try { sb = getSupabase(); } catch (e) { return res.status(500).json({ error: e.message }); }

  const { action, ...p } = req.body || {};
  if (!action) return res.status(400).json({ error: "action required" });

  try {

    // ── GET FOLDERS ──────────────────────────────────────────────
    if (action === "getFolders") {
      const { data, error } = await sb
        .from("lib_folders")
        .select("*, lib_files(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json({
        folders: (data || []).map(f => ({
          id: f.id, name: f.name, grade: f.grade,
          curriculum: f.curriculum, subject: f.subject,
          status: f.status,
          created: f.created_at?.split("T")[0] || "",
          files: (f.lib_files || []).map(x => fmtFile(x, sb)),
        })),
      });
    }

    // ── CREATE FOLDER ────────────────────────────────────────────
    if (action === "createFolder") {
      const { name, grade, curriculum, subject } = p;
      if (!name?.trim()) return res.status(400).json({ error: "name required" });
      const { data, error } = await sb.from("lib_folders")
        .insert({ name: name.trim(), grade: grade || "All Students", curriculum: curriculum || "CAPS", subject: subject || "General", status: "active" })
        .select().single();
      if (error) throw error;
      return res.status(200).json({ folder: { id: data.id, name: data.name, grade: data.grade, curriculum: data.curriculum, subject: data.subject, status: data.status, created: data.created_at?.split("T")[0] || "", files: [] } });
    }

    // ── SET STATUS ───────────────────────────────────────────────
    if (action === "setStatus") {
      const { id, status } = p;
      if (!id) return res.status(400).json({ error: "id required" });
      if (!["active","hidden","archived"].includes(status)) return res.status(400).json({ error: "invalid status" });
      const { error } = await sb.from("lib_folders").update({ status }).eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    // ── DELETE FOLDER ────────────────────────────────────────────
    if (action === "deleteFolder") {
      const { id } = p;
      if (!id) return res.status(400).json({ error: "id required" });
      const { data: files } = await sb.from("lib_files").select("storage_path").eq("folder_id", id);
      if (files?.length) {
        const paths = files.map(f => f.storage_path).filter(Boolean);
        if (paths.length) await sb.storage.from(BUCKET).remove(paths).catch(e => console.warn("storage remove:", e.message));
      }
      await sb.from("lib_files").delete().eq("folder_id", id);
      const { error } = await sb.from("lib_folders").delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    // ── UPLOAD FILE ──────────────────────────────────────────────
    if (action === "uploadFile") {
      const { folderId, name, size, mimeType, data: b64 } = p;
      if (!folderId) return res.status(400).json({ error: "folderId required" });
      if (!name)     return res.status(400).json({ error: "name required" });
      if (!b64)      return res.status(400).json({ error: "file data required" });

      const buffer = Buffer.from(b64, "base64");
      const fileType   = detectType(mimeType, name);
      const storagePath = `${folderId}/${Date.now()}_${safeName(name)}`;
      const contentType = mimeType || "application/octet-stream";

      const { error: upErr } = await sb.storage.from(BUCKET).upload(storagePath, buffer, { contentType, upsert: false });
      if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

      const fileSize = size || (buffer.length > 1048576 ? (buffer.length/1048576).toFixed(1)+" MB" : Math.round(buffer.length/1024)+" KB");

      const { data: row, error: dbErr } = await sb.from("lib_files")
        .insert({ folder_id: folderId, name, type: fileType, size: fileSize, storage_path: storagePath })
        .select().single();

      if (dbErr) {
        await sb.storage.from(BUCKET).remove([storagePath]).catch(() => {});
        throw dbErr;
      }

      return res.status(200).json({ file: fmtFile(row, sb) });
    }

    // ── DELETE FILE ──────────────────────────────────────────────
    if (action === "deleteFile") {
      const { fileId } = p;
      if (!fileId) return res.status(400).json({ error: "fileId required" });
      const { data: row } = await sb.from("lib_files").select("storage_path").eq("id", fileId).single();
      if (row?.storage_path) await sb.storage.from(BUCKET).remove([row.storage_path]).catch(e => console.warn("storage remove:", e.message));
      const { error } = await sb.from("lib_files").delete().eq("id", fileId);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: `Unknown action: "${action}"` });

  } catch (err) {
    console.error(`[library] action=${action}`, err);
    return res.status(500).json({ error: err.message || "Library operation failed" });
  }
}
