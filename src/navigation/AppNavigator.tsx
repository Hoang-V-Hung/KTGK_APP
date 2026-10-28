import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { MainTabsScreen } from '../screens/MainTabsScreen';
import { FieldFormScreen } from '../screens/FieldFormScreen';
import { FieldDetailScreen } from '../screens/FieldDetailScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FieldForm"
          component={FieldFormScreen}
          options={({ route }) => ({
            title: route.params?.fieldId ? 'Sửa sân' : 'Thêm sân',
          })}
        />
        <Stack.Screen
          name="FieldDetail"
          component={FieldDetailScreen}
          options={{ title: 'Chi tiết sân' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
