import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Field } from '../types';
import { useBookingForm } from '../hooks/useBookingForm';
import { colors, layout } from '../theme/colors';
import { formatMoney, formatTime } from '../utils/format';
import { FormField } from './FormField';
import { Button } from './Button';
import { BOOKING_RULES } from '../constants/rules';

export function BookingModal({
  field,
  onClose,
}: {
  field: Field;
  onClose: () => void;
}) {
  const {
    input,
    saving,
    change,
    blur,
    errorFor,
    hours,
    start,
    validRange,
    total,
    submit,
  } = useBookingForm(field, onClose);

  return (
    <Modal
      visible
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        if (!saving) {
          onClose();
        }
      }}
    >
      <SafeAreaView style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboard}
        >
          <View style={styles.sheet}>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
            >
              <View style={styles.intro}>
                <Text style={layout.title}>Đặt sân</Text>
                <Text style={layout.muted}>
                  {field.name} · {formatMoney(field.pricePerHour)}/giờ
                </Text>
                <Text style={layout.muted}>Các mục có * là bắt buộc.</Text>
              </View>
              <FormField
                label="Tên khách hàng"
                value={input.customerName}
                onChangeText={value => change('customerName', value)}
                onBlur={() => blur('customerName')}
                error={errorFor('customerName')}
                autoCapitalize="words"
                editable={!saving}
              />
              <FormField
                label="Số điện thoại"
                value={input.phone}
                onChangeText={value => change('phone', value)}
                onBlur={() => blur('phone')}
                error={errorFor('phone')}
                placeholder="Ví dụ: 0901234567"
                keyboardType="phone-pad"
                editable={!saving}
              />
              <FormField
                label="Ngày đặt"
                value={input.date}
                onChangeText={value => change('date', value)}
                onBlur={() => blur('date')}
                error={errorFor('date')}
                placeholder="dd/mm/yyyy"
                keyboardType="numbers-and-punctuation"
                editable={!saving}
              />
              <FormField
                label="Giờ bắt đầu"
                value={input.startHour}
                onChangeText={value => change('startHour', value)}
                onBlur={() => blur('startHour')}
                error={errorFor('startHour')}
                hint={`Nhập giờ nguyên từ ${BOOKING_RULES.earliestStartHour} đến ${BOOKING_RULES.latestStartHour}`}
                keyboardType="numeric"
                editable={!saving}
              />
              <FormField
                label="Số giờ thuê"
                value={input.hours}
                onChangeText={value => change('hours', value)}
                onBlur={() => blur('hours')}
                error={errorFor('hours')}
                hint={`Từ ${BOOKING_RULES.minHours} đến ${
                  BOOKING_RULES.maxHours
                } giờ, kết thúc không quá ${formatTime(
                  BOOKING_RULES.latestEndHour,
                )}`}
                keyboardType="numeric"
                editable={!saving}
              />
              <View style={styles.total} accessibilityLiveRegion="polite">
                <Text style={layout.muted}>Thành tiền</Text>
                <Text style={styles.amount}>{formatMoney(total)}</Text>
                {validRange ? (
                  <Text style={layout.muted}>
                    {formatTime(start)}–{formatTime(start + hours)} · {hours}{' '}
                    giờ
                  </Text>
                ) : null}
              </View>
              <Button
                title={saving ? 'Đang lưu…' : 'Xác nhận đặt sân'}
                variant="primary"
                onPress={() => {
                  submit();
                }}
                disabled={saving || field.status === 'Bảo trì'}
              />
              <Button title="Huỷ" onPress={onClose} disabled={saving} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay },
  keyboard: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '94%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  content: { padding: 24, paddingBottom: 32, gap: 12 },
  intro: { gap: 6, marginBottom: 8 },
  total: {
    gap: 6,
    padding: 18,
    marginVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  amount: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.primary,
  },
});
