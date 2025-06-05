import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Switch, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Music, Upload } from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import Input from '@/components/Input';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';
import { Meditation } from '@/types';

export default function EditMeditationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    getMeditationById, 
    addMeditation, 
    updateMeditation,
    instructors,
    categories
  } = useContentStore();
  
  const isNewMeditation = id === 'new';
  const existingMeditation = !isNewMeditation ? getMeditationById(id as string) : null;
  
  const [title, setTitle] = useState(existingMeditation?.title || '');
  const [description, setDescription] = useState(existingMeditation?.description || '');
  const [coverImage, setCoverImage] = useState(existingMeditation?.coverImage || '');
  const [instructorId, setInstructorId] = useState(existingMeditation?.instructorId || instructors[0]?.id || '');
  const [duration, setDuration] = useState(existingMeditation?.duration.toString() || '15');
  const [price, setPrice] = useState(existingMeditation?.price.toString() || '0');
  const [category, setCategory] = useState(existingMeditation?.category || categories[0]?.name || '');
  const [tags, setTags] = useState(existingMeditation?.tags.join(', ') || '');
  const [isFeatured, setIsFeatured] = useState(existingMeditation?.isFeatured || false);
  const [audioFileName, setAudioFileName] = useState(existingMeditation?.audioUrl || '');
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    coverImage: '',
    duration: '',
    price: '',
    audioFile: '',
  });
  
  const validate = () => {
    const newErrors = {
      title: '',
      description: '',
      coverImage: '',
      duration: '',
      price: '',
      audioFile: '',
    };
    
    if (!title) newErrors.title = 'Название обязательно';
    if (!description) newErrors.description = 'Описание обязательно';
    if (!coverImage) newErrors.coverImage = 'Обложка обязательна';
    
    if (!duration) {
      newErrors.duration = 'Длительность обязательна';
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = 'Длительность должна быть положительным числом';
    }
    
    if (!price) {
      newErrors.price = 'Цена обязательна';
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Цена должна быть неотрицательным числом';
    }
    
    if (!audioFileName) {
      newErrors.audioFile = 'Аудиофайл обязателен';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нам нужно разрешение на доступ к галерее');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нам нужно разрешение на доступ к камере');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };
  
  const handleSave = () => {
    if (!validate()) return;
    
    const meditationData: Meditation = {
      id: isNewMeditation ? Date.now().toString() : id as string,
      title,
      description,
      coverImage,
      instructorId,
      duration: Number(duration),
      audioUrl: audioFileName || 'path/to/meditation.mp3',
      price: Number(price),
      isFeatured,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      rating: existingMeditation?.rating || 5.0,
      reviewCount: existingMeditation?.reviewCount || 0,
      createdAt: existingMeditation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (isNewMeditation) {
      addMeditation(meditationData);
      Alert.alert('Успех', 'Медитация успешно создана');
    } else {
      updateMeditation(id as string, meditationData);
      Alert.alert('Успех', 'Медитация успешно обновлена');
    }
    
    router.back();
  };
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: isNewMeditation ? 'Новая медитация' : 'Редактирование медитации',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Input
            label="Название"
            placeholder="Введите название медитации"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          
          <Input
            label="Описание"
            placeholder="Введите описание медитации"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={errors.description}
          />
          
          <View style={styles.imageSection}>
            <Text style={styles.sectionLabel}>Обложка</Text>
            
            {coverImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={coverImage}
                  style={styles.imagePreview}
                  contentFit="cover"
                  // Remove any props that might cause issues on web
                  {...(Platform.OS === 'web' ? { fetchPriority: undefined } : {})}
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setCoverImage('')}
                >
                  <X size={16} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePickerButtons}>
                <TouchableOpacity 
                  style={styles.imagePickerButton}
                  onPress={takePhoto}
                >
                  <Camera size={24} color={colors.text.primary} />
                  <Text style={styles.imagePickerText}>Камера</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imagePickerButton}
                  onPress={pickImage}
                >
                  <Upload size={24} color={colors.text.primary} />
                  <Text style={styles.imagePickerText}>Галерея</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {errors.coverImage ? (
              <Text style={styles.errorText}>{errors.coverImage}</Text>
            ) : null}
          </View>
          
          <Input
            label="Инструктор"
            placeholder="Выберите инструктора"
            value={instructors.find(i => i.id === instructorId)?.name || ''}
            // In a real app, this would be a dropdown
            editable={false}
          />
          
          <Input
            label="Длительность (минуты)"
            placeholder="Введите длительность в минутах"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            error={errors.duration}
          />
          
          <Input
            label="Цена (₽)"
            placeholder="Введите цену (0 для бесплатной)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            error={errors.price}
          />
          
          <Input
            label="Категория"
            placeholder="Выберите категорию"
            value={category}
            // In a real app, this would be a dropdown
            editable={false}
          />
          
          <Input
            label="Теги (через запятую)"
            placeholder="Введите теги через запятую"
            value={tags}
            onChangeText={setTags}
          />
          
          <View style={styles.audioSection}>
            <Text style={styles.sectionLabel}>Аудиофайл</Text>
            
            <View style={styles.audioInputContainer}>
              <View style={styles.audioInputWrapper}>
                <Music size={24} color={colors.accent} style={styles.audioIcon} />
                <Input
                  placeholder="Введите имя аудиофайла или URL"
                  value={audioFileName}
                  onChangeText={setAudioFileName}
                  containerStyle={styles.audioInput}
                />
              </View>
              
              {audioFileName ? (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setAudioFileName('')}
                >
                  <X size={20} color={colors.text.muted} />
                </TouchableOpacity>
              ) : null}
            </View>
            
            <Text style={styles.audioHelperText}>
              В реальном приложении здесь была бы возможность загрузить аудиофайл
            </Text>
            
            {errors.audioFile ? (
              <Text style={styles.errorText}>{errors.audioFile}</Text>
            ) : null}
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Рекомендуемая медитация</Text>
            <Switch
              value={isFeatured}
              onValueChange={setIsFeatured}
              trackColor={{ false: colors.background.light, true: colors.primary }}
              thumbColor={isFeatured ? colors.accent : colors.text.secondary}
            />
          </View>
          
          <Button
            title={isNewMeditation ? "Создать медитацию" : "Сохранить изменения"}
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    marginBottom: theme.spacing.xs,
  },
  imageSection: {
    marginBottom: theme.spacing.m,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: theme.spacing.s,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.m,
  },
  removeImageButton: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  imagePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.xs,
  },
  imagePickerText: {
    color: colors.text.primary,
    marginLeft: theme.spacing.s,
  },
  audioSection: {
    marginBottom: theme.spacing.m,
  },
  audioInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  audioInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    paddingLeft: theme.spacing.m,
  },
  audioIcon: {
    marginRight: theme.spacing.s,
  },
  audioInput: {
    flex: 1,
    marginBottom: 0,
  },
  clearButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
  audioHelperText: {
    color: colors.text.muted,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  switchLabel: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
  },
  saveButton: {
    marginTop: theme.spacing.m,
  },
  errorText: {
    color: colors.ui.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
});