import { useState } from 'react';
import { Alert } from 'react-native';
import { Field } from '../types';
import { showError } from '../utils/alerts';
import { useApp } from './useApp';

export const FIELD_FILTERS = ['Tất cả', 'Hoạt động', 'Bảo trì'] as const;
type FieldFilter = (typeof FIELD_FILTERS)[number];

export function useFieldList() {
  const { fields, bookings, deleteField, saving } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FieldFilter>('Tất cả');
  const keyword = search.trim().toLocaleLowerCase('vi-VN');
  const visibleFields = fields.filter(field => {
    const matchesName = field.name.toLocaleLowerCase('vi-VN').includes(keyword);
    const matchesStatus = status === 'Tất cả' || field.status === status;
    return matchesName && matchesStatus;
  });
  const activeCount = fields.filter(
    field => field.status === 'Hoạt động',
  ).length;

  function requestDelete(field: Field) {
    if (bookings.some(booking => booking.fieldId === field.id)) {
      Alert.alert(
        'Không thể xoá sân',
        `${field.name} đang có lượt đặt. Hãy huỷ các lượt đặt trước khi xoá sân.`,
      );
      return;
    }
    Alert.alert('Xoá sân?', `Bạn có chắc muốn xoá ${field.name}?`, [
      { text: 'Giữ lại', style: 'cancel' },
      {
        text: 'Xoá sân',
        style: 'destructive',
        onPress: () => {
          deleteField(field.id).catch(showError);
        },
      },
    ]);
  }
  return {
    fields,
    bookings,
    visibleFields,
    activeCount,
    search,
    setSearch,
    status,
    setStatus,
    saving,
    requestDelete,
  };
}
