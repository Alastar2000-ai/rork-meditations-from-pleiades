import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ViewStyle,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import theme from '@/constants/theme';
import { Star } from 'lucide-react-native';
import PlatformImage from './PlatformImage';

interface CardProps {
  title: string;
  subtitle?: string;
  image: string;
  rating?: number;
  price?: number;
  onPress: () => void;
  style?: ViewStyle;
  featured?: boolean;
}

export default function Card({
  title,
  subtitle,
  image,
  rating,
  price,
  onPress,
  style,
  featured = false
}: CardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, featured && styles.featuredContainer, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <PlatformImage
        source={image}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        {featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Рекомендуем</Text>
          </View>
        )}
        
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
        
        <View style={styles.footer}>
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          )}
          
          {price !== undefined && (
            <Text style={styles.price}>
              {price === 0 ? 'Бесплатно' : `${price} ₽`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    backgroundColor: colors.background.medium,
    height: 180,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  featuredContainer: {
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.m,
  },
  title: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    marginBottom: theme.spacing.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
  price: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
  },
  featuredBadge: {
    position: 'absolute',
    top: -theme.spacing.l * 2,
    right: theme.spacing.s,
    backgroundColor: colors.accent,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
  },
  featuredText: {
    color: colors.text.primary,
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
  },
});