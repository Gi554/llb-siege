import "server-only";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Uploaded pictures live outside /public (served by app/uploads/[...path]),
// so they are available right after upload without a rebuild.

export const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || "./storage/uploads");
export const PUBLIC_PREFIX = "/uploads/";
export const MAX_BYTES = 20 * 1024 * 1024;
export const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/tiff"];
const MAX_EDGE = 2560;

/**
 * Normalises a picture for the web: applies the camera orientation, strips
 * metadata (including GPS position), caps the longest edge and stores WebP.
 */
export async function storeImage(buffer: Buffer) {
  const now = new Date();
  const dir = path.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  const name = `${randomUUID()}.webp`;
  await fs.mkdir(path.join(UPLOAD_ROOT, dir), { recursive: true });

  const { data, info } = await sharp(buffer, { failOn: "error" })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(path.join(UPLOAD_ROOT, dir, name), data);

  return { src: `${PUBLIC_PREFIX}${dir.replace(/\\/g, "/")}/${name}`, width: info.width, height: info.height, bytes: info.size };
}

/** Resolves a public /uploads/… path to a file inside UPLOAD_ROOT, or null. */
export function resolveUpload(src: string) {
  if (!src.startsWith(PUBLIC_PREFIX)) return null;
  const file = path.resolve(UPLOAD_ROOT, src.slice(PUBLIC_PREFIX.length));
  return file.startsWith(UPLOAD_ROOT + path.sep) ? file : null;
}

export async function removeUpload(src: string) {
  const file = resolveUpload(src);
  if (file) await fs.rm(file, { force: true });
}
