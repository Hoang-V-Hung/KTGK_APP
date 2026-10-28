import { BookingInput, Field } from '../types';
import {
  isValidHours,
  isValidStartHour,
  validateBooking,
} from '../utils/validation';
import { BOOKING_RULES } from '../constants/rules';
import { calculateBookingTotal } from '../utils/booking';
import { showError } from '../utils/alerts';
import { useApp } from './useApp';
import { useValidatedForm } from './useValidatedForm';

export function useBookingForm(field: Field, onSaved: () => void) {
  const { bookings, addBooking, saving } = useApp();
  const form = useValidatedForm<BookingInput>(
    { customerName: '', phone: '', date: '', startHour: '', hours: '' },
    input => validateBooking(input, field, bookings),
  );
  const hours = Number(form.input.hours);
  const start = Number(form.input.startHour);
  const validHours = isValidHours(hours);
  const validRange =
    !!form.input.startHour.trim() &&
    isValidStartHour(start) &&
    validHours &&
    start + hours <= BOOKING_RULES.latestEndHour;
  // Công thức tính tiền nằm ở đây; giao diện chỉ hiển thị kết quả.
  const total = validHours
    ? calculateBookingTotal(field.pricePerHour, hours)
    : 0;

  async function submit() {
    if (saving || !form.validateForSubmit()) {
      return;
    }
    try {
      await addBooking(field.id, form.input);
      onSaved();
    } catch (error) {
      showError(error);
    }
  }
  return { ...form, saving, hours, start, validRange, total, submit };
}
