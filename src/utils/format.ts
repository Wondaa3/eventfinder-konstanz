export function isIsoDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

// Aus "2026-06-20" wird "20. Juni 2026". Alte Einträge wie "20. Juni"
// bleiben unverändert stehen.
export function formatDate(date: string) {
  if (!isIsoDate(date)) return date;
  return new Date(date).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPrice(price: number) {
  return price === 0 ? "kostenlos" : `${price} €`;
}
