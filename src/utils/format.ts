export function isIsoDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

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
