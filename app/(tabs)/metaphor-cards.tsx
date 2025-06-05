import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Animated, 
  Platform,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shuffle, RotateCcw, ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { metaphorCards } from '@/mocks/metaphor-cards';
import { archangelCards } from '@/mocks/archangel-cards';
import { amuMomCards } from '@/mocks/amu-mom-cards';
import { cardDecks } from '@/mocks/card-decks';
import { MetaphorCard, CardDeck } from '@/types';
import Background from '@/components/Background';
import PlatformImage from '@/components/PlatformImage';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const CARD_ASPECT_RATIO = 1.5; // Standard tarot card ratio
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = CARD_WIDTH * CARD_ASPECT_RATIO;

export default function MetaphorCardsScreen() {
  const router = useRouter();
  const [selectedDeck, setSelectedDeck] = useState<CardDeck>(cardDecks[0]);
  const [deck, setDeck] = useState<MetaphorCard[]>([...metaphorCards]);
  const [selectedCard, setSelectedCard] = useState<MetaphorCard | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  
  // Change deck when selectedDeck changes
  useEffect(() => {
    let newDeck: MetaphorCard[] = [];
    
    switch(selectedDeck.type) {
      case 'cosmic':
        newDeck = [...metaphorCards];
        break;
      case 'archangels':
        newDeck = [...archangelCards];
        break;
      case 'amu-mom':
        newDeck = [...amuMomCards];
        break;
      default:
        newDeck = [...metaphorCards];
    }
    
    // Reset state and shuffle the new deck
    setSelectedCard(null);
    setIsRevealed(false);
    setIsReversed(false);
    setShowFullDescription(false);
    flipAnimation.setValue(0);
    
    // Animate cards disappearing
    Animated.timing(cardOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Set and shuffle the new deck
      setDeck(newDeck);
      
      // Animate cards appearing
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [selectedDeck]);
  
  // Shuffle the deck
  const shuffleDeck = () => {
    setSelectedCard(null);
    setIsRevealed(false);
    
    // Animate cards disappearing
    Animated.timing(cardOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Shuffle the deck
      const newDeck = [...deck];
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      }
      setDeck(newDeck);
      
      // Animate cards appearing
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  
  // Reset the reading
  const resetReading = () => {
    setSelectedCard(null);
    setIsRevealed(false);
    setIsReversed(false);
    setShowFullDescription(false);
    
    // Reset flip animation
    flipAnimation.setValue(0);
  };
  
  // Select a random card
  const selectRandomCard = () => {
    if (selectedCard) return;
    
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    setSelectedCard(card);
    
    // 30% chance of card being reversed
    setIsReversed(Math.random() < 0.3);
    
    // Start flip animation
    Animated.timing(flipAnimation, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  // Reveal the selected card
  const revealCard = () => {
    if (!selectedCard || isRevealed) return;
    
    setIsRevealed(true);
    
    // Complete flip animation
    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  // View card details
  const viewCardDetails = () => {
    if (selectedCard && isRevealed) {
      router.push(`/metaphor-card/${selectedCard.id}`);
    }
  };
  
  // Interpolate flip animation for front and back of card
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  const frontRotateY = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  
  const backRotateY = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });
  
  return (
    <Background>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Метафорические карты</Text>
          <Text style={styles.subtitle}>
            Выберите карту для получения глубокого метафорического послания
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={shuffleDeck}
          >
            <Shuffle size={20} color={colors.text.primary} />
            <Text style={styles.actionText}>Перемешать</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={resetReading}
          >
            <RotateCcw size={20} color={colors.text.primary} />
            <Text style={styles.actionText}>Сбросить</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContainer}>
          {!selectedCard ? (
            // Deck of cards
            <Animated.View 
              style={[styles.deck, { opacity: cardOpacity }]}
            >
              {[...Array(5)].map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.deckCard, 
                    { 
                      top: index * 2, 
                      left: index * 2 
                    }
                  ]} 
                />
              ))}
              <TouchableOpacity 
                style={styles.selectCardButton}
                onPress={selectRandomCard}
              >
                <Text style={styles.selectCardText}>Выбрать карту</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            // Selected card
            <View style={styles.selectedCardContainer}>
              {!isRevealed ? (
                // Card back (not yet revealed)
                <TouchableOpacity 
                  style={styles.cardBack}
                  onPress={revealCard}
                >
                  <Animated.View 
                    style={[
                      styles.cardFace, 
                      styles.cardBackFace,
                      { 
                        opacity: frontOpacity,
                        transform: [{ rotateY: frontRotateY }],
                      }
                    ]}
                  >
                    <View style={styles.cardBackDesign}>
                      <Text style={styles.cardBackText}>Нажмите, чтобы открыть</Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              ) : null}
              
              {/* Card front (revealed) */}
              <Animated.View 
                style={[
                  styles.cardFace, 
                  { 
                    opacity: backOpacity,
                    transform: [
                      { rotateY: backRotateY },
                      { rotate: isReversed ? '180deg' : '0deg' }
                    ],
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.cardImageContainer}
                  onPress={viewCardDetails}
                  activeOpacity={0.9}
                >
                  <PlatformImage
                    source={selectedCard.image}
                    style={styles.cardImage}
                    contentFit="cover"
                  />
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{selectedCard.name}</Text>
                    {isReversed && (
                      <Text style={styles.reversedText}>(В перевернутом положении)</Text>
                    )}
                    <View style={styles.infoButton}>
                      <Info size={16} color={colors.text.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
        
        {selectedCard && isRevealed && (
          <View style={styles.meaningContainer}>
            <View style={styles.meaningHeader}>
              <Text style={styles.meaningTitle}>Значение карты</Text>
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
            
            <ScrollView 
              style={styles.meaningScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.keywords}>
                {selectedCard.keywords.join(' • ')}
              </Text>
              
              <Text style={styles.meaningText}>
                {isReversed && selectedCard.meaning.reversed 
                  ? selectedCard.meaning.reversed 
                  : selectedCard.meaning.upright}
              </Text>
              
              {showFullDescription && (
                <>
                  <Text style={styles.descriptionTitle}>Описание</Text>
                  <Text style={styles.descriptionText}>
                    {selectedCard.description}
                  </Text>
                </>
              )}
            </ScrollView>
            
            <Button
              title="Новое гадание"
              onPress={resetReading}
              style={styles.newReadingButton}
            />
          </View>
        )}
        
        {/* Deck selection */}
        <View style={styles.deckSelectionContainer}>
          <Text style={styles.deckSelectionTitle}>Выберите колоду:</Text>
          <FlatList
            data={cardDecks}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deckList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.deckItem,
                  selectedDeck.id === item.id && styles.selectedDeckItem
                ]}
                onPress={() => setSelectedDeck(item)}
              >
                <PlatformImage
                  source={item.authorImage}
                  style={styles.authorImage}
                  contentFit="cover"
                />
                <Text style={styles.deckName}>{item.author}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    marginHorizontal: theme.spacing.s,
  },
  actionText: {
    color: colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_HEIGHT + 20,
    marginBottom: theme.spacing.m,
  },
  deck: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  deckCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      },
    }),
  },
  selectCardButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: theme.borderRadius.m,
  },
  selectCardText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
  },
  selectedCardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      },
    }),
  },
  cardBackFace: {
    backgroundColor: colors.background.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardBackDesign: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    backgroundColor: colors.background.medium,
    borderRadius: theme.borderRadius.m,
  },
  cardBackText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardBack: {
    width: '100%',
    height: '100%',
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.m,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    textAlign: 'center',
  },
  reversedText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  infoButton: {
    position: 'absolute',
    right: theme.spacing.m,
    bottom: theme.spacing.m,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningContainer: {
    flex: 1,
    backgroundColor: colors.background.light,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
  },
  meaningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  meaningTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
  },
  expandButton: {
    padding: theme.spacing.xs,
  },
  meaningScroll: {
    flex: 1,
    marginBottom: theme.spacing.m,
  },
  keywords: {
    color: colors.accent,
    fontSize: theme.fontSize.s,
    fontWeight: '500',
    marginBottom: theme.spacing.m,
  },
  meaningText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    lineHeight: 24,
    marginBottom: theme.spacing.m,
  },
  descriptionTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginBottom: theme.spacing.s,
  },
  descriptionText: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.m,
    lineHeight: 24,
  },
  newReadingButton: {
    marginTop: theme.spacing.m,
  },
  deckSelectionContainer: {
    padding: theme.spacing.m,
    backgroundColor: colors.background.medium,
  },
  deckSelectionTitle: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    marginBottom: theme.spacing.s,
  },
  deckList: {
    paddingVertical: theme.spacing.s,
  },
  deckItem: {
    alignItems: 'center',
    marginRight: theme.spacing.l,
    opacity: 0.7,
  },
  selectedDeckItem: {
    opacity: 1,
  },
  authorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: theme.spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  deckName: {
    color: colors.text.primary,
    fontSize: theme.fontSize.s,
    textAlign: 'center',
    maxWidth: 80,
  },
});