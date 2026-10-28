import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTab } from '../types';
import { colors } from '../theme/colors';
import { TabIcon } from './TabIcon';

// Muốn đổi tên hoặc thứ tự các menu, sửa mảng này.
const TABS: { key: MainTab; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'fields', label: 'Sân bóng' },
  { key: 'bookings', label: 'Lịch đặt' },
];

interface Props {
  activeTab: MainTab;
  onChange: (tab: MainTab) => void;
}
export function BottomTabBar({ activeTab, onChange }: Props) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.bar}>
        {TABS.map(tab => {
          const selected = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected }}
              onPress={() => onChange(tab.key)}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View style={[styles.icon, selected && styles.selectedIcon]}>
                <TabIcon
                  name={tab.key}
                  color={selected ? colors.primary : colors.muted}
                />
              </View>
              <Text style={[styles.label, selected && styles.selectedLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    width: 56,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  selectedIcon: { backgroundColor: colors.primaryLight },
  label: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.muted,
  },
  selectedLabel: { color: colors.primary },
  pressed: { opacity: 0.6 },
});
