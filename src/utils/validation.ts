import { Booking, BookingInput, Field, FieldInput, FormErrors } from '../types';
import { formatTime } from './format';
import { BOOKING_RULES, FIELD_STATUSES, FIELD_TYPES } from '../constants/rules';

export function isValidPhone(phone: string): boolean {
  return /^0\d+$/.test(phone) && phone.length === BOOKING_RULES.phoneLength;
}

export function isValidStartHour(hour: number): boolean {
  return (
    Number.isInteger(hour) &&
    hour >= BOOKING_RULES.earliestStartHour &&
    hour <= BOOKING_RULES.latestStartHour
  );
}

export function isValidHours(hours: number): boolean {
  return (
    Number.isInteger(hours) &&
    hours >= BOOKING_RULES.minHours &&
    hours <= BOOKING_RULES.maxHours
  );
}

export function isValidDate(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return false;
  }
  const [day, month, year] = value.split('/').map(Number);
  if (year < 1000 || month < 1 || month > 12 || day < 1) {
    return false;
  }
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function validateField(
  input: FieldInput,
  fields: Field[],
  editingId?: string,
): FormErrors<FieldInput> {
  const errors: FormErrors<FieldInput> = {};
  const name = input.name.trim().normalize('NFC').toLocaleLowerCase('vi-VN');
  if (!name) {
    errors.name = 'Vui lòng nhập tên sân.';
  } else if (
    fields.some(
      field =>
        field.id !== editingId &&
        field.name.trim().normalize('NFC').toLocaleLowerCase('vi-VN') === name,
    )
  ) {
    errors.name = 'Tên sân đã tồn tại. Vui lòng chọn tên khác.';
  }
  const price = Number(input.pricePerHour.trim());
  if (!Number.isFinite(price) || price <= 0) {
    errors.pricePerHour = 'Giá thuê phải là một số lớn hơn 0.';
  }
  if (!FIELD_TYPES.includes(input.type)) {
    errors.type = 'Vui lòng chọn loại sân hợp lệ.';
  }
  if (!FIELD_STATUSES.includes(input.status)) {
    errors.status = 'Vui lòng chọn trạng thái hợp lệ.';
  }
  return errors;
}

export function validateBooking(
  input: BookingInput,
  field: Field,
  bookings: Booking[],
): FormErrors<BookingInput> {
  const errors: FormErrors<BookingInput> = {};
  if (!input.customerName.trim()) {
    errors.customerName = 'Vui lòng nhập tên khách hàng.';
  }
  if (!isValidPhone(input.phone.trim())) {
    errors.phone = `Số điện thoại phải gồm ${BOOKING_RULES.phoneLength} chữ số và bắt đầu bằng 0.`;
  }
  if (!isValidDate(input.date.trim())) {
    errors.date = 'Nhập ngày có thực theo định dạng dd/mm/yyyy.';
  }
  const startHour = Number(input.startHour);
  const hours = Number(input.hours);
  if (!input.startHour.trim() || !isValidStartHour(startHour)) {
    errors.startHour = `Giờ bắt đầu phải là số nguyên từ ${BOOKING_RULES.earliestStartHour} đến ${BOOKING_RULES.latestStartHour}.`;
  }
  if (!input.hours.trim() || !isValidHours(hours)) {
    errors.hours = `Số giờ thuê phải là số nguyên từ ${BOOKING_RULES.minHours} đến ${BOOKING_RULES.maxHours}.`;
  }
  if (
    !errors.startHour &&
    !errors.hours &&
    startHour + hours > BOOKING_RULES.latestEndHour
  ) {
    errors.hours = `Giờ kết thúc không được quá ${formatTime(
      BOOKING_RULES.latestEndHour,
    )}.`;
  }
  if (!errors.date && !errors.startHour && !errors.hours) {
    // Hai lịch trùng nhau nếu lịch mới bắt đầu trước khi lịch cũ kết thúc
    // VÀ lịch cũ bắt đầu trước khi lịch mới kết thúc.
    // Dùng dấu < để cho phép hai lịch nối tiếp: 17–19 và 19–20.
    const overlap = bookings.find(
      booking =>
        booking.fieldId === field.id &&
        booking.date === input.date.trim() &&
        startHour < booking.startHour + booking.hours &&
        booking.startHour < startHour + hours,
    );
    if (overlap) {
      errors.startHour = `Trùng lịch ${formatTime(
        overlap.startHour,
      )}–${formatTime(
        overlap.startHour + overlap.hours,
      )}. Vui lòng chọn khung giờ khác.`;
    }
  }
  if (field.status === 'Bảo trì') {
    errors.startHour = 'Sân đang bảo trì, chưa thể nhận đặt sân.';
  }
  return errors;
}
