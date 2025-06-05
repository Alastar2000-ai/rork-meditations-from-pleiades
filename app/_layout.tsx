import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, View, StyleSheet, LogBox } from 'react-native';
import { ErrorBoundary } from './error-boundary';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';
import Player from '@/components/Player';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/lib/trpc';

// Create a client
const queryClient = new QueryClient();

// Ignore specific warnings that might appear in development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Failed to register as background download task',
  'Animated: `useNativeDriver`',
  'AsyncStorage has been extracted from react-native',
]);

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // You can add custom fonts here if needed
  });

  // Check for updates when app starts
  useEffect(() => {
    checkForUpdates();
  }, []);

  // Function to check for updates
  async function checkForUpdates() {
    if (Platform.OS === 'web') return;
    
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // Error checking for updates
      console.log('Error checking for updates:', error);
    }
  }

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {
        /* reloading the app might trigger some race conditions, ignore them */
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
              <StatusBar style="light" />
              <RootLayoutNav />
            </View>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <>
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
          // Fix for Android header shadow
          ...Platform.select({
            android: {
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: colors.background.dark,
                elevation: 0,
              },
            },
          }),
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="meditation/[id]" 
          options={{ 
            title: "Медитация",
            animation: Platform.OS === 'ios' ? 'slide_from_right' : undefined,
          }} 
        />
        <Stack.Screen 
          name="course/[id]" 
          options={{ 
            title: "Курс",
            animation: Platform.OS === 'ios' ? 'slide_from_right' : undefined,
          }} 
        />
        <Stack.Screen 
          name="instructor/[id]" 
          options={{ 
            title: "Инструктор",
            animation: Platform.OS === 'ios' ? 'slide_from_right' : undefined,
          }} 
        />
        <Stack.Screen 
          name="metaphor-card/[id]" 
          options={{ 
            title: "Метафорическая карта",
            animation: Platform.OS === 'ios' ? 'slide_from_right' : undefined,
          }} 
        />
        <Stack.Screen 
          name="civilization/[id]" 
          options={{ 
            title: "Цивилизация",
            animation: Platform.OS === 'ios' ? 'slide_from_right' : undefined,
          }} 
        />
        <Stack.Screen 
          name="constellation/[id]" 
          options={{ 
            title: "Созвездие",
            animation: Platform.OS === 'ios' ? 'slide_from_right' : undefined,
          }} 
        />
        <Stack.Screen 
          name="admin/edit-meditation/[id]" 
          options={{ 
            title: "Редактирование медитации",
            animation: Platform.OS === 'ios' ? 'slide_from_bottom' : undefined,
          }} 
        />
        <Stack.Screen 
          name="admin/edit-course/[id]" 
          options={{ 
            title: "Редактирование курса",
            animation: Platform.OS === 'ios' ? 'slide_from_bottom' : undefined,
          }} 
        />
        <Stack.Screen 
          name="admin/edit-instructor/[id]" 
          options={{ 
            title: "Редактирование инструктора",
            animation: Platform.OS === 'ios' ? 'slide_from_bottom' : undefined,
          }} 
        />
      </Stack>
      <Player />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
});