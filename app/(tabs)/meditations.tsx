import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import Card from '@/components/Card';
import Input from '@/components/Input';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function MeditationsScreen() {
  const router = useRouter();
  const { meditations, categories } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMeditations = meditations.filter(meditation => {
    const matchesSearch = meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meditation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? meditation.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Медитации</Text>
          <Text style={styles.subtitle}>
            Найдите идеальную медитацию для себя
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Поиск медитаций..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.text.muted} />}
            containerStyle={styles.searchInput}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === null && styles.selectedCategoryChip,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.selectedCategoryText,
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredMeditations}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Медитации не найдены. Попробуйте изменить параметры поиска.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
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
  searchContainer: {
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  searchInput: {
    marginBottom: 0,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    gap: theme.spacing.s,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.l,
    backgroundColor: colors.background.light,
    marginBottom: theme.spacing.xs,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  selectedCategoryText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  listContainer: {
    padding: theme.spacing.m,
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    margin: theme.spacing.xs,
    maxWidth: '48%',
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
});