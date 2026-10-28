import React, { createContext } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContextValue } from '../types';
import { useAppData } from '../hooks/useAppData';
import { colors, layout } from '../theme/colors';
import { Button } from '../components/Button';

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    data,
    loading,
    loadError,
    saving,
    loadSavedData,
    saveField,
    deleteField,
    addBooking,
    cancelBooking,
  } = useAppData();
  if (loading || loadError || !data) {
    return (
      <SafeAreaView style={styles.center}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : null}
        <Text style={layout.heading}>
          {loading ? 'Đang mở danh sách sân…' : 'Chưa thể đọc dữ liệu'}
        </Text>
        {loadError ? (
          <>
            <Text style={styles.error}>
              Dữ liệu cũ vẫn được giữ lại. Vui lòng thử tải lại.
            </Text>
            <Button
              title="Thử lại"
              onPress={() => {
                loadSavedData();
              }}
            />
          </>
        ) : null}
      </SafeAreaView>
    );
  }
  return (
    <AppContext.Provider
      value={{
        ...data,
        saving,
        saveField,
        deleteField,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  error: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    textAlign: 'center',
  },
});
