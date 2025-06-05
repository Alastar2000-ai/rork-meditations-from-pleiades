import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '@/constants/colors';
import theme from '@/constants/theme';
import { 
  Star, 
  CircleDot, 
  Moon, 
  Heart, 
  Atom, 
  Shield 
} from 'lucide-react-native';

interface CategoryCardProps {
  name: string;
  icon: string;
  onPress: () => void;
}

export default function CategoryCard({ name, icon, onPress }: CategoryCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'Star':
        return <Star size={24} color={colors.accent} />;
      case 'CircleDot':
        return <CircleDot size={24} color={colors.accent} />;
      case 'Moon':
        return <Moon size={24} color={colors.accent} />;
      case 'Heart':
        return <Heart size={24} color={colors.accent} />;
      case 'Atom':
        return <Atom size={24} color={colors.accent} />;
      case 'Shield':
        return <Shield size={24} color={colors.accent} />;
      default:
        return <Star size={24} color={colors.accent} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={styles.name} numberOfLines={2}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  iconContainer: {
    marginBottom: theme.spacing.s,
  },
  name: {
    color: colors.text.primary,
    fontSize: theme.fontSize.s,
    fontWeight: '500',
    textAlign: 'center',
  },
});