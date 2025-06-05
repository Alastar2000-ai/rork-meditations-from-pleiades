import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  lastSync: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleAdmin: () => void; // For demo purposes only
  
  // Admin functions
  syncUserData: () => Promise<boolean>;
  checkAdminUpdates: () => Promise<boolean>;
  publishContentUpdate: () => Promise<boolean>;
}

// Demo user for testing
const demoUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Демо Пользователь',
  isAdmin: false,
  purchasedCourses: ['2'],
  purchasedMeditations: ['1', '3'],
  favorites: ['1', '3', '5'],
  createdAt: new Date().toISOString()
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      token: null,
      lastSync: null,
      
      login: async (email: string, password: string) => {
        // In a real app, this would make an API call to authenticate
        // For demo purposes, we'll just set the demo user
        set({ 
          user: demoUser, 
          isAuthenticated: true,
          isAdmin: demoUser.isAdmin,
          token: 'demo-token-' + Math.random().toString(36).substring(2),
          lastSync: new Date().toISOString()
        });
        return true;
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isAdmin: false,
          token: null
        });
      },
      
      toggleAdmin: () => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, isAdmin: !user.isAdmin };
          set({ 
            user: updatedUser, 
            isAdmin: updatedUser.isAdmin,
            lastSync: new Date().toISOString()
          });
        }
      },
      
      // Admin functions
      syncUserData: async () => {
        try {
          // In a real app, this would make an API call to sync user data
          // For demo purposes, we'll just update the lastSync timestamp
          set({ lastSync: new Date().toISOString() });
          return true;
        } catch (error) {
          console.error('Error syncing user data:', error);
          return false;
        }
      },
      
      checkAdminUpdates: async () => {
        try {
          // In a real app, this would check for admin-published updates
          // For demo purposes, we'll just return true to simulate an update
          
          // Only admins can check for updates
          if (!get().isAdmin) return false;
          
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return true;
        } catch (error) {
          console.error('Error checking for admin updates:', error);
          return false;
        }
      },
      
      publishContentUpdate: async () => {
        try {
          // In a real app, this would publish content updates to a server
          // For demo purposes, we'll just update the lastSync timestamp
          
          // Only admins can publish updates
          if (!get().isAdmin) return false;
          
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Update lastSync timestamp
          set({ lastSync: new Date().toISOString() });
          
          // Trigger app update if on a real device (not web)
          if (Platform.OS !== 'web') {
            try {
              await Updates.reloadAsync();
            } catch (updateError) {
              console.log('Error reloading app:', updateError);
            }
          }
          
          return true;
        } catch (error) {
          console.error('Error publishing content update:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist necessary data to avoid storage limits
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        token: state.token,
        lastSync: state.lastSync
      }),
    }
  )
);