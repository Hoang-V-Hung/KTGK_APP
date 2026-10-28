import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MainTab } from '../types';
import { colors } from '../theme/colors';

// Icon được vẽ bằng View để không cần cài thêm thư viện ngoài danh sách cho phép.
export function TabIcon({
  name,
  color = colors.muted,
}: {
  name: MainTab;
  color?: string;
}) {
  const stroke = { borderColor: color };
  if (name === 'overview') {
    return (
      <View style={styles.grid}>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={[styles.square, stroke]} />
        ))}
      </View>
    );
  }
  if (name === 'fields') {
    return (
      <View style={[styles.pitch, stroke]}>
        <View style={[styles.centerLine, stroke]} />
        <View style={[styles.centerCircle, stroke]} />
      </View>
    );
  }
  return (
    <View style={[styles.calendar, stroke]}>
      <View style={[styles.calendarTop, stroke]} />
      <View style={styles.calendarDots}>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  square: { width: 10, height: 10, borderRadius: 3, borderWidth: 1.8 },
  pitch: {
    width: 26,
    height: 20,
    borderWidth: 1.8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLine: { position: 'absolute', height: 18, borderLeftWidth: 1.4 },
  centerCircle: { width: 8, height: 8, borderWidth: 1.4, borderRadius: 4 },
  calendar: { width: 23, height: 24, borderWidth: 1.8, borderRadius: 5 },
  calendarTop: { height: 6, borderBottomWidth: 1.4 },
  calendarDots: { padding: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  dot: { width: 4, height: 4, borderRadius: 1 },
});
