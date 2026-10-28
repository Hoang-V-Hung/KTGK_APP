export function formatMoney(amount: number): string {
  return `${amount.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} đ`;
}
export function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}/${date.getFullYear()}`;
}
export function dateKey(date: string): number {
  const [day, month, year] = date.split('/').map(Number);
  return year * 10000 + month * 100 + day;
}
export function formatTime(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}
export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
