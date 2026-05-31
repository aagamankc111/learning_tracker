export function calculateProgress(completed, total) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
