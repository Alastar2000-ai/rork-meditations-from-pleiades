import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Plus, Edit, Trash2 } from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import Background from '@/components/Background';
import PlatformImage from '@/components/PlatformImage';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function AdminInstructorsScreen() {
  const router = useRouter();
  const { instructors, deleteInstructor } = useContentStore();

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Удаление инструктора',
      `Вы уверены, что хотите удалить инструктора "${name}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => deleteInstructor(id)
        }
      ]
    );
  };

  return (
    <Background>
      <Stack.Screen 
        options={{
          title: 'Управление инструкторами',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/admin/edit-instructor/new')}
            >
              <Plus size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={instructors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <PlatformImage
                source={item.avatar}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {item.specialties[0]}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/admin/edit-instructor/${item.id}`)}
                >
                  <Edit size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Trash2 size={20} color={colors.ui.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Нет инструкторов. Нажмите + чтобы добавить нового.
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
  addButton: {
    padding: theme.spacing.s,
    marginRight: theme.spacing.s,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.m,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  itemSubtitle: {
    fontSize: theme.fontSize.s,
    color: colors.text.secondary,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    textAlign: 'center',
  },
});