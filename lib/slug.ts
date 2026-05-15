export function toCanonicalSlug(parts: Array<string | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .map((part) => part.toLowerCase().trim().replaceAll("/", "-"))
    .join("-");
}

export function splitSlug(slug: string): string[] {
  if (!slug) return [];
  if (slug.includes("/")) {
    return slug.split("/").map((part) => part.trim()).filter(Boolean);
  }
  return slug.split("-").map((part) => part.trim()).filter(Boolean);
}
