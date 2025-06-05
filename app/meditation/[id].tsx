import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Play, 
  Star, 
  Clock, 
  Heart, 
  Share2, 
  Edit, 
  Trash2 
} from 'lucide-react-native';
import { useContentStore } from '@/store/content-store';
import { useAuthStore } from '@/store/auth-store';
import { usePlayerStore } from '@/store/player-store';
import Background from '@/components/Background';
import Button from '@/components/Button';
import PlatformImage from '@/components/PlatformImage';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function MeditationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getMeditationById, getInstructorById, deleteMeditation } = useContentStore();
  const { user, isAdmin } = useAuthStore();
  const { play } = usePlayerStore();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const meditation = getMeditationById(id as string);
  const instructor = meditation ? getInstructorById(meditation.instructorId) : null;
  
  if (!meditation || !instructor) {
    return (
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Медитация не найдена</Text>
        </SafeAreaView>
      </Background>
    );
  }
  
  const isPurchased = user?.purchasedMeditations?.includes(meditation.id) || meditation.price === 0;
  
  const handlePlay = () => {
    if (isPurchased) {
      play(meditation);
    } else {
      Alert.alert(
        'Покупка медитации',
        `Хотите приобрести медитацию "${meditation.title}" за ${meditation.price} ₽?`,
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Купить', 
            onPress: () => {
              // In a real app, this would process payment
              Alert.alert('Успех', 'Медитация успешно приобретена!');
              play(meditation);
            } 
          }
        ]
      );
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Удаление медитации',
      'Вы уверены, что хотите удалить эту медитацию?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            deleteMeditation(meditation.id);
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
                onPress={() => router.push(`/admin/edit-meditation/${meditation.id}`)}
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
              source={meditation.coverImage}
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
              <Text style={styles.title}>{meditation.title}</Text>
              
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.metaText}>{meditation.rating.toFixed(1)}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Clock size={16} color={colors.text.secondary} />
                  <Text style={styles.metaText}>{meditation.duration} мин</Text>
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
                title={isPurchased ? "Слушать" : `Купить за ${meditation.price} ₽`}
                onPress={handlePlay}
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
              <Text style={styles.description}>{meditation.description}</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              <Text style={styles.sectionTitle}>Теги</Text>
              <View style={styles.tags}>
                {meditation.tags.map((tag, index) => (
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