import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <View style={styles.searchHandle} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xoá nội dung tìm kiếm"
          hitSlop={8}
          onPress={() => onChange('')}
          style={({ pressed }) => [styles.clear, pressed && styles.pressed]}
        >
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    width: 15,
    height: 15,
    borderWidth: 1.6,
    borderColor: colors.muted,
    borderRadius: 8,
    marginRight: 3,
  },
  searchHandle: {
    position: 'absolute',
    width: 7,
    height: 1.6,
    backgroundColor: colors.muted,
    bottom: -3,
    right: -5,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 12,
  },
  clear: {
    minWidth: 32,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: { fontSize: 24, color: colors.muted },
  pressed: { opacity: 0.6 },
});
