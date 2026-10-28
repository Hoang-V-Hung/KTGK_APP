import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, layout } from '../theme/colors';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.text}>
        <Text style={layout.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {action}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  text: { flexGrow: 1, flexShrink: 1, gap: 6 },
  description: { fontSize: 14, lineHeight: 21, color: colors.muted },
});
