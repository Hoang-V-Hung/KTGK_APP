import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { layout } from '../theme/colors';
import { useBookingList, BOOKING_FILTERS } from '../hooks/useBookingList';
import { useBookingActions } from '../hooks/useBookingActions';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterChips } from '../components/FilterChips';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'> };

export function BookingListScreen({ navigation }: Props) {
  const {
    fields,
    bookings,
    visibleBookings,
    search,
    setSearch,
    period,
    setPeriod,
  } = useBookingList();
  const { requestCancel, saving } = useBookingActions();

  return (
    <View style={layout.screen}>
      <FlatList
        data={visibleBookings}
        keyExtractor={booking => booking.id}
        contentContainerStyle={layout.content}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <PageHeader
              title="Lịch đặt"
              description="Theo dõi các lượt đặt của toàn bộ cụm sân."
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm khách, số điện thoại, sân…"
            />
            <FilterChips
              options={BOOKING_FILTERS}
              value={period}
              onChange={setPeriod}
            />
            <Text style={layout.muted}>
              {visibleBookings.length}/{bookings.length} lượt đặt
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có lịch phù hợp"
            message="Thử thay đổi bộ lọc, hoặc mở một sân để tạo lượt đặt mới."
          />
        }
        renderItem={({ item: booking }) => {
          const field = fields.find(item => item.id === booking.fieldId);
          if (!field) {
            return null;
          }
          return (
            <BookingCard
              booking={booking}
              field={field}
              disabled={saving}
              onCancel={() => requestCancel(booking)}
              onOpenField={() =>
                navigation.navigate('FieldDetail', { fieldId: field.id })
              }
            />
          );
        }}
      />
    </View>
  );
}
function Separator() {
  return <View style={layout.separator} />;
}
const styles = StyleSheet.create({ header: { gap: 16, marginBottom: 16 } });

