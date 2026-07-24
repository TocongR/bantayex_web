export function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

export function formatViolationType(type) {
  return String(type || '')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}