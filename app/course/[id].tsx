import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Play, 
  Star, 
  Book, 
  Heart, 
  Share2, 
  Edit, 
  Trash2,
  Lock
} from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import { useAuthStore } from '@/store/auth-store';
import { usePlayerStore } from '@/store/player-store';
import Background from '@/components/Background';
import Button from '@/components/Button';
import PlatformImage from '@/components/PlatformImage';
import theme from '@/constants/theme';
import colors from '@/constants/colors';
import { Lesson } from '@/types';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getCourseById, getInstructorById, deleteCourse } = useContentStore();
  const { user, isAdmin } = useAuthStore();
  const { play } = usePlayerStore();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const course = getCourseById(id as string);
  const instructor = course ? getInstructorById(course.instructorId) : null;
  
  if (!course || !instructor) {
    return (
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Курс не найден</Text>
        </SafeAreaView>
      </Background>
    );
  }
  
  const isPurchased = user?.purchasedCourses?.includes(course.id) || course.price === 0;
  
  const handlePlayLesson = (lesson: Lesson) => {
    if (isPurchased) {
      play(lesson);
    } else {
      Alert.alert(
        'Покупка курса',
        `Хотите приобрести курс "${course.title}" за ${course.price} ₽?`,
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Купить', 
            onPress: () => {
              // In a real app, this would process payment
              Alert.alert('Успех', 'Курс успешно приобретен!');
              play(lesson);
            } 
          }
        ]
      );
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Удаление курса',
      'Вы уверены, что хотите удалить этот курс?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            deleteCourse(course.id);
            router.back();
          } 
        }
      ]
    );
  };
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => isAdmin ? (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(`/admin/edit-course/${course.id}`)}
              >
                <Edit size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={colors.ui.error} />
              </TouchableOpacity>
            </View>
          ) : null
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <PlatformImage
              source={course.coverImage}
              style={styles.image}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', colors.background.dark]}
              style={styles.imageGradient}
            />
          </View>
          
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{course.title}</Text>
              
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.metaText}>{course.rating.toFixed(1)}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Book size={16} color={colors.text.secondary} />
                  <Text style={styles.metaText}>{course.lessons.length} уроков</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.instructorContainer}
                onPress={() => router.push(`/instructor/${instructor.id}`)}
              >
                <PlatformImage
                  source={instructor.avatar}
                  style={styles.instructorAvatar}
                  contentFit="cover"
                />
                <Text style={styles.instructorName}>{instructor.name}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionButtons}>
              <Button
                title={isPurchased ? "Начать курс" : `Купить за ${course.price} ₽`}
                onPress={() => handlePlayLesson(course.lessons[0])}
                icon={<Play size={20} color="white" />}
                style={styles.playButton}
              />
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Heart 
                  size={24} 
                  color={colors.text.primary} 
                  fill={isFavorite ? colors.ui.error : 'transparent'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Share2 size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>{course.description}</Text>
            </View>
            
            <View style={styles.lessonsContainer}>
              <Text style={styles.sectionTitle}>Уроки</Text>
              {course.lessons.map((lesson, index) => (
                <TouchableOpacity 
                  key={lesson.id}
                  style={styles.lessonItem}
                  onPress={() => handlePlayLesson(lesson)}
                >
                  <View style={styles.lessonNumber}>
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonDuration}>{lesson.duration} мин</Text>
                  </View>
                  {isPurchased ? (
                    <Play size={20} color={colors.accent} />
                  ) : (
                    <Lock size={20} color={colors.text.muted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.tagsContainer}>
              <Text style={styles.sectionTitle}>Теги</Text>
              <View style={styles.tags}>
                {course.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.l,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: theme.spacing.s,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  metaText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    marginLeft: theme.spacing.xs,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.spacing.s,
  },
  instructorName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  playButton: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.s,
  },
  description: {
    fontSize: theme.fontSize.m,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  lessonsContainer: {
    marginBottom: theme.spacing.l,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  lessonNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  lessonNumberText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  lessonDuration: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  tagsContainer: {
    marginBottom: theme.spacing.xl,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.l,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  tagText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
});