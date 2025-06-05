import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import SectionHeader from '@/components/SectionHeader';
import Card from '@/components/Card';
import CategoryCard from '@/components/CategoryCard';
import InstructorCard from '@/components/InstructorCard';
import theme from '@/constants/theme';
import colors from '@/constants/colors';
import { metaphorCards } from '@/mocks/metaphor-cards';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    featuredCourses, 
    featuredMeditations, 
    categories, 
    instructors 
  } = useContentStore();

  // Get 3 random metaphor cards
  const randomMetaphorCards = [...metaphorCards]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <View style={styles.mainContainer}>
      <Background>
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Медитации от Плеяд</Text>
              <Text style={styles.subtitle}>
                Космическая энергия для вашего развития
              </Text>
            </View>

            <SectionHeader 
              title="Категории" 
              onSeeAll={() => {}}
            />
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              renderItem={({ item }) => (
                <CategoryCard
                  name={item.name}
                  icon={item.icon}
                  onPress={() => {}}
                />
              )}
            />

            <SectionHeader 
              title="Рекомендуемые медитации" 
              onSeeAll={() => router.push('/meditations')}
            />
            <FlatList
              data={featuredMeditations}
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
                  featured={item.isFeatured}
                  onPress={() => router.push(`/meditation/${item.id}`)}
                  style={styles.card}
                />
              )}
            />

            <SectionHeader 
              title="Метафорические карты" 
              onSeeAll={() => router.push('/metaphor-cards')}
            />
            <FlatList
              data={randomMetaphorCards}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              renderItem={({ item }) => (
                <Card
                  title={item.name}
                  subtitle={item.category}
                  image={item.image}
                  onPress={() => router.push(`/metaphor-card/${item.id}`)}
                  style={styles.card}
                />
              )}
            />

            <SectionHeader 
              title="Популярные курсы" 
              onSeeAll={() => router.push('/courses')}
            />
            <FlatList
              data={featuredCourses}
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
                  featured={item.isFeatured}
                  onPress={() => router.push(`/course/${item.id}`)}
                  style={styles.card}
                />
              )}
            />

            <SectionHeader 
              title="Наши инструкторы" 
              onSeeAll={() => router.push('/instructors')}
            />
            <View style={styles.instructorsContainer}>
              {instructors.slice(0, 2).map((instructor) => (
                <InstructorCard
                  key={instructor.id}
                  name={instructor.name}
                  avatar={instructor.avatar}
                  specialties={instructor.specialties}
                  onPress={() => router.push(`/instructor/${instructor.id}`)}
                />
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Background>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.l,
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
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  cardsContainer: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  card: {
    width: 250,
  },
  instructorsContainer: {
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
});