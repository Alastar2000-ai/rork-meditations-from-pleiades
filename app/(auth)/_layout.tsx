import React from 'react';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.dark,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background.dark,
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Вход",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "Регистрация",
          headerShown: true,
        }} 
      />
    </Stack>
  );
}