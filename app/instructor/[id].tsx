import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Edit, Trash2 } from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import { useAuthStore } from '@/store/auth-store';
import Background from '@/components/Background';
import Card from '@/components/Card';
import PlatformImage from '@/components/PlatformImage';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function InstructorDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    getInstructorById, 
    getCoursesByInstructor, 
    getMeditationsByInstructor,
    deleteInstructor
  } = useContentStore();
  const { isAdmin } = useAuthStore();
  
  const instructor = getInstructorById(id as string);
  
  if (!instructor) {
    return (
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Инструктор не найден</Text>
        </SafeAreaView>
      </Background>
    );
  }
  
  const courses = getCoursesByInstructor(instructor.id);
  const meditations = getMeditationsByInstructor(instructor.id);
  
  const handleDelete = () => {
    Alert.alert(
      'Удаление инструктора',
      'Вы уверены, что хотите удалить этого инструктора?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            deleteInstructor(instructor.id);
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
                onPress={() => router.push(`/admin/edit-instructor/${instructor.id}`)}
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
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <PlatformImage
                source={instructor.avatar}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
            <Text style={styles.name}>{instructor.name}</Text>
            <View style={styles.specialtiesContainer}>
              {instructor.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.content}>
            <View style={styles.bioContainer}>
              <Text style={styles.sectionTitle}>Биография</Text>
              <Text style={styles.bio}>{instructor.bio}</Text>
            </View>
            
            {courses.length > 0 && (
              <View style={styles.coursesContainer}>
                <Text style={styles.sectionTitle}>Курсы</Text>
                <FlatList
                  data={courses}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardsContainer}
                  renderItem={({ item }) => (
                    <Card
                      title={item.title}
                      subtitle={`${item.lessons.length} уроков`}
                      image={item.coverImage}
                      rating={item.rating}
                      price={item.price}
                      onPress={() => router.push(`/course/${item.id}`)}
                      style={styles.card}
                    />
                  )}
                />
              </View>
            )}
            
            {meditations.length > 0 && (
              <View style={styles.meditationsContainer}>
                <Text style={styles.sectionTitle}>Медитации</Text>
                <FlatList
                  data={meditations}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardsContainer}
                  renderItem={({ item }) => (
                    <Card
                      title={item.title}
                      subtitle={`${item.duration} мин`}
                      image={item.coverImage}
                      rating={item.rating}
                      price={item.price}
                      onPress={() => router.push(`/meditation/${item.id}`)}
                      style={styles.card}
                    />
                  )}
                />
              </View>
            )}
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
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: theme.spacing.l,
  },
  avatarContainer: {
    marginBottom: theme.spacing.m,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: theme.spacing.m,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  specialtyChip: {
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.l,
    margin: theme.spacing.xs,
  },
  specialtyText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  content: {
    padding: theme.spacing.m,
  },
  bioContainer: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.s,
  },
  bio: {
    fontSize: theme.fontSize.m,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  coursesContainer: {
    marginBottom: theme.spacing.l,
  },
  meditationsContainer: {
    marginBottom: theme.spacing.xl,
  },
  cardsContainer: {
    gap: theme.spacing.m,
  },
  card: {
    width: 250,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
});