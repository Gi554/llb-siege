import "server-only";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Uploaded pictures live outside /public (served by app/uploads/[...path]),
// so they are available right after upload without a rebuild.
// They go to a local folder, or to Netlify Blobs when UPLOAD_STORAGE=netlify
// (Netlify functions have no persistent disk).

export const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || "./storage/uploads");
export const PUBLIC_PREFIX = "/uploads/";
export const MAX_BYTES = 20 * 1024 * 1024;
export const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/tiff"];
const MAX_EDGE = 2560;

const useBlobs = () => process.env.UPLOAD_STORAGE === "netlify";
const blobStore = async () => (await import("@netlify/blobs")).getStore({ name: "uploads", consistency: "strong" });

/**
 * Normalises a picture for the web: applies the camera orientation, strips
 * metadata (including GPS position), caps the longest edge and stores WebP
 * (transparency is kept, which matters for logos).
 */
export async function storeImage(buffer: Buffer, { maxEdge = MAX_EDGE, density }: { maxEdge?: number; density?: number } = {}) {
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}.webp`;

  // `density` sets the rendering resolution of vector files (SVG logos).
  const { data, info } = await sharp(buffer, { failOn: "error", density })
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  if (useBlobs()) {
    await (await blobStore()).set(key, new Uint8Array(data).buffer);
  } else {
    const file = path.join(UPLOAD_ROOT, key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, data);
  }

  return { src: `${PUBLIC_PREFIX}${key}`, width: info.width, height: info.height, bytes: info.size };
}

/** Turns a public /uploads/… path into a storage key, or null if it points elsewhere. */
function uploadKey(src: string) {
  if (!src.startsWith(PUBLIC_PREFIX)) return null;
  const key = path.posix.normalize(src.slice(PUBLIC_PREFIX.length));
  return key && !key.startsWith(".") && !key.includes("\\") && !path.posix.isAbsolute(key) ? key : null;
}

/** Reads an uploaded file, or null when it does not exist. */
export async function readUpload(src: string): Promise<Uint8Array<ArrayBuffer> | null> {
  const key = uploadKey(src);
  if (!key) return null;
  if (useBlobs()) {
    const data = await (await blobStore()).get(key, { type: "arrayBuffer" });
    return data ? new Uint8Array(data) : null;
  }
  const file = path.resolve(UPLOAD_ROOT, key);
  if (!file.startsWith(UPLOAD_ROOT + path.sep)) return null;
  return fs.readFile(file).then((b) => new Uint8Array(b), () => null);
}

export async function removeUpload(src: string) {
  const key = uploadKey(src);
  if (!key) return;
  if (useBlobs()) await (await blobStore()).delete(key);
  else {
    const file = path.resolve(UPLOAD_ROOT, key);
    if (file.startsWith(UPLOAD_ROOT + path.sep)) await fs.rm(file, { force: true });
  }
}
