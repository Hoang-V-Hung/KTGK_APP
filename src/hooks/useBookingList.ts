import { useState } from 'react';
import { formatDate } from '../utils/format';
import { compareBookings } from '../utils/booking';
import { useApp } from './useApp';

export const BOOKING_FILTERS = ['Tất cả', 'Hôm nay'] as const;
type BookingFilter = (typeof BOOKING_FILTERS)[number];

export function useBookingList() {
  const { fields, bookings } = useApp();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<BookingFilter>('Tất cả');
  const today = formatDate(new Date());
  const keyword = search.trim().toLocaleLowerCase('vi-VN');
  const visibleBookings = bookings
    .filter(booking => {
      const field = fields.find(item => item.id === booking.fieldId);
      const searchText = `${booking.customerName} ${booking.phone} ${
        field?.name ?? ''
      }`.toLocaleLowerCase('vi-VN');
      const matchesDate = period === 'Tất cả' || booking.date === today;
      return matchesDate && searchText.includes(keyword);
    })
    .sort(compareBookings);
  return {
    fields,
    bookings,
    visibleBookings,
    search,
    setSearch,
    period,
    setPeriod,
  };
}
