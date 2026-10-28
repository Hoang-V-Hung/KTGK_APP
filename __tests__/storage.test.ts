import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadData, saveData, STORAGE_KEY } from '../src/services/storage';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});
test('lần đầu tạo 4 sân, 3 lượt đặt và lưu ngay', async () => {
  const data = await loadData();
  expect(data.fields).toHaveLength(4);
  expect(data.bookings).toHaveLength(3);
  expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!)).toEqual(data);
});
test('đọc lại đầy đủ các thay đổi', async () => {
  const data = await loadData();
  data.fields[0].name = 'Sân đã sửa';
  data.bookings = [];
  await saveData(data);
  expect(await loadData()).toEqual(data);
});
test('danh sách rỗng vẫn rỗng khi mở lại, không tự tạo mẫu', async () => {
  await saveData({ fields: [], bookings: [] });
  expect(await loadData()).toEqual({ fields: [], bookings: [] });
});
test('lỗi đọc không ghi đè dữ liệu bằng mẫu', async () => {
  await AsyncStorage.setItem(STORAGE_KEY, '{invalid');
  await expect(loadData()).rejects.toThrow();
  expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe('{invalid');
});
test('phát hiện lịch đặt tham chiếu tới sân không tồn tại', async () => {
  const data = await loadData();
  data.fields = [];
  await saveData(data);
  await expect(loadData()).rejects.toThrow('không hợp lệ');
});
test('lỗi lưu được báo lên nơi gọi', async () => {
  jest
    .spyOn(AsyncStorage, 'setItem')
    .mockRejectedValueOnce(new Error('disk full'));
  await expect(saveData({ fields: [], bookings: [] })).rejects.toThrow(
    'disk full',
  );
});
