import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Field } from '../types';
import { colors, layout } from '../theme/colors';
import { formatMoney } from '../utils/format';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';

interface Props {
  field: Field;
  bookingCount: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  saving: boolean;
}
export function FieldCard({
  field,
  bookingCount,
  onOpen,
  onEdit,
  onDelete,
  saving,
}: Props) {
  return (
    <View style={layout.card}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Chi tiết ${field.name}`}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
      >
        <View style={styles.header}>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{field.name}</Text>
            <Text style={layout.muted}>Sân {field.type}</Text>
          </View>
          <StatusBadge status={field.status} />
        </View>
        <Text style={styles.price}>
          {formatMoney(field.pricePerHour)}
          <Text style={styles.unit}>/giờ</Text>
        </Text>
        <View style={styles.footer}>
          <Text style={layout.muted}>{bookingCount} lượt đặt</Text>
          <Text style={styles.detail}>Xem lịch →</Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Button
          title="Sửa"
          accessibilityLabel={`Sửa ${field.name}`}
          onPress={onEdit}
          disabled={saving}
          style={styles.action}
        />
        <Button
          title="Xoá"
          accessibilityLabel={`Xoá ${field.name}`}
          variant="danger"
          onPress={onDelete}
          disabled={saving}
          style={styles.action}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flexWrap: 'wrap',
  },
  nameBlock: { flexGrow: 1, flexShrink: 1, gap: 3 },
  name: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.text },
  price: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: { fontSize: 14, fontWeight: '400', color: colors.muted },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  detail: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  action: { flex: 1 },
  pressed: { opacity: 0.65 },
});
