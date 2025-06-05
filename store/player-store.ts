import { create } from 'zustand';
import { Meditation, Lesson } from '@/types';

type PlayableItem = Meditation | Lesson;

interface PlayerState {
  isPlaying: boolean;
  currentItem: PlayableItem | null;
  progress: number; // 0 to 1
  duration: number; // in seconds
  
  play: (item: PlayableItem) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentItem: null,
  progress: 0,
  duration: 0,
  
  play: (item) => {
    set({ 
      currentItem: item, 
      isPlaying: true,
      progress: 0
    });
  },
  
  pause: () => {
    set({ isPlaying: false });
  },
  
  resume: () => {
    set({ isPlaying: true });
  },
  
  stop: () => {
    set({ 
      isPlaying: false, 
      currentItem: null,
      progress: 0,
      duration: 0
    });
  },
  
  setProgress: (progress) => {
    set({ progress });
  },
  
  setDuration: (duration) => {
    set({ duration });
  }
}));