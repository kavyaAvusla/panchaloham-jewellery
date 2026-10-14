export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === "") {
    return "Price to be confirmed";
  }
  const n = Number(price);
  if (Number.isNaN(n)) return "Price to be confirmed";
  return "\u20B9" + n.toLocaleString("en-IN");
}

export function hasPrice(price: number | string | null | undefined): boolean {
  if (price === null || price === undefined || price === "") return false;
  return !Number.isNaN(Number(price));
}

export function initials(text: string | null | undefined): string {
  if (!text) return "\u25C6";
  const parts = text.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "\u25C6";
}
