import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map(option => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === option }}
          style={({ pressed }) => [
            styles.chip,
            value === option && styles.selected,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.text, value === option && styles.selectedText]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  row: { gap: 8 },
  chip: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
  },
  selected: { backgroundColor: colors.primary },
  text: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.text },
  selectedText: { color: colors.surface },
  pressed: { opacity: 0.65 },
});
