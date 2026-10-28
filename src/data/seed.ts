import { AppData } from '../types';
import { formatDate } from '../utils/format';

export function createSeedData(): AppData {
  const today = formatDate(new Date());
  return {
    fields: [
      {
        id: 'field-a1',
        name: 'Sân A1',
        type: '5 người',
        pricePerHour: 300000,
        status: 'Hoạt động',
      },
      {
        id: 'field-a2',
        name: 'Sân A2',
        type: '5 người',
        pricePerHour: 350000,
        status: 'Hoạt động',
      },
      {
        id: 'field-b1',
        name: 'Sân B1',
        type: '7 người',
        pricePerHour: 500000,
        status: 'Hoạt động',
      },
      {
        id: 'field-b2',
        name: 'Sân B2',
        type: '7 người',
        pricePerHour: 450000,
        status: 'Bảo trì',
      },
    ],
    bookings: [
      {
        id: 'booking-1',
        fieldId: 'field-a1',
        customerName: 'Nguyễn Minh Anh',
        phone: '0901234567',
        date: today,
        startHour: 17,
        hours: 2,
      },
      {
        id: 'booking-2',
        fieldId: 'field-a1',
        customerName: 'Trần Quốc Huy',
        phone: '0912345678',
        date: today,
        startHour: 20,
        hours: 1,
      },
      {
        id: 'booking-3',
        fieldId: 'field-b1',
        customerName: 'Lê Hoàng Nam',
        phone: '0987654321',
        date: today,
        startHour: 18,
        hours: 2,
      },
    ],
  };
}
