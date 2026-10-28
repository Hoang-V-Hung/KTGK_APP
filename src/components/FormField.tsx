import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}
export function FormField({
  label,
  error,
  hint,
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.required}> *</Text>
      </Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          focused && styles.focused,
          !!error && styles.invalid,
          style,
        ]}
      />
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.help, !!error && styles.error]}
      >
        {error || hint || ' '}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: 6 },
  label: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  required: { color: colors.danger },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  focused: { borderColor: colors.primary },
  invalid: { borderColor: colors.errorBorder },
  help: { minHeight: 18, fontSize: 12, lineHeight: 18, color: colors.muted },
  error: { color: colors.danger },
});
