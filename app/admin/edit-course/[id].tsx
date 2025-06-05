import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Switch, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Plus, Trash2, Music } from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import Input from '@/components/Input';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';
import { Course, Lesson } from '@/types';

export default function EditCourseScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    getCourseById, 
    addCourse, 
    updateCourse,
    instructors,
    categories
  } = useContentStore();
  
  const isNewCourse = id === 'new';
  const existingCourse = !isNewCourse ? getCourseById(id as string) : null;
  
  const [title, setTitle] = useState(existingCourse?.title || '');
  const [description, setDescription] = useState(existingCourse?.description || '');
  const [coverImage, setCoverImage] = useState(existingCourse?.coverImage || '');
  const [instructorId, setInstructorId] = useState(existingCourse?.instructorId || instructors[0]?.id || '');
  const [price, setPrice] = useState(existingCourse?.price.toString() || '0');
  const [category, setCategory] = useState(existingCourse?.category || categories[0]?.name || '');
  const [tags, setTags] = useState(existingCourse?.tags.join(', ') || '');
  const [isFeatured, setIsFeatured] = useState(existingCourse?.isFeatured || false);
  const [lessons, setLessons] = useState<Lesson[]>(existingCourse?.lessons || []);
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    coverImage: '',
    price: '',
    lessons: '',
  });
  
  const validate = () => {
    const newErrors = {
      title: '',
      description: '',
      coverImage: '',
      price: '',
      lessons: '',
    };
    
    if (!title) newErrors.title = 'Название обязательно';
    if (!description) newErrors.description = 'Описание обязательно';
    if (!coverImage) newErrors.coverImage = 'URL обложки обязателен';
    
    if (!price) {
      newErrors.price = 'Цена обязательна';
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Цена должна быть неотрицательным числом';
    }
    
    if (lessons.length === 0) {
      newErrors.lessons = 'Добавьте хотя бы один урок';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: `Урок ${lessons.length + 1}`,
      description: '',
      duration: 30,
      audioUrl: 'path/to/lesson.mp3',
      order: lessons.length + 1,
    };
    
    setLessons([...lessons, newLesson]);
  };
  
  const handleUpdateLesson = (index: number, field: keyof Lesson, value: string | number) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = {
      ...updatedLessons[index],
      [field]: value,
    };
    setLessons(updatedLessons);
  };
  
  const handleDeleteLesson = (index: number) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    // Update order of remaining lessons
    updatedLessons.forEach((lesson, i) => {
      lesson.order = i + 1;
    });
    setLessons(updatedLessons);
  };
  
  const handleSave = () => {
    if (!validate()) return;
    
    const courseData: Course = {
      id: isNewCourse ? Date.now().toString() : id as string,
      title,
      description,
      coverImage,
      instructorId,
      price: Number(price),
      isFeatured,
      lessons,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      rating: existingCourse?.rating || 5.0,
      reviewCount: existingCourse?.reviewCount || 0,
      createdAt: existingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (isNewCourse) {
      addCourse(courseData);
      Alert.alert('Успех', 'Курс успешно создан');
    } else {
      updateCourse(id as string, courseData);
      Alert.alert('Успех', 'Курс успешно обновлен');
    }
    
    router.back();
  };
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: isNewCourse ? 'Новый курс' : 'Редактирование курса',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Input
            label="Название"
            placeholder="Введите название курса"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          
          <Input
            label="Описание"
            placeholder="Введите описание курса"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={errors.description}
          />
          
          <Input
            label="URL обложки"
            placeholder="Введите URL изображения обложки"
            value={coverImage}
            onChangeText={setCoverImage}
            error={errors.coverImage}
          />
          
          <Input
            label="Инструктор"
            placeholder="Выберите инструктора"
            value={instructors.find(i => i.id === instructorId)?.name || ''}
            // In a real app, this would be a dropdown
            editable={false}
          />
          
          <Input
            label="Цена (₽)"
            placeholder="Введите цену (0 для бесплатного)"
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
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Рекомендуемый курс</Text>
            <Switch
              value={isFeatured}
              onValueChange={setIsFeatured}
              trackColor={{ false: colors.background.light, true: colors.primary }}
              thumbColor={isFeatured ? colors.accent : colors.text.secondary}
            />
          </View>
          
          <View style={styles.lessonsSection}>
            <View style={styles.lessonsSectionHeader}>
              <Text style={styles.lessonsSectionTitle}>Уроки</Text>
              <TouchableOpacity 
                style={styles.addLessonButton}
                onPress={handleAddLesson}
              >
                <Plus size={20} color={colors.text.primary} />
                <Text style={styles.addLessonText}>Добавить урок</Text>
              </TouchableOpacity>
            </View>
            
            {errors.lessons ? (
              <Text style={styles.errorText}>{errors.lessons}</Text>
            ) : null}
            
            {lessons.map((lesson, index) => (
              <View key={lesson.id} style={styles.lessonItem}>
                <Text style={styles.lessonNumber}>{index + 1}</Text>
                <View style={styles.lessonInputs}>
                  <Input
                    placeholder="Название урока"
                    value={lesson.title}
                    onChangeText={(value) => handleUpdateLesson(index, 'title', value)}
                    containerStyle={styles.lessonInput}
                  />
                  <Input
                    placeholder="Описание урока"
                    value={lesson.description}
                    onChangeText={(value) => handleUpdateLesson(index, 'description', value)}
                    containerStyle={styles.lessonInput}
                  />
                  <Input
                    placeholder="Длительность (мин)"
                    value={lesson.duration.toString()}
                    onChangeText={(value) => handleUpdateLesson(index, 'duration', Number(value))}
                    keyboardType="numeric"
                    containerStyle={styles.lessonInput}
                  />
                  
                  <View style={styles.audioInputContainer}>
                    <Music size={20} color={colors.accent} style={styles.audioIcon} />
                    <Input
                      placeholder="Аудиофайл урока"
                      value={lesson.audioUrl}
                      onChangeText={(value) => handleUpdateLesson(index, 'audioUrl', value)}
                      containerStyle={styles.audioInput}
                    />
                  </View>
                  
                  <Text style={styles.audioHelperText}>
                    В реальном приложении здесь была бы возможность загрузить аудиофайл
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteLessonButton}
                  onPress={() => handleDeleteLesson(index)}
                >
                  <Trash2 size={20} color={colors.ui.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <Button
            title={isNewCourse ? "Создать курс" : "Сохранить изменения"}
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
  lessonsSection: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  lessonsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  lessonsSectionTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
  },
  addLessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
  },
  addLessonText: {
    color: colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  lessonNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: theme.spacing.m,
  },
  lessonInputs: {
    flex: 1,
  },
  lessonInput: {
    marginBottom: theme.spacing.s,
  },
  audioInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  audioIcon: {
    marginRight: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  audioInput: {
    flex: 1,
    marginBottom: 0,
  },
  audioHelperText: {
    color: colors.text.muted,
    fontSize: theme.fontSize.xs,
    marginBottom: theme.spacing.s,
    fontStyle: 'italic',
  },
  deleteLessonButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
  errorText: {
    color: colors.ui.error,
    fontSize: theme.fontSize.s,
    marginBottom: theme.spacing.m,
  },
  saveButton: {
    marginTop: theme.spacing.m,
  },
});