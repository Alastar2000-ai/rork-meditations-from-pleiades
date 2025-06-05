import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import InstructorCard from '@/components/InstructorCard';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function InstructorsScreen() {
  const router = useRouter();
  const { instructors } = useContentStore();

  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Инструкторы</Text>
          <Text style={styles.subtitle}>
            Опытные проводники в мир медитации
          </Text>
        </View>

        <FlatList
          data={instructors}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <InstructorCard
              name={item.name}
              avatar={item.avatar}
              specialties={item.specialties}
              onPress={() => router.push(`/instructor/${item.id}`)}
            />
          )}
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
  listContainer: {
    padding: theme.spacing.m,
    paddingBottom: 100,
  },
});