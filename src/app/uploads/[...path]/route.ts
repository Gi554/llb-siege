import fs from "node:fs/promises";
import path from "node:path";
import { resolveUpload } from "@/lib/storage";

const TYPES: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".avif": "image/avif" };

// Serves uploaded pictures. File names are random and never reused,
// so they can be cached for good.
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const file = resolveUpload(`/uploads/${(await params).path.join("/")}`);
  const type = file && TYPES[path.extname(file).toLowerCase()];
  if (!file || !type) return new Response("Introuvable", { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
