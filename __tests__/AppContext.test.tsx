import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from '../src/contexts/AppContext';
import { useApp } from '../src/hooks/useApp';
import { loadData } from '../src/services/storage';
import { formatDate } from '../src/utils/format';

let app: ReturnType<typeof useApp>;
let renderer: ReactTestRenderer.ReactTestRenderer;
function Probe() {
  app = useApp();
  return null;
}
beforeEach(async () => {
  jest.restoreAllMocks();
  await AsyncStorage.clear();
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
});
afterEach(async () => {
  await act(async () => renderer.unmount());
});

test('cấm xoá sân còn lượt đặt', async () => {
  await act(async () => {
    await expect(app.deleteField('field-a1')).rejects.toThrow(
      'đang có lượt đặt',
    );
  });
  expect(app.fields).toHaveLength(4);
});
test('huỷ hết lượt đặt rồi xoá sân và đọc lại', async () => {
  const ids = app.bookings
    .filter(item => item.fieldId === 'field-a1')
    .map(item => item.id);
  for (const id of ids) {
    await act(async () => {
      await app.cancelBooking(id);
    });
  }
  await act(async () => {
    await app.deleteField('field-a1');
  });
  expect(app.fields).toHaveLength(3);
  expect((await loadData()).fields.some(item => item.id === 'field-a1')).toBe(
    false,
  );
});
test('thêm, sửa dùng chung và lưu đầy đủ thông tin', async () => {
  await act(async () => {
    await app.saveField({
      name: 'Sân C1',
      type: '7 người',
      pricePerHour: '600000',
      status: 'Hoạt động',
    });
  });
  const added = app.fields.find(item => item.name === 'Sân C1')!;
  await act(async () => {
    await app.saveField(
      { ...added, name: 'Sân C2', pricePerHour: '650000', status: 'Bảo trì' },
      added.id,
    );
  });
  expect(app.fields).toHaveLength(5);
  expect(
    (await loadData()).fields.find(item => item.id === added.id),
  ).toMatchObject({ name: 'Sân C2', pricePerHour: 650000, status: 'Bảo trì' });
});
test('kiểm tra trùng lịch lại ngay tại nơi lưu', async () => {
  const input = {
    customerName: 'Khách mới',
    phone: '0901234567',
    date: formatDate(new Date()),
    startHour: '18',
    hours: '2',
  };
  await act(async () => {
    await expect(app.addBooking('field-a1', input)).rejects.toThrow(
      'Trùng lịch',
    );
  });
  await act(async () => {
    await app.addBooking('field-a1', { ...input, startHour: '19', hours: '1' });
  });
  expect(app.bookings).toHaveLength(4);
});
test('lỗi lưu không làm thay đổi dữ liệu đang hiển thị', async () => {
  jest
    .spyOn(AsyncStorage, 'setItem')
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await expect(app.deleteField('field-a2')).rejects.toThrow('Không thể lưu');
  });
  expect(app.fields).toHaveLength(4);
  expect((await loadData()).fields).toHaveLength(4);
});
test('không cho đặt sân bảo trì', async () => {
  await act(async () => {
    await expect(
      app.addBooking('field-b2', {
        customerName: 'Khách',
        phone: '0901234567',
        date: '28/10/2026',
        startHour: '6',
        hours: '1',
      }),
    ).rejects.toThrow('bảo trì');
  });
});
