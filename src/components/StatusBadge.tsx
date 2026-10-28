import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FieldStatus } from '../types';
import { colors } from '../theme/colors';

export function StatusBadge({ status }: { status: FieldStatus }) {
  const active = status === 'Hoạt động';
  return (
    <View style={[styles.badge, active ? styles.active : styles.maintenance]}>
      <Text
        style={[
          styles.text,
          active ? styles.activeText : styles.maintenanceText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  active: { backgroundColor: colors.successBackground },
  maintenance: { backgroundColor: colors.warningBackground },
  text: { fontSize: 12, lineHeight: 18, fontWeight: '600' },
  activeText: { color: colors.success },
  maintenanceText: { color: colors.warning },
});
