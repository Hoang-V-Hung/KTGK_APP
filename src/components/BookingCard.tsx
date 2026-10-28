import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Booking, Field } from '../types';
import { colors, layout } from '../theme/colors';
import { formatMoney, formatTime } from '../utils/format';
import { Button } from './Button';
import { calculateBookingTotal } from '../utils/booking';

interface Props {
  booking: Booking;
  field: Field;
  onCancel: () => void;
  disabled: boolean;
  onOpenField?: () => void;
}

export function BookingCard({
  booking,
  field,
  onCancel,
  disabled,
  onOpenField,
}: Props) {
  return (
    <View style={layout.card}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{booking.date}</Text>
        {onOpenField ? (
          <Pressable
            onPress={onOpenField}
            accessibilityRole="button"
            accessibilityLabel={`Mở ${field.name}`}
            style={({ pressed }) => [
              styles.fieldLink,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.fieldName}>{field.name} →</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>
          {formatTime(booking.startHour)}–
          {formatTime(booking.startHour + booking.hours)}
        </Text>
        <Text style={layout.muted}>{booking.hours} giờ</Text>
      </View>
      <View style={styles.customer}>
        <Text style={layout.heading}>{booking.customerName}</Text>
        <Text style={layout.muted}>{booking.phone}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.total}>
          {formatMoney(
            calculateBookingTotal(field.pricePerHour, booking.hours),
          )}
        </Text>
        <Button
          title="Huỷ lượt đặt"
          variant="danger"
          onPress={onCancel}
          disabled={disabled}
          accessibilityLabel={`Huỷ lượt đặt của ${booking.customerName} ngày ${
            booking.date
          } lúc ${formatTime(booking.startHour)}`}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  date: { fontSize: 13, lineHeight: 20, color: colors.muted },
  fieldLink: { minHeight: 32, justifyContent: 'center' },
  fieldName: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: colors.primary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  time: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  customer: { gap: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
  },
  total: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
  },
  pressed: { opacity: 0.65 },
});
