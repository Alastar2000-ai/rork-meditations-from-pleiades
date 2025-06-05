import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

interface BackgroundProps {
  children: React.ReactNode;
  intensity?: number;
}

const { width, height } = Dimensions.get('window');

export default function Background({ children, intensity = 0.7 }: BackgroundProps) {
  // Fix for Android rendering issues with LinearGradient in SDK53
  // Use explicit color values instead of array references to fix type issues
  const gradientColors = [
    colors.background.dark, 
    colors.background.medium, 
    colors.primary
  ] as const; // Use 'as const' to make it a readonly tuple
  
  const gradientLocations = [0, 0.7, 1] as const; // Use 'as const' to make it a readonly tuple

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        style={styles.gradient}
      />
      <View style={styles.starsContainer}>
        {Array.from({ length: Platform.OS === 'android' ? 30 : 50 }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.star, 
              { 
                left: Math.random() * width, 
                top: Math.random() * height,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2
              }
            ]} 
          />
        ))}
        
        {/* Pleiades constellation - approximate star positions */}
        <View style={[styles.pleiadStar, { left: '50%', top: '30%', width: 3, height: 3 }]} />
        <View style={[styles.pleiadStar, { left: '52%', top: '32%', width: 3, height: 3 }]} />
        <View style={[styles.pleiadStar, { left: '48%', top: '33%', width: 3, height: 3 }]} />
        <View style={[styles.pleiadStar, { left: '51%', top: '35%', width: 3, height: 3 }]} />
        <View style={[styles.pleiadStar, { left: '47%', top: '36%', width: 3, height: 3 }]} />
        <View style={[styles.pleiadStar, { left: '53%', top: '37%', width: 3, height: 3 }]} />
        <View style={[styles.pleiadStar, { left: '49%', top: '38%', width: 3, height: 3 }]} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.dark, // Fallback background color
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    // Fix for Android z-index issues
    ...Platform.select({
      android: {
        zIndex: 0,
      }
    })
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  pleiadStar: {
    position: 'absolute',
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    // Fix for Android elevation
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#4FC3F7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      }
    })
  },
  content: {
    flex: 1,
    // Fix for Android content rendering
    ...Platform.select({
      android: {
        zIndex: 1,
      }
    })
  },
});