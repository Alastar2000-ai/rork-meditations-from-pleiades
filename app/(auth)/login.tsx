import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Background from '@/components/Background';
import Input from '@/components/Input';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validate = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    
    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!password) {
      newErrors.password = 'Пароль обязателен';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Ошибка', 'Неверный email или пароль');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>Добро пожаловать</Text>
          <Text style={styles.subtitle}>
            Войдите в аккаунт, чтобы продолжить
          </Text>
          
          <View style={styles.form}>
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
              placeholder="Введите ваш пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              isPassword
              leftIcon={<Lock size={20} color={colors.text.muted} />}
              error={errors.password}
            />
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
            </TouchableOpacity>
            
            <Button
              title="Войти"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Еще нет аккаунта? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Зарегистрироваться</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    color: colors.accent,
    fontSize: theme.fontSize.s,
  },
  loginButton: {
    marginBottom: theme.spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  registerLink: {
    color: colors.accent,
    fontSize: theme.fontSize.s,
    fontWeight: '600',
  },
});