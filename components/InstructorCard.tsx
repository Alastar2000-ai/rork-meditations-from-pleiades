import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import colors from '@/constants/colors';
import theme from '@/constants/theme';
import PlatformImage from './PlatformImage';

interface InstructorCardProps {
  name: string;
  avatar: string;
  specialties: string[];
  onPress: () => void;
}

export default function InstructorCard({
  name,
  avatar,
  specialties,
  onPress,
}: InstructorCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <PlatformImage
        source={avatar}
        style={styles.avatar}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.specialty} numberOfLines={1}>
          {specialties[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.m,
  },
  content: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  specialty: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
  },
});