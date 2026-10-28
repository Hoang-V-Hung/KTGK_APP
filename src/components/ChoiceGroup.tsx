import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}
export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: Props<T>) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.required}> *</Text>
      </Text>
      <View style={styles.options}>
        {options.map(option => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityLabel={`${label}: ${option}`}
            accessibilityState={{ selected: value === option, disabled }}
            disabled={disabled}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.option,
              value === option && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                value === option && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: 8 },
  label: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    fontWeight: '600',
  },
  required: { color: colors.danger },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionText: { fontSize: 15, lineHeight: 21, color: colors.muted },
  selectedText: { color: colors.primary, fontWeight: '600' },
  pressed: { opacity: 0.65 },
});
