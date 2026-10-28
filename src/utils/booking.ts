import { Booking } from '../types';
import { dateKey } from './format';

// Đổi công thức tại đây nếu được yêu cầu thêm giảm giá hoặc phụ thu.
// Modal và thẻ lịch đặt đều gọi hàm này nên số tiền luôn giống nhau.
export function calculateBookingTotal(
  pricePerHour: number,
  hours: number,
): number {
  return pricePerHour * hours;
}

export function compareBookings(first: Booking, second: Booking): number {
  const dateDifference = dateKey(first.date) - dateKey(second.date);
  if (dateDifference !== 0) {
    return dateDifference;
  }
  return first.startHour - second.startHour;
}
