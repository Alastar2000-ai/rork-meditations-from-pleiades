import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import Input from '@/components/Input';
import Button from '@/components/Button';
import PlatformImage from '@/components/PlatformImage';
import theme from '@/constants/theme';
import colors from '@/constants/colors';
import { Instructor } from '@/types';

export default function EditInstructorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    getInstructorById, 
    addInstructor, 
    updateInstructor
  } = useContentStore();
  
  const isNewInstructor = id === 'new';
  const existingInstructor = !isNewInstructor ? getInstructorById(id as string) : null;
  
  const [name, setName] = useState(existingInstructor?.name || '');
  const [avatar, setAvatar] = useState(existingInstructor?.avatar || '');
  const [bio, setBio] = useState(existingInstructor?.bio || '');
  const [specialties, setSpecialties] = useState(existingInstructor?.specialties.join(', ') || '');
  
  const [errors, setErrors] = useState({
    name: '',
    avatar: '',
    bio: '',
    specialties: '',
  });
  
  const validate = () => {
    const newErrors = {
      name: '',
      avatar: '',
      bio: '',
      specialties: '',
    };
    
    if (!name) newErrors.name = 'Имя обязательно';
    if (!avatar) newErrors.avatar = 'URL аватара обязателен';
    if (!bio) newErrors.bio = 'Биография обязательна';
    if (!specialties) newErrors.specialties = 'Специализации обязательны';
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSave = () => {
    if (!validate()) return;
    
    const instructorData: Instructor = {
      id: isNewInstructor ? Date.now().toString() : id as string,
      name,
      avatar,
      bio,
      specialties: specialties.split(',').map(s => s.trim()).filter(s => s),
      courses: existingInstructor?.courses || [],
      meditations: existingInstructor?.meditations || [],
    };
    
    if (isNewInstructor) {
      addInstructor(instructorData);
      Alert.alert('Успех', 'Инструктор успешно создан');
    } else {
      updateInstructor(id as string, instructorData);
      Alert.alert('Успех', 'Инструктор успешно обновлен');
    }
    
    router.back();
  };
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: isNewInstructor ? 'Новый инструктор' : 'Редактирование инструктора',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarSection}>
            {avatar ? (
              <View style={styles.avatarContainer}>
                <PlatformImage
                  source={avatar}
                  style={styles.avatar}
                  contentFit="cover"
                />
                <TouchableOpacity 
                  style={styles.removeAvatarButton}
                  onPress={() => setAvatar('')}
                >
                  <X size={16} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.avatarPlaceholder}>
                <Camera size={40} color={colors.text.muted} />
                <Text style={styles.avatarPlaceholderText}>Добавить фото</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Input
            label="Имя"
            placeholder="Введите имя инструктора"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          
          <Input
            label="URL аватара"
            placeholder="Введите URL изображения аватара"
            value={avatar}
            onChangeText={setAvatar}
            error={errors.avatar}
          />
          
          <Input
            label="Биография"
            placeholder="Введите биографию инструктора"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={errors.bio}
          />
          
          <Input
            label="Специализации (через запятую)"
            placeholder="Введите специализации через запятую"
            value={specialties}
            onChangeText={setSpecialties}
            error={errors.specialties}
          />
          
          <Button
            title={isNewInstructor ? "Создать инструктора" : "Сохранить изменения"}
            onPress={handleSave}
            style={styles.saveButton}
          />
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
    padding: theme.spacing.m,
    paddingBottom: 100,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  removeAvatarButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.ui.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: colors.text.muted,
    fontSize: theme.fontSize.s,
    marginTop: theme.spacing.xs,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.m,
    width: '100%',
  },
});