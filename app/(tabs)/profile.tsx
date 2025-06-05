import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight,
  Shield,
  BookOpen,
  Users
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Background from '@/components/Background';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, toggleAdmin } = useAuthStore();
  
  if (!isAuthenticated) {
    return (
      <Background>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.notAuthContainer}>
            <Text style={styles.title}>Профиль</Text>
            <Text style={styles.notAuthText}>
              Войдите в аккаунт, чтобы получить доступ к вашим медитациям и курсам
            </Text>
            <Button 
              title="Войти" 
              onPress={() => router.push('/(auth)/login')}
              style={styles.authButton}
            />
            <Button 
              title="Регистрация" 
              variant="outline"
              onPress={() => router.push('/(auth)/register')}
              style={styles.authButton}
            />
          </View>
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                {user?.avatar ? (
                  <Image
                    source={user.avatar}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={40} color={colors.text.primary} />
                  </View>
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
            <Button 
              title="Редактировать профиль" 
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Мои покупки</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <ShoppingBag size={20} color={colors.accent} />
                <Text style={styles.menuItemText}>Мои курсы</Text>
              </View>
              <ChevronRight size={20} color={colors.text.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <ShoppingBag size={20} color={colors.accent} />
                <Text style={styles.menuItemText}>Мои медитации</Text>
              </View>
              <ChevronRight size={20} color={colors.text.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <Heart size={20} color={colors.accent} />
                <Text style={styles.menuItemText}>Избранное</Text>
              </View>
              <ChevronRight size={20} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Настройки</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <Settings size={20} color={colors.accent} />
                <Text style={styles.menuItemText}>Настройки приложения</Text>
              </View>
              <ChevronRight size={20} color={colors.text.muted} />
            </TouchableOpacity>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Shield size={20} color={colors.accent} />
                <Text style={styles.menuItemText}>Режим администратора</Text>
              </View>
              <Switch
                value={isAdmin}
                onValueChange={toggleAdmin}
                trackColor={{ false: colors.background.light, true: colors.primary }}
                thumbColor={isAdmin ? colors.accent : colors.text.secondary}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                Alert.alert(
                  'Выход',
                  'Вы уверены, что хотите выйти?',
                  [
                    { text: 'Отмена', style: 'cancel' },
                    { text: 'Выйти', onPress: logout, style: 'destructive' }
                  ]
                );
              }}
            >
              <View style={styles.menuItemLeft}>
                <LogOut size={20} color={colors.ui.error} />
                <Text style={[styles.menuItemText, styles.logoutText]}>Выйти</Text>
              </View>
            </TouchableOpacity>
          </View>

          {isAdmin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Администрирование</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/meditations')}>
                <View style={styles.menuItemLeft}>
                  <BookOpen size={20} color={colors.accent} />
                  <Text style={styles.menuItemText}>Управление медитациями</Text>
                </View>
                <ChevronRight size={20} color={colors.text.muted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/courses')}>
                <View style={styles.menuItemLeft}>
                  <BookOpen size={20} color={colors.accent} />
                  <Text style={styles.menuItemText}>Управление курсами</Text>
                </View>
                <ChevronRight size={20} color={colors.text.muted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/instructors')}>
                <View style={styles.menuItemLeft}>
                  <Users size={20} color={colors.accent} />
                  <Text style={styles.menuItemText}>Управление инструкторами</Text>
                </View>
                <ChevronRight size={20} color={colors.text.muted} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  notAuthContainer: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuthText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  authButton: {
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  header: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  avatarContainer: {
    marginRight: theme.spacing.m,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSize.s,
    color: colors.text.secondary,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.m,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: theme.fontSize.m,
    color: colors.text.primary,
    marginLeft: theme.spacing.m,
  },
  logoutText: {
    color: colors.ui.error,
  },
});