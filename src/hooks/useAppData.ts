import { useEffect, useRef, useState } from 'react';
import { AppData, BookingInput, FieldInput } from '../types';
import { loadData, saveData } from '../services/storage';
import { createId } from '../utils/format';
import { validateBooking, validateField } from '../utils/validation';

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const dataRef = useRef<AppData | null>(null);
  const savingRef = useRef(false);

  // 1. Đọc dữ liệu đã lưu khi mở ứng dụng.
  async function loadSavedData() {
    setLoading(true);
    setLoadError(false);
    try {
      const stored = await loadData();
      dataRef.current = stored;
      setData(stored);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadSavedData();
  }, []);

  // 2. Mọi thao tác thay đổi đều đi qua đây: tạo dữ liệu mới, lưu, rồi cập nhật màn hình.
  // savingRef chặn hai lần bấm lưu cùng lúc; state saving dùng để khoá nút.
  async function saveChanges(update: (previous: AppData) => AppData) {
    if (savingRef.current || !dataRef.current) {
      throw new Error('Đang lưu dữ liệu. Vui lòng thử lại sau.');
    }
    savingRef.current = true;
    setSaving(true);
    try {
      const next = update(dataRef.current);
      await saveData(next);
      dataRef.current = next;
      setData(next);
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        throw error;
      }
      throw new Error('Không thể lưu dữ liệu. Vui lòng thử lại.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  function throwValidationError(message: string): never {
    const error = new Error(message);
    error.name = 'ValidationError';
    throw error;
  }
  // 3. Thêm hoặc sửa một sân. Có id là sửa, chưa có id là thêm.
  async function saveField(input: FieldInput, id?: string) {
    await saveChanges(previous => {
      if (id && !previous.fields.some(field => field.id === id)) {
        throwValidationError('Sân không còn tồn tại.');
      }
      const errors = validateField(input, previous.fields, id);
      if (Object.keys(errors).length) {
        throwValidationError(
          Object.values(errors)[0] || 'Thông tin nhập chưa hợp lệ.',
        );
      }
      const field = {
        id: id ?? createId('field'),
        name: input.name.trim(),
        type: input.type,
        pricePerHour: Number(input.pricePerHour),
        status: input.status,
      };
      return {
        ...previous,
        fields: id
          ? previous.fields.map(item => (item.id === id ? field : item))
          : [...previous.fields, field],
      };
    });
  }
  async function deleteField(id: string) {
    await saveChanges(previous => {
      if (previous.bookings.some(booking => booking.fieldId === id)) {
        throwValidationError(
          'Sân đang có lượt đặt. Hãy huỷ các lượt đặt trước khi xoá sân.',
        );
      }
      return {
        ...previous,
        fields: previous.fields.filter(field => field.id !== id),
      };
    });
  }
  // 4. Kiểm tra lại lịch với dữ liệu mới nhất trước khi lưu.
  async function addBooking(fieldId: string, input: BookingInput) {
    await saveChanges(previous => {
      const field = previous.fields.find(item => item.id === fieldId);
      if (!field) {
        throwValidationError('Sân không còn tồn tại.');
      }
      const errors = validateBooking(input, field, previous.bookings);
      if (Object.keys(errors).length) {
        throwValidationError(
          Object.values(errors)[0] || 'Thông tin nhập chưa hợp lệ.',
        );
      }
      return {
        ...previous,
        bookings: [
          ...previous.bookings,
          {
            id: createId('booking'),
            fieldId,
            customerName: input.customerName.trim(),
            phone: input.phone.trim(),
            date: input.date.trim(),
            startHour: Number(input.startHour),
            hours: Number(input.hours),
          },
        ],
      };
    });
  }
  async function cancelBooking(id: string) {
    await saveChanges(previous => ({
      ...previous,
      bookings: previous.bookings.filter(booking => booking.id !== id),
    }));
  }
  return {
    data,
    loading,
    loadError,
    saving,
    loadSavedData,
    saveField,
    deleteField,
    addBooking,
    cancelBooking,
  };
}
