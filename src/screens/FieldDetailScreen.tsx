import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../hooks/useApp';
import { colors, layout } from '../theme/colors';
import { formatMoney } from '../utils/format';
import { compareBookings } from '../utils/booking';
import { useBookingActions } from '../hooks/useBookingActions';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { BookingCard } from '../components/BookingCard';
import { BookingModal } from '../components/BookingModal';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldDetail'>;
export function FieldDetailScreen({ route, navigation }: Props) {
  const { fields, bookings } = useApp();
  const { requestCancel, saving } = useBookingActions();
  const field = fields.find(item => item.id === route.params.fieldId);
  const [modalOpen, setModalOpen] = useState(false);
  if (!field) {
    return (
      <SafeAreaView style={layout.screen}>
        <EmptyState
          title="Sân không còn tồn tại"
          message="Vui lòng quay lại danh sách sân."
        />
      </SafeAreaView>
    );
  }
  const fieldBookings = bookings
    .filter(booking => booking.fieldId === field.id)
    .sort(compareBookings);
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={layout.screen}>
      <FlatList
        data={fieldBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={layout.content}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={layout.card}>
              <View style={layout.row}>
                <Text style={layout.title}>{field.name}</Text>
                <StatusBadge status={field.status} />
              </View>
              <Text style={layout.muted}>Loại sân · {field.type}</Text>
              <Text style={styles.price}>
                {formatMoney(field.pricePerHour)}
                <Text style={layout.muted}>/giờ</Text>
              </Text>
              <Button
                title="Sửa thông tin sân"
                onPress={() =>
                  navigation.navigate('FieldForm', { fieldId: field.id })
                }
                disabled={saving}
              />
            </View>
            <Button
              title="Đặt sân"
              variant="primary"
              onPress={() => setModalOpen(true)}
              disabled={field.status === 'Bảo trì' || saving}
            />
            {field.status === 'Bảo trì' ? (
              <Text style={styles.notice}>
                Sân đang bảo trì, tạm ngừng nhận đặt sân.
              </Text>
            ) : null}
            <Text style={layout.heading}>
              Lịch đặt sân ({fieldBookings.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có lượt đặt"
            message={
              field.status === 'Bảo trì'
                ? 'Bạn có thể nhận đặt sân sau khi chuyển sang Hoạt động.'
                : 'Nhấn “Đặt sân” để thêm lịch cho khách.'
            }
          />
        }
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            field={field}
            onCancel={() => requestCancel(item)}
            disabled={saving}
          />
        )}
      />
      {modalOpen ? (
        <BookingModal field={field} onClose={() => setModalOpen(false)} />
      ) : null}
    </SafeAreaView>
  );
}
function Separator() {
  return <View style={layout.separator} />;
}
const styles = StyleSheet.create({
  header: { gap: 20, marginBottom: 16 },
  price: {
    fontSize: 26,
    lineHeight: 34,
    color: colors.text,
    fontWeight: '700',
  },
  notice: { fontSize: 14, lineHeight: 22, color: colors.warning },
});
