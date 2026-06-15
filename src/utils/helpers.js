export function calculateProgress(completed, total) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function localDateStr(date) {
  return date.toISOString().split('T')[0];
}
