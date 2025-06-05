import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useContentStore } from '@/store/content-store';
import PlatformImage from '@/components/PlatformImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import theme from '@/constants/theme';
import { Civilization, Constellation } from '@/types';
import SectionHeader from '@/components/SectionHeader';

export default function CivilizationsScreen() {
  const router = useRouter();
  const { civilizations, constellations } = useContentStore();
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  
  const filteredCivilizations = selectedConstellation
    ? civilizations.filter(civ => civ.constellationId === selectedConstellation)
    : civilizations;
  
  const handleConstellationPress = (id: string) => {
    if (selectedConstellation === id) {
      setSelectedConstellation(null);
    } else {
      setSelectedConstellation(id);
    }
  };
  
  const handleCivilizationPress = (id: string) => {
    router.push(`/civilization/${id}`);
  };
  
  const renderConstellationItem = ({ item }: { item: Constellation }) => (
    <TouchableOpacity
      style={[
        styles.constellationItem,
        selectedConstellation === item.id && styles.selectedConstellation
      ]}
      onPress={() => handleConstellationPress(item.id)}
    >
      <Text style={[
        styles.constellationName,
        selectedConstellation === item.id && styles.selectedConstellationText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  const renderCivilizationItem = ({ item }: { item: Civilization }) => (
    <TouchableOpacity
      style={styles.civilizationCard}
      onPress={() => handleCivilizationPress(item.id)}
    >
      <PlatformImage
        source={{ uri: item.imageUrl }}
        style={styles.civilizationImage}
        contentFit="cover"
      />
      <View style={styles.civilizationInfo}>
        <Text style={styles.civilizationName}>{item.name}</Text>
        <Text style={styles.civilizationConstellation}>
          {constellations.find(c => c.id === item.constellationId)?.name || 'Неизвестное созвездие'}
        </Text>
        <Text style={styles.civilizationDescription} numberOfLines={2}>
          {item.shortDescription}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <SectionHeader title="Созвездия" />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.constellationsScroll}
          contentContainerStyle={styles.constellationsContainer}
        >
          {constellations.map(constellation => (
            <TouchableOpacity
              key={constellation.id}
              style={[
                styles.constellationItem,
                selectedConstellation === constellation.id && styles.selectedConstellation
              ]}
              onPress={() => handleConstellationPress(constellation.id)}
            >
              <Text style={[
                styles.constellationName,
                selectedConstellation === constellation.id && styles.selectedConstellationText
              ]}>
                {constellation.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <SectionHeader 
          title={selectedConstellation 
            ? `Цивилизации ${constellations.find(c => c.id === selectedConstellation)?.name || ''}` 
            : "Все цивилизации"
          } 
        />
        
        <FlatList
          data={filteredCivilizations}
          renderItem={renderCivilizationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.civilizationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Цивилизации не найдены
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
  },
  constellationsScroll: {
    marginBottom: theme.spacing.m,
  },
  constellationsContainer: {
    paddingHorizontal: theme.spacing.s,
  },
  constellationItem: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: colors.background.medium,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.s,
  },
  selectedConstellation: {
    backgroundColor: colors.primary,
  },
  constellationName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.s,
    fontWeight: '500',
  },
  selectedConstellationText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  civilizationsList: {
    paddingBottom: 100, // Extra padding for player
  },
  civilizationCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.medium,
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
  },
  civilizationImage: {
    width: 100,
    height: 100,
  },
  civilizationInfo: {
    flex: 1,
    padding: theme.spacing.m,
  },
  civilizationName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  civilizationConstellation: {
    color: colors.accent,
    fontSize: theme.fontSize.xs,
    marginBottom: theme.spacing.s,
  },
  civilizationDescription: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  emptyContainer: {
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    textAlign: 'center',
  },
});