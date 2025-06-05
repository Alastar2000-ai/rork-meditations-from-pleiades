import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Users, Star } from 'lucide-react-native';
import { constellations } from '@/mocks/constellations';
import { alienCivilizations } from '@/mocks/alien-civilizations';
import Background from '@/components/Background';
import PlatformImage from '@/components/PlatformImage';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function ConstellationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const constellation = constellations.find(c => c.id === id);
  const civilizations = constellation 
    ? alienCivilizations.filter(civ => civ.constellation === constellation.id) 
    : [];
  
  if (!constellation) {
    return (
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Созвездие не найдено</Text>
        </SafeAreaView>
      </Background>
    );
  }
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: constellation.name,
          headerTransparent: true,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageContainer}>
            <PlatformImage
              source={constellation.image}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.title}>{constellation.name}</Text>
              <Text style={styles.latinName}>{constellation.latinName}</Text>
            </View>
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.coordinatesCard}>
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Прямое восхождение:</Text>
                <Text style={styles.coordinateValue}>{constellation.coordinates.ra}</Text>
              </View>
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Склонение:</Text>
                <Text style={styles.coordinateValue}>{constellation.coordinates.dec}</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.descriptionText}>{constellation.description}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Основные звёзды</Text>
              <View style={styles.starsList}>
                {constellation.stars.map((star, index) => (
                  <View key={index} style={styles.starItem}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.starName}>{star}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {civilizations.length > 0 && (
              <View style={styles.section}>
                <View style={styles.civilizationsHeader}>
                  <Text style={styles.sectionTitle}>Разумные цивилизации</Text>
                  <View style={styles.civilizationsCount}>
                    <Users size={16} color={colors.text.primary} />
                    <Text style={styles.civilizationsCountText}>{civilizations.length}</Text>
                  </View>
                </View>
                
                {civilizations.map((civilization) => (
                  <TouchableOpacity 
                    key={civilization.id}
                    style={styles.civilizationCard}
                    onPress={() => router.push(`/civilization/${civilization.id}`)}
                    activeOpacity={0.8}
                  >
                    <PlatformImage
                      source={civilization.image}
                      style={styles.civilizationImage}
                      contentFit="cover"
                    />
                    <View style={styles.civilizationContent}>
                      <Text style={styles.civilizationName}>{civilization.name}</Text>
                      <Text style={styles.civilizationDescription} numberOfLines={2}>
                        {civilization.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
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
  scrollContent: {
    paddingBottom: theme.spacing.xl,
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.m,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  title: {
    color: colors.text.primary,
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
  },
  latinName: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    fontStyle: 'italic',
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  coordinatesCard: {
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  coordinateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  coordinateLabel: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
  },
  coordinateValue: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    marginBottom: theme.spacing.s,
  },
  descriptionText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    lineHeight: 24,
  },
  starsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  starItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  starName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.s,
    marginLeft: theme.spacing.xs,
  },
  civilizationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  civilizationsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.m,
  },
  civilizationsCountText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.s,
    marginLeft: theme.spacing.xs,
  },
  civilizationCard: {
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
    flexDirection: 'row',
    height: 100,
  },
  civilizationImage: {
    width: 100,
    height: '100%',
  },
  civilizationContent: {
    flex: 1,
    padding: theme.spacing.m,
  },
  civilizationName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  civilizationDescription: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    lineHeight: 18,
  },
});