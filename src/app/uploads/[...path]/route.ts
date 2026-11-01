import path from "node:path";
import { readUpload } from "@/lib/storage";

const TYPES: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".avif": "image/avif" };

// Serves uploaded pictures. File names are random and never reused,
// so they can be cached for good.
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const src = `/uploads/${(await params).path.join("/")}`;
  const type = TYPES[path.extname(src).toLowerCase()];
  const data = type ? await readUpload(src) : null;
  if (!data) return new Response("Introuvable", { status: 404 });
  return new Response(data, {
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
  });
}
