import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Booking, Field } from '../types';
import { createSeedData } from '../data/seed';
import {
  isValidDate,
  isValidHours,
  isValidPhone,
  isValidStartHour,
} from '../utils/validation';
import { BOOKING_RULES, FIELD_STATUSES, FIELD_TYPES } from '../constants/rules';

export const STORAGE_KEY = '@football-fields/data-v1';
function isField(value: unknown): value is Field {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const field = value as Field;
  return (
    typeof field.id === 'string' &&
    !!field.id &&
    typeof field.name === 'string' &&
    !!field.name.trim() &&
    FIELD_TYPES.includes(field.type) &&
    FIELD_STATUSES.includes(field.status) &&
    typeof field.pricePerHour === 'number' &&
    Number.isFinite(field.pricePerHour) &&
    field.pricePerHour > 0
  );
}
function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const booking = value as Booking;
  return (
    typeof booking.id === 'string' &&
    !!booking.id &&
    typeof booking.fieldId === 'string' &&
    typeof booking.customerName === 'string' &&
    !!booking.customerName.trim() &&
    typeof booking.phone === 'string' &&
    isValidPhone(booking.phone) &&
    typeof booking.date === 'string' &&
    isValidDate(booking.date) &&
    isValidStartHour(booking.startHour) &&
    isValidHours(booking.hours) &&
    booking.startHour + booking.hours <= BOOKING_RULES.latestEndHour
  );
}
export async function saveData(data: AppData): Promise<void> {
  // Lưu sân và lịch đặt trong cùng một bản dữ liệu để chúng luôn đồng bộ.
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export async function loadData(): Promise<AppData> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    const seed = createSeedData();
    await saveData(seed);
    return seed;
  }
  const data = JSON.parse(saved) as AppData;
  if (
    !data ||
    !Array.isArray(data.fields) ||
    !Array.isArray(data.bookings) ||
    !data.fields.every(isField) ||
    !data.bookings.every(isBooking) ||
    new Set(data.fields.map(field => field.id)).size !== data.fields.length ||
    new Set(data.bookings.map(booking => booking.id)).size !==
      data.bookings.length ||
    data.bookings.some(
      booking => !data.fields.some(field => field.id === booking.fieldId),
    )
  ) {
    throw new Error('Dữ liệu lưu trữ không hợp lệ.');
  }
  return data;
}
