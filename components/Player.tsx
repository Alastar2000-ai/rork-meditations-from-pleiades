import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react-native';
import { usePlayerStore } from '@/store/player-store';
import colors from '@/constants/colors';
import theme from '@/constants/theme';

export default function Player() {
  const { 
    isPlaying, 
    currentItem, 
    progress, 
    duration,
    pause, 
    resume, 
    stop,
    setProgress 
  } = usePlayerStore();
  
  const [timeElapsed, setTimeElapsed] = useState('0:00');
  const [timeRemaining, setTimeRemaining] = useState('0:00');
  
  useEffect(() => {
    if (!currentItem) return;
    
    const totalSeconds = duration;
    const elapsedSeconds = Math.floor(progress * totalSeconds);
    const remainingSeconds = Math.floor(totalSeconds - elapsedSeconds);
    
    setTimeElapsed(formatTime(elapsedSeconds));
    setTimeRemaining(formatTime(remainingSeconds));
  }, [progress, duration, currentItem]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!currentItem) return null;
  
  // Fix for Android touch handling
  const handleProgressTouch = (event: any) => {
    if (Platform.OS === 'android') {
      // Android-specific touch handling
      const { locationX } = event.nativeEvent;
      const containerWidth = event.nativeEvent.layout?.width || 300;
      const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
      setProgress(newProgress);
    } else {
      // iOS touch handling remains the same
      const { locationX } = event.nativeEvent;
      const containerWidth = 300; // Approximate width, adjust as needed
      const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
      setProgress(newProgress);
    }
  };
  
  return (
    <LinearGradient
      colors={[colors.background.medium, colors.background.dark]}
      style={styles.container}
    >
      <View 
        style={styles.progressBar}
        onTouchStart={handleProgressTouch}
        onLayout={(event) => {
          // Store the width for Android touch calculations
          event.persist();
        }}
      >
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
        <TouchableOpacity
          style={[styles.progressTouch, { left: `${progress * 100}%` }]}
          onPress={() => {}}
        >
          <View style={styles.progressHandle} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentItem.title}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{timeElapsed}</Text>
            <Text style={styles.time}>-{timeRemaining}</Text>
          </View>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <SkipBack size={20} color={colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={isPlaying ? pause : resume}
          >
            {isPlaying ? (
              <Pause size={24} color={colors.text.primary} />
            ) : (
              <Play size={24} color={colors.text.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <SkipForward size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={stop}>
          <X size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: theme.spacing.s,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.l : theme.spacing.m,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    // Fix for Android elevation and shadow
    ...Platform.select({
      android: {
        elevation: 8,
        zIndex: 1000,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      }
    })
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: theme.spacing.m,
    borderRadius: 2,
    marginBottom: theme.spacing.s,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressTouch: {
    position: 'absolute',
    top: -8,
    marginLeft: -8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Fix for Android touch target
    ...Platform.select({
      android: {
        padding: 10,
        backgroundColor: 'transparent',
      }
    })
  },
  progressHandle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  time: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.m,
  },
  controlButton: {
    padding: theme.spacing.s,
    // Fix for Android touch target
    ...Platform.select({
      android: {
        padding: theme.spacing.m,
      }
    })
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.s,
  },
  closeButton: {
    padding: theme.spacing.s,
    // Fix for Android touch target
    ...Platform.select({
      android: {
        padding: theme.spacing.m,
      }
    })
  },
});