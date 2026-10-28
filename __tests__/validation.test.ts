import { createSeedData } from '../src/data/seed';
import { BookingInput, FieldInput } from '../src/types';
import {
  isValidDate,
  validateBooking,
  validateField,
} from '../src/utils/validation';
import { formatMoney } from '../src/utils/format';

const { fields } = createSeedData();
const field = fields[0];
const fieldInput: FieldInput = {
  name: 'Sân mới',
  type: '5 người',
  pricePerHour: '300000',
  status: 'Hoạt động',
};
const bookingInput: BookingInput = {
  customerName: 'Minh Anh',
  phone: '0901234567',
  date: '28/10/2026',
  startHour: '17',
  hours: '2',
};
const bookings = [
  {
    id: 'b1',
    fieldId: field.id,
    customerName: 'Khách',
    phone: '0901234567',
    date: '28/10/2026',
    startHour: 17,
    hours: 2,
  },
];

describe('Kiểm tra sân', () => {
  test('chấp nhận sân hợp lệ', () =>
    expect(validateField(fieldInput, fields)).toEqual({}));
  test('bắt tên trống', () =>
    expect(
      validateField({ ...fieldInput, name: '   ' }, fields).name,
    ).toBeDefined());
  test('bắt tên trùng bất kể chữ hoa và khoảng trắng', () =>
    expect(
      validateField({ ...fieldInput, name: '  sÂn a1 ' }, fields).name,
    ).toBeDefined());
  test('cho phép sửa mà giữ tên sân hiện tại', () =>
    expect(
      validateField({ ...fieldInput, name: field.name }, fields, field.id),
    ).toEqual({}));
  test.each(['', '0', '-1', 'abc', 'Infinity', 'NaN'])(
    'từ chối giá %s',
    pricePerHour => {
      expect(
        validateField({ ...fieldInput, pricePerHour }, fields).pricePerHour,
      ).toBeDefined();
    },
  );
  test('tiền được định dạng theo tiếng Việt', () =>
    expect(formatMoney(300000)).toBe('300.000 đ'));
});

describe('Kiểm tra ngày tháng', () => {
  test.each(['29/02/2024', '28/10/2026', '31/12/2026'])('chấp nhận %s', date =>
    expect(isValidDate(date)).toBe(true),
  );
  test.each([
    '29/02/2025',
    '31/04/2026',
    '00/10/2026',
    '15/13/2026',
    '1/1/2026',
    '2026-10-28',
    '28/10/0000',
    '',
  ])('từ chối %s', date => expect(isValidDate(date)).toBe(false));
});

describe('Đặt sân và giao nhau của các khung giờ', () => {
  test('chấp nhận lượt đặt hợp lệ', () =>
    expect(validateBooking(bookingInput, field, [])).toEqual({}));
  test('tên khách bắt buộc', () =>
    expect(
      validateBooking({ ...bookingInput, customerName: '  ' }, field, [])
        .customerName,
    ).toBeDefined());
  test.each(['1234567890', '091234567', '09123456789', '09a2345678', ''])(
    'từ chối SĐT %s',
    phone => {
      expect(
        validateBooking({ ...bookingInput, phone }, field, []).phone,
      ).toBeDefined();
    },
  );
  test.each(['5', '23', '17.5', 'NaN', ''])(
    'từ chối giờ bắt đầu %s',
    startHour => {
      expect(
        validateBooking({ ...bookingInput, startHour }, field, []).startHour,
      ).toBeDefined();
    },
  );
  test.each(['0', '4', '1.5', 'NaN', ''])('từ chối thời lượng %s', hours => {
    expect(
      validateBooking({ ...bookingInput, hours }, field, []).hours,
    ).toBeDefined();
  });
  test('cho phép kết thúc lúc 23h', () =>
    expect(
      validateBooking(
        { ...bookingInput, startHour: '22', hours: '1' },
        field,
        [],
      ),
    ).toEqual({}));
  test('từ chối kết thúc sau 23h', () =>
    expect(
      validateBooking(
        { ...bookingInput, startHour: '22', hours: '2' },
        field,
        [],
      ).hours,
    ).toBeDefined());
  test.each([
    ['18', '2'],
    ['17', '2'],
    ['16', '2'],
    ['16', '3'],
    ['18', '1'],
  ])('từ chối giao nhau %sh trong %s giờ', (startHour, hours) => {
    expect(
      validateBooking({ ...bookingInput, startHour, hours }, field, bookings)
        .startHour,
    ).toContain('Trùng lịch');
  });
  test.each([
    ['19', '1'],
    ['16', '1'],
    ['6', '3'],
  ])('cho phép không giao nhau %sh trong %s giờ', (startHour, hours) => {
    expect(
      validateBooking({ ...bookingInput, startHour, hours }, field, bookings),
    ).toEqual({});
  });
  test('cùng giờ khác ngày được phép', () =>
    expect(
      validateBooking({ ...bookingInput, date: '29/10/2026' }, field, bookings),
    ).toEqual({}));
  test('cùng giờ khác sân được phép', () =>
    expect(validateBooking(bookingInput, fields[1], bookings)).toEqual({}));
  test('từ chối sân bảo trì', () =>
    expect(validateBooking(bookingInput, fields[3], []).startHour).toContain(
      'bảo trì',
    ));
});
