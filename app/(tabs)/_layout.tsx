import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BookOpen, Users, User, Image, Globe } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Platform, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.text.muted,
          tabBarStyle: {
            backgroundColor: colors.background.dark,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            height: Platform.OS === 'ios' ? 90 : 70,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            // Fix for Android tab bar elevation
            ...Platform.select({
              android: {
                elevation: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 2,
                shadowOffset: {
                  width: 0,
                  height: -1,
                },
              }
            })
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -5,
            // Fix for Android text rendering
            ...Platform.select({
              android: {
                includeFontPadding: false,
                textAlignVertical: 'center',
              }
            })
          },
          headerStyle: {
            backgroundColor: colors.background.dark,
            // Fix for Android header elevation
            ...Platform.select({
              android: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              }
            })
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Главная",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="meditations"
          options={{
            title: "Медитации",
            tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: "Курсы",
            tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="metaphor-cards"
          options={{
            title: "Карты",
            tabBarIcon: ({ color }) => <Image size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="civilizations"
          options={{
            title: "Цивилизации",
            tabBarIcon: ({ color }) => <Globe size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="instructors"
          options={{
            title: "Инструкторы",
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Профиль",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
});