import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text } from 'react-native';
import { useApp } from '../src/hooks/useApp';
import { createSeedData } from '../src/data/seed';
import { FieldListScreen } from '../src/screens/FieldListScreen';
import { FieldFormScreen } from '../src/screens/FieldFormScreen';
import { FieldDetailScreen } from '../src/screens/FieldDetailScreen';
import { BookingModal } from '../src/components/BookingModal';
import { FieldCard } from '../src/components/FieldCard';
import { FormField } from '../src/components/FormField';
import { Button } from '../src/components/Button';
import { SearchInput } from '../src/components/SearchInput';
import { FilterChips } from '../src/components/FilterChips';
import { BookingListScreen } from '../src/screens/BookingListScreen';
import { BookingCard } from '../src/components/BookingCard';
import { EmptyState } from '../src/components/EmptyState';
import { formatDate } from '../src/utils/format';

jest.mock('../src/hooks/useApp', () => ({ useApp: jest.fn() }));
const mockUseApp = jest.mocked(useApp);
let renderer: ReactTestRenderer.ReactTestRenderer;
let data: ReturnType<typeof useApp>;
const navigate = jest.fn();
const goBack = jest.fn();
const navigation = { navigate, goBack } as never;

beforeEach(() => {
  jest.clearAllMocks();
  data = {
    ...createSeedData(),
    saving: false,
    saveField: jest.fn().mockResolvedValue(undefined),
    deleteField: jest.fn().mockResolvedValue(undefined),
    addBooking: jest.fn().mockResolvedValue(undefined),
    cancelBooking: jest.fn().mockResolvedValue(undefined),
  };
  mockUseApp.mockImplementation(() => data);
});
afterEach(async () => {
  if (renderer) {
    await act(async () => renderer.unmount());
  }
  jest.restoreAllMocks();
});
async function render(element: React.ReactElement) {
  await act(async () => {
    renderer = ReactTestRenderer.create(element);
  });
}
async function press(title: string) {
  await act(async () => {
    await renderer.root
      .findAllByType(Button)
      .find(button => button.props.title === title)!
      .props.onPress();
  });
}
async function fill(label: string, value: string) {
  await act(async () => {
    renderer.root
      .findAllByType(FormField)
      .find(input => input.props.label === label)!
      .props.onChangeText(value);
  });
}

test('danh sách hiển thị đủ sân và chặn xoá sân có lịch bằng Alert', async () => {
  const alert = jest.spyOn(Alert, 'alert');
  await render(<FieldListScreen navigation={navigation} />);
  expect(renderer.root.findAllByType(FieldCard)).toHaveLength(4);
  await act(async () =>
    renderer.root.findAllByType(FieldCard)[0].props.onDelete(),
  );
  expect(alert).toHaveBeenCalledWith(
    'Không thể xoá sân',
    expect.stringContaining('đang có lượt đặt'),
  );
  expect(data.deleteField).not.toHaveBeenCalled();
});
test('xoá sân chỉ thực hiện sau khi chọn nút xác nhận', async () => {
  const alert = jest.spyOn(Alert, 'alert');
  await render(<FieldListScreen navigation={navigation} />);
  await act(async () =>
    renderer.root.findAllByType(FieldCard)[1].props.onDelete(),
  );
  expect(data.deleteField).not.toHaveBeenCalled();
  const confirm = alert.mock.calls[0][2]!.find(
    button => button.style === 'destructive',
  )!;
  await act(async () => {
    confirm.onPress!();
  });
  expect(data.deleteField).toHaveBeenCalledWith('field-a2');
});
test('form trống báo lỗi ngay dưới ô và không lưu', async () => {
  await render(
    <FieldFormScreen
      navigation={navigation}
      route={{ key: 'form', name: 'FieldForm' }}
    />,
  );
  await press('Thêm sân');
  const inputs = renderer.root.findAllByType(FormField);
  expect(
    inputs.find(input => input.props.label === 'Tên sân')!.props.error,
  ).toBeDefined();
  expect(
    inputs.find(input => input.props.label.includes('Giá thuê'))!.props.error,
  ).toBeDefined();
  expect(data.saveField).not.toHaveBeenCalled();
});
test('form sửa điền sẵn dữ liệu và lưu cùng ID', async () => {
  await render(
    <FieldFormScreen
      navigation={navigation}
      route={{
        key: 'form',
        name: 'FieldForm',
        params: { fieldId: 'field-a1' },
      }}
    />,
  );
  expect(renderer.root.findAllByType(FormField)[0].props.value).toBe('Sân A1');
  await fill('Tên sân', 'Sân A1 mới');
  await press('Lưu thay đổi');
  expect(data.saveField).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Sân A1 mới' }),
    'field-a1',
  );
});
test('chi tiết sân bảo trì khoá nút đặt', async () => {
  await render(
    <FieldDetailScreen
      navigation={navigation}
      route={{
        key: 'detail',
        name: 'FieldDetail',
        params: { fieldId: 'field-b2' },
      }}
    />,
  );
  expect(
    renderer.root
      .findAllByType(Button)
      .find(button => button.props.title === 'Đặt sân')!.props.disabled,
  ).toBe(true);
});
test('Modal cập nhật thành tiền và chặn giờ giao nhau trước khi lưu', async () => {
  await render(<BookingModal field={data.fields[0]} onClose={jest.fn()} />);
  await fill('Số giờ thuê', '2');
  expect(
    renderer.root
      .findAllByType(Text)
      .some(node => node.props.children === '600.000 đ'),
  ).toBe(true);
  await fill('Tên khách hàng', 'Khách mới');
  await fill('Số điện thoại', '0901234567');
  await fill('Ngày đặt', formatDate(new Date()));
  await fill('Giờ bắt đầu', '18');
  await press('Xác nhận đặt sân');
  expect(
    renderer.root
      .findAllByType(FormField)
      .find(input => input.props.label === 'Giờ bắt đầu')!.props.error,
  ).toContain('Trùng lịch');
  expect(data.addBooking).not.toHaveBeenCalled();
});

test('tìm sân và lọc bảo trì không làm thay đổi dữ liệu gốc', async () => {
  await render(<FieldListScreen navigation={navigation} />);
  await act(async () => renderer.root.findByType(SearchInput).props.onChange('a1'));
  expect(renderer.root.findAllByType(FieldCard)).toHaveLength(1);
  expect(renderer.root.findByType(FieldCard).props.field.name).toBe('Sân A1');
  await act(async () => renderer.root.findByType(SearchInput).props.onChange(''));
  await act(async () => renderer.root.findByType(FilterChips).props.onChange('Bảo trì'));
  expect(renderer.root.findAllByType(FieldCard)).toHaveLength(1);
  expect(renderer.root.findByType(FieldCard).props.field.name).toBe('Sân B2');
  expect(data.fields).toHaveLength(4);
});

test('tìm không có kết quả hiển thị hướng dẫn đổi bộ lọc', async () => {
  await render(<FieldListScreen navigation={navigation} />);
  await act(async () => renderer.root.findByType(SearchInput).props.onChange('không có sân này'));
  expect(renderer.root.findAllByType(FieldCard)).toHaveLength(0);
  expect(renderer.root.findByType(EmptyState).props.title).toBe('Không tìm thấy sân');
});

test('tab lịch tìm theo khách, mở đúng sân và huỷ có xác nhận', async () => {
  const alert = jest.spyOn(Alert, 'alert');
  await render(<BookingListScreen navigation={navigation} />);
  expect(renderer.root.findAllByType(BookingCard)).toHaveLength(3);
  await act(async () => renderer.root.findByType(SearchInput).props.onChange('Trần'));
  const card = renderer.root.findByType(BookingCard);
  expect(card.props.booking.id).toBe('booking-2');
  await act(async () => card.props.onOpenField());
  expect(navigate).toHaveBeenCalledWith('FieldDetail', {fieldId: 'field-a1'});
  await act(async () => card.props.onCancel());
  expect(data.cancelBooking).not.toHaveBeenCalled();
  const confirm = alert.mock.calls[0][2]!.find(button => button.style === 'destructive')!;
  await act(async () => confirm.onPress!());
  expect(data.cancelBooking).toHaveBeenCalledWith('booking-2');
});

test('bộ lọc Hôm nay bỏ các lịch khác ngày', async () => {
  data.bookings = [...data.bookings, {...data.bookings[0], id: 'future-booking', date: '01/01/2099'}];
  await render(<BookingListScreen navigation={navigation} />);
  expect(renderer.root.findAllByType(BookingCard)).toHaveLength(4);
  await act(async () => renderer.root.findByType(FilterChips).props.onChange('Hôm nay'));
  expect(renderer.root.findAllByType(BookingCard)).toHaveLength(3);
});
