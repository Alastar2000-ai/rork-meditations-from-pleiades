import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Background from '@/components/Background';
import Input from '@/components/Input';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!name) {
      newErrors.name = 'Имя обязательно';
    }
    
    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      // In a real app, this would make an API call to register
      // For demo purposes, we'll just log in with the demo user
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>Создайте аккаунт</Text>
          <Text style={styles.subtitle}>
            Зарегистрируйтесь, чтобы получить доступ к медитациям и курсам
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Имя"
              placeholder="Введите ваше имя"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.text.muted} />}
              error={errors.name}
            />
            
            <Input
              label="Email"
              placeholder="Введите ваш email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.text.muted} />}
              error={errors.email}
            />
            
            <Input
              label="Пароль"
              placeholder="Создайте пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              isPassword
              leftIcon={<Lock size={20} color={colors.text.muted} />}
              error={errors.password}
            />
            
            <Input
              label="Подтверждение пароля"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              isPassword
              leftIcon={<Lock size={20} color={colors.text.muted} />}
              error={errors.confirmPassword}
            />
            
            <Button
              title="Зарегистрироваться"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Уже есть аккаунт? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Войти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.m,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  loginLink: {
    color: colors.accent,
    fontSize: theme.fontSize.s,
    fontWeight: '600',
  },
});