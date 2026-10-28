import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../hooks/useApp';
import { colors, layout } from '../theme/colors';
import { formatDate, formatTime } from '../utils/format';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { TabIcon } from '../components/TabIcon';
import { compareBookings } from '../utils/booking';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
  onShowFields: () => void;
  onShowBookings: () => void;
};

export function OverviewScreen({
  navigation,
  onShowFields,
  onShowBookings,
}: Props) {
  const { fields, bookings, saving } = useApp();
  const today = formatDate(new Date());
  const activeCount = fields.filter(
    field => field.status === 'Hoạt động',
  ).length;
  const maintenanceCount = fields.length - activeCount;
  const todayBookings = bookings
    .filter(booking => booking.date === today)
    .sort(compareBookings);

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.content}>
      <PageHeader
        title="Tổng quan"
        description={`Hoạt động sân bóng · ${today}`}
      />
      <View style={styles.summary}>
        <View style={styles.summaryTop}>
          <Text style={styles.summaryLabel}>Sân đang hoạt động</Text>
          <TabIcon name="fields" color={colors.surface} />
        </View>
        <Text style={styles.summaryNumber}>
          {activeCount}
          <Text style={styles.summaryTotal}> / {fields.length} sân</Text>
        </Text>
        <Text style={styles.summaryDescription}>
          {maintenanceCount
            ? `${maintenanceCount} sân đang bảo trì`
            : 'Tất cả sân sẵn sàng nhận khách'}
        </Text>
        <Button
          title="Quản lý sân →"
          onPress={onShowFields}
          style={styles.summaryButton}
        />
      </View>
      <View style={styles.statsRow}>
        <View style={[layout.card, styles.stat]}>
          <Text style={layout.muted}>Lịch hôm nay</Text>
          <Text style={styles.statNumber}>
            {todayBookings.length}
            <Text style={styles.statUnit}> lượt</Text>
          </Text>
        </View>
        <View style={[layout.card, styles.stat]}>
          <Text style={layout.muted}>Tổng lịch đặt</Text>
          <Text style={styles.statNumber}>
            {bookings.length}
            <Text style={styles.statUnit}> lượt</Text>
          </Text>
        </View>
      </View>
      <Button
        title="+ Thêm sân"
        variant="primary"
        onPress={() => navigation.navigate('FieldForm')}
        disabled={saving}
      />
      <View style={styles.sectionHeading}>
        <Text style={layout.heading}>Lịch hôm nay</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onShowBookings}
          style={({ pressed }) => [
            styles.linkButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.link}>Xem tất cả →</Text>
        </Pressable>
      </View>
      <View style={styles.todayList}>
        {todayBookings.length ? (
          todayBookings.slice(0, 3).map(booking => {
            const field = fields.find(item => item.id === booking.fieldId);
            return (
              <Pressable
                key={booking.id}
                accessibilityRole="button"
                accessibilityLabel={`Xem lịch ${field?.name}, ${booking.customerName}`}
                onPress={() =>
                  navigation.navigate('FieldDetail', {
                    fieldId: booking.fieldId,
                  })
                }
                style={({ pressed }) => [
                  styles.bookingRow,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.timeBox}>
                  <Text style={styles.startTime}>
                    {formatTime(booking.startHour)}
                  </Text>
                  <Text style={styles.endTime}>
                    {formatTime(booking.startHour + booking.hours)}
                  </Text>
                </View>
                <View style={styles.customer}>
                  <Text style={styles.customerName}>
                    {booking.customerName}
                  </Text>
                  <Text style={layout.muted}>
                    {field?.name} · {booking.hours} giờ
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </Pressable>
            );
          })
        ) : (
          <EmptyState
            title="Hôm nay chưa có lịch"
            message="Mở danh sách sân để tạo lượt đặt cho khách."
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 22,
    gap: 12,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  summaryLabel: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.surface,
    fontWeight: '500',
  },
  summaryNumber: {
    fontSize: 44,
    lineHeight: 54,
    fontWeight: '700',
    color: colors.surface,
    fontVariant: ['tabular-nums'],
  },
  summaryTotal: { fontSize: 18, fontWeight: '400' },
  summaryDescription: { fontSize: 14, lineHeight: 21, color: colors.surface },
  summaryButton: { alignSelf: 'flex-start', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, padding: 16, gap: 8 },
  statNumber: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  statUnit: { fontSize: 14, fontWeight: '400', color: colors.muted },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  linkButton: { minHeight: 44, justifyContent: 'center' },
  link: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: colors.primary,
  },
  todayList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  timeBox: {
    width: 64,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    gap: 4,
  },
  startTime: { fontSize: 15, fontWeight: '700', color: colors.primary },
  endTime: { fontSize: 12, color: colors.muted },
  customer: { flex: 1, gap: 5 },
  customerName: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
  },
  arrow: { fontSize: 28, color: colors.muted },
  pressed: { opacity: 0.65 },
});

