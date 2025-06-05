import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react-native';
import { alienCivilizations } from '@/mocks/alien-civilizations';
import { constellations } from '@/mocks/constellations';
import Background from '@/components/Background';
import PlatformImage from '@/components/PlatformImage';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function CivilizationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  const civilization = alienCivilizations.find(civ => civ.id === id);
  const constellation = civilization 
    ? constellations.find(c => c.id === civilization.constellation) 
    : null;
  
  if (!civilization) {
    return (
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Цивилизация не найдена</Text>
        </SafeAreaView>
      </Background>
    );
  }
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: civilization.name,
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
              source={civilization.image}
              style={styles.image}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{civilization.name}</Text>
              {constellation && (
                <TouchableOpacity 
                  style={styles.constellationButton}
                  onPress={() => router.push(`/constellation/${constellation.id}`)}
                >
                  <MapPin size={16} color={colors.text.primary} />
                  <Text style={styles.constellationText}>{constellation.name}</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.descriptionText}>{civilization.description}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Характеристики</Text>
              <View style={styles.traitsList}>
                {civilization.traits.map((trait, index) => (
                  <View key={index} style={styles.traitItem}>
                    <View style={styles.traitBullet} />
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>История</Text>
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={() => setShowFullHistory(!showFullHistory)}
                >
                  {showFullHistory ? (
                    <ChevronUp size={20} color={colors.text.primary} />
                  ) : (
                    <ChevronDown size={20} color={colors.text.primary} />
                  )}
                </TouchableOpacity>
              </View>
              
              <Text 
                style={styles.historyText}
                numberOfLines={showFullHistory ? undefined : 5}
              >
                {civilization.history}
              </Text>
              
              {!showFullHistory && (
                <TouchableOpacity 
                  style={styles.readMoreButton}
                  onPress={() => setShowFullHistory(true)}
                >
                  <Text style={styles.readMoreText}>Читать далее</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {constellation && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Созвездие {constellation.name}</Text>
                <View style={styles.constellationCard}>
                  <PlatformImage
                    source={constellation.image}
                    style={styles.constellationImage}
                    contentFit="cover"
                  />
                  <View style={styles.constellationInfo}>
                    <Text style={styles.constellationLatinName}>{constellation.latinName}</Text>
                    <Text style={styles.constellationCoordinates}>
                      RA: {constellation.coordinates.ra} | Dec: {constellation.coordinates.dec}
                    </Text>
                    <Text style={styles.constellationStars}>
                      Основные звёзды: {constellation.stars.join(', ')}
                    </Text>
                  </View>
                </View>
                
                <Button
                  title="Подробнее о созвездии"
                  onPress={() => router.push(`/constellation/${constellation.id}`)}
                  style={styles.constellationButton}
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
    height: 250,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.m,
  },
  title: {
    color: colors.text.primary,
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  constellationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.m,
    marginTop: theme.spacing.xs,
  },
  constellationText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.s,
    marginLeft: theme.spacing.xs,
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
  traitsList: {
    marginTop: theme.spacing.xs,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  traitBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 8,
    marginRight: theme.spacing.s,
  },
  traitText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandButton: {
    padding: theme.spacing.xs,
  },
  historyText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    lineHeight: 24,
  },
  readMoreButton: {
    marginTop: theme.spacing.s,
  },
  readMoreText: {
    color: colors.accent,
    fontSize: theme.fontSize.m,
  },
  constellationCard: {
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
  },
  constellationImage: {
    width: '100%',
    height: 150,
  },
  constellationInfo: {
    padding: theme.spacing.m,
  },
  constellationLatinName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
  constellationCoordinates: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    marginBottom: theme.spacing.s,
  },
  constellationStars: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
});