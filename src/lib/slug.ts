/** "Gros œuvre & finitions" → "gros-oeuvre-finitions" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "element";
}

/** Appends -2, -3… until `exists` returns false. */
export async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>) {
  let slug = slugify(base);
  for (let i = 2; await exists(slug); i++) slug = `${slugify(base)}-${i}`;
  return slug;
}
