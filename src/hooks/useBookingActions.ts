import { Alert } from 'react-native';
import { Booking } from '../types';
import { formatTime } from '../utils/format';
import { showError } from '../utils/alerts';
import { useApp } from './useApp';

// Dùng chung cho lịch toàn bộ cụm sân và lịch trong chi tiết từng sân.
export function useBookingActions() {
  const { cancelBooking, saving } = useApp();
  function requestCancel(booking: Booking) {
    Alert.alert(
      'Huỷ lượt đặt?',
      `Huỷ lịch của ${booking.customerName} vào ${booking.date}, ${formatTime(
        booking.startHour,
      )}–${formatTime(booking.startHour + booking.hours)}?`,
      [
        { text: 'Giữ lại', style: 'cancel' },
        {
          text: 'Huỷ lượt đặt',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id).catch(showError);
          },
        },
      ],
    );
  }
  return { requestCancel, saving };
}
