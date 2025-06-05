import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Share2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react-native';
import { metaphorCards } from '@/mocks/metaphor-cards';
import { archangelCards } from '@/mocks/archangel-cards';
import { amuMomCards } from '@/mocks/amu-mom-cards';
import { cardDecks } from '@/mocks/card-decks';
import Background from '@/components/Background';
import PlatformImage from '@/components/PlatformImage';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

export default function MetaphorCardDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(true);
  
  // Find card in all decks
  const allCards = [...metaphorCards, ...archangelCards, ...amuMomCards];
  const card = allCards.find(card => card.id === id);
  
  // Find deck info
  const deckInfo = card ? cardDecks.find(deck => deck.type === card.deck) : null;
  
  if (!card) {
    return (
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Карта не найдена</Text>
        </SafeAreaView>
      </Background>
    );
  }
  
  return (
    <Background>
      <Stack.Screen 
        options={{
          title: card.name,
          headerTransparent: true,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardContainer}>
            <PlatformImage
              source={card.image}
              style={styles.cardImage}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{card.name}</Text>
                {deckInfo && (
                  <View style={styles.deckBadge}>
                    <Text style={styles.deckName}>{deckInfo.author}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.shareButton}>
                <Share2 size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.keywordsContainer}>
              {card.keywords.map((keyword, index) => (
                <View key={index} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>{keyword}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? (
                    <ChevronUp size={20} color={colors.text.primary} />
                  ) : (
                    <ChevronDown size={20} color={colors.text.primary} />
                  )}
                </TouchableOpacity>
              </View>
              
              {showFullDescription && (
                <Text style={styles.descriptionText}>{card.description}</Text>
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Значение</Text>
              <Text style={styles.meaningTitle}>В прямом положении</Text>
              <Text style={styles.meaningText}>{card.meaning.upright}</Text>
              
              {card.meaning.reversed && (
                <>
                  <Text style={styles.meaningTitle}>В перевернутом положении</Text>
                  <Text style={styles.meaningText}>{card.meaning.reversed}</Text>
                </>
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Категория</Text>
              <Text style={styles.categoryText}>{card.category}</Text>
            </View>
            
            <Button
              title="Вернуться к колоде"
              onPress={() => router.push('/metaphor-cards')}
              style={styles.backButton}
              icon={<ArrowLeft size={20} color={colors.text.primary} />}
            />
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
  cardContainer: {
    height: 400,
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.m,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  title: {
    color: colors.text.primary,
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  deckBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
    alignSelf: 'flex-start',
  },
  deckName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
  },
  shareButton: {
    padding: theme.spacing.s,
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.l,
  },
  keywordChip: {
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.l,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  keywordText: {
    color: colors.accent,
    fontSize: theme.fontSize.s,
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    marginBottom: theme.spacing.s,
  },
  expandButton: {
    padding: theme.spacing.xs,
  },
  descriptionText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    lineHeight: 24,
  },
  meaningTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.m,
  },
  meaningText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    lineHeight: 24,
  },
  categoryText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
  },
  backButton: {
    marginTop: theme.spacing.l,
  },
});