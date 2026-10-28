import React, { useCallback, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTab, RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { BottomTabBar } from '../components/BottomTabBar';
import { TabIcon } from '../components/TabIcon';
import { OverviewScreen } from './OverviewScreen';
import { FieldListScreen } from './FieldListScreen';
import { BookingListScreen } from './BookingListScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export function MainTabsScreen({ navigation }: Props) {
  // Đây là nơi duy nhất quyết định menu nào đang mở.
  const [activeTab, setActiveTab] = useState<MainTab>('overview');

  // Nút Back Android quay về Tổng quan. Form và chi tiết vẫn do Stack quản lý.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (activeTab === 'overview') {
            return false;
          }
          setActiveTab('overview');
          return true;
        },
      );
      return () => subscription.remove();
    }, [activeTab]),
  );

  function renderCurrentTab() {
    if (activeTab === 'fields') {
      return <FieldListScreen navigation={navigation} />;
    }
    if (activeTab === 'bookings') {
      return <BookingListScreen navigation={navigation} />;
    }
    return (
      <OverviewScreen
        navigation={navigation}
        onShowFields={() => setActiveTab('fields')}
        onShowBookings={() => setActiveTab('bookings')}
      />
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <TabIcon name="fields" color={colors.primary} />
        </View>
        <View style={styles.brandText}>
          <Text style={styles.brandTitle}>Quản lý sân bóng</Text>
          <Text style={styles.brandSubtitle}>Sân mini · Đặt lịch dễ dàng</Text>
        </View>
      </View>
      <View style={styles.content}>{renderCurrentTab()}</View>
      <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { flex: 1, gap: 2 },
  brandTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
  },
  brandSubtitle: { fontSize: 12, lineHeight: 18, color: colors.muted },
  content: { flex: 1, backgroundColor: colors.background },
});
