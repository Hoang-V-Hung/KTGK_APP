import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#166534',
  primaryLight: '#eaf5ed',
  background: '#f5f7f5',
  surface: '#ffffff',
  surfaceMuted: '#f0f3f0',
  text: '#172a20',
  muted: '#647269',
  border: '#e1e8e2',
  success: '#047857',
  successBackground: '#ecfdf5',
  warning: '#92400e',
  warningBackground: '#fffbeb',
  danger: '#be123c',
  errorBorder: '#ef4444',
  disabled: '#e5eae6',
  overlay: 'rgba(0, 0, 0, 0.38)',
};

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 20, paddingBottom: 32 },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
  },
  heading: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: colors.text,
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.text },
  muted: { fontSize: 14, lineHeight: 21, color: colors.muted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  separator: { height: 16 },
});
