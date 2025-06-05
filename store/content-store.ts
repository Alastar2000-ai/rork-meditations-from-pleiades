import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Meditation, Instructor, Category, MetaphorCard, Civilization, Constellation } from '@/types';
import { courses as initialCourses } from '@/mocks/courses';
import { meditations as initialMeditations } from '@/mocks/meditations';
import { instructors as initialInstructors } from '@/mocks/instructors';
import { categories as initialCategories } from '@/mocks/categories';
import { metaphorCards as initialMetaphorCards } from '@/mocks/metaphor-cards';
import { archangelCards as initialArchangelCards } from '@/mocks/archangel-cards';
import { amuMomCards as initialAmuMomCards } from '@/mocks/amu-mom-cards';
import { civilizations as initialCivilizations } from '@/mocks/alien-civilizations';
import { constellations as initialConstellations } from '@/mocks/constellations';

interface ContentState {
  courses: Course[];
  meditations: Meditation[];
  instructors: Instructor[];
  categories: Category[];
  metaphorCards: MetaphorCard[];
  archangelCards: MetaphorCard[];
  amuMomCards: MetaphorCard[];
  civilizations: Civilization[];
  constellations: Constellation[];
  featuredCourses: Course[];
  featuredMeditations: Meditation[];
  lastUpdated: string;
  
  // Admin functions
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  addMeditation: (meditation: Meditation) => void;
  updateMeditation: (id: string, updates: Partial<Meditation>) => void;
  deleteMeditation: (id: string) => void;
  
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (id: string, updates: Partial<Instructor>) => void;
  deleteInstructor: (id: string) => void;
  
  addMetaphorCard: (card: MetaphorCard) => void;
  updateMetaphorCard: (id: string, updates: Partial<MetaphorCard>) => void;
  deleteMetaphorCard: (id: string) => void;
  
  addCivilization: (civilization: Civilization) => void;
  updateCivilization: (id: string, updates: Partial<Civilization>) => void;
  deleteCivilization: (id: string) => void;
  
  addConstellation: (constellation: Constellation) => void;
  updateConstellation: (id: string, updates: Partial<Constellation>) => void;
  deleteConstellation: (id: string) => void;
  
  // User functions
  getCourseById: (id: string) => Course | undefined;
  getMeditationById: (id: string) => Meditation | undefined;
  getInstructorById: (id: string) => Instructor | undefined;
  getMetaphorCardById: (id: string, deck?: string) => MetaphorCard | undefined;
  getCivilizationById: (id: string) => Civilization | undefined;
  getConstellationById: (id: string) => Constellation | undefined;
  getCoursesByInstructor: (instructorId: string) => Course[];
  getMeditationsByInstructor: (instructorId: string) => Meditation[];
  getCoursesByCategory: (categoryId: string) => Course[];
  getMeditationsByCategory: (categoryId: string) => Meditation[];
  getCivilizationsByConstellation: (constellationId: string) => Civilization[];
  
  // Sync functions for admin updates
  syncContent: (serverData: Partial<ContentState>) => void;
  checkForUpdates: () => Promise<boolean>;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      courses: initialCourses,
      meditations: initialMeditations,
      instructors: initialInstructors,
      categories: initialCategories,
      metaphorCards: initialMetaphorCards,
      archangelCards: initialArchangelCards,
      amuMomCards: initialAmuMomCards,
      civilizations: initialCivilizations,
      constellations: initialConstellations,
      lastUpdated: new Date().toISOString(),
      
      get featuredCourses() {
        return get().courses.filter(course => course.isFeatured);
      },
      
      get featuredMeditations() {
        return get().meditations.filter(meditation => meditation.isFeatured);
      },
      
      // Admin functions
      addCourse: (course) => {
        set((state) => ({
          courses: [...state.courses, course],
          lastUpdated: new Date().toISOString()
        }));
      },
      
      updateCourse: (id, updates) => {
        set((state) => ({
          courses: state.courses.map(course => 
            course.id === id ? { ...course, ...updates } : course
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter(course => course.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      addMeditation: (meditation) => {
        set((state) => ({
          meditations: [...state.meditations, meditation],
          lastUpdated: new Date().toISOString()
        }));
      },
      
      updateMeditation: (id, updates) => {
        set((state) => ({
          meditations: state.meditations.map(meditation => 
            meditation.id === id ? { ...meditation, ...updates } : meditation
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteMeditation: (id) => {
        set((state) => ({
          meditations: state.meditations.filter(meditation => meditation.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      addInstructor: (instructor) => {
        set((state) => ({
          instructors: [...state.instructors, instructor],
          lastUpdated: new Date().toISOString()
        }));
      },
      
      updateInstructor: (id, updates) => {
        set((state) => ({
          instructors: state.instructors.map(instructor => 
            instructor.id === id ? { ...instructor, ...updates } : instructor
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteInstructor: (id) => {
        set((state) => ({
          instructors: state.instructors.filter(instructor => instructor.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      addMetaphorCard: (card) => {
        set((state) => {
          // Determine which deck to add to based on card.deck property
          if (card.deck === 'archangels') {
            return {
              archangelCards: [...state.archangelCards, card],
              lastUpdated: new Date().toISOString()
            };
          } else if (card.deck === 'amu-mom') {
            return {
              amuMomCards: [...state.amuMomCards, card],
              lastUpdated: new Date().toISOString()
            };
          } else {
            return {
              metaphorCards: [...state.metaphorCards, card],
              lastUpdated: new Date().toISOString()
            };
          }
        });
      },
      
      updateMetaphorCard: (id, updates) => {
        set((state) => {
          const deck = updates.deck || '';
          
          if (deck === 'archangels' || state.archangelCards.some(card => card.id === id)) {
            return {
              archangelCards: state.archangelCards.map(card => 
                card.id === id ? { ...card, ...updates } : card
              ),
              lastUpdated: new Date().toISOString()
            };
          } else if (deck === 'amu-mom' || state.amuMomCards.some(card => card.id === id)) {
            return {
              amuMomCards: state.amuMomCards.map(card => 
                card.id === id ? { ...card, ...updates } : card
              ),
              lastUpdated: new Date().toISOString()
            };
          } else {
            return {
              metaphorCards: state.metaphorCards.map(card => 
                card.id === id ? { ...card, ...updates } : card
              ),
              lastUpdated: new Date().toISOString()
            };
          }
        });
      },
      
      deleteMetaphorCard: (id) => {
        set((state) => {
          // Check all decks and remove from the appropriate one
          if (state.archangelCards.some(card => card.id === id)) {
            return {
              archangelCards: state.archangelCards.filter(card => card.id !== id),
              lastUpdated: new Date().toISOString()
            };
          } else if (state.amuMomCards.some(card => card.id === id)) {
            return {
              amuMomCards: state.amuMomCards.filter(card => card.id !== id),
              lastUpdated: new Date().toISOString()
            };
          } else {
            return {
              metaphorCards: state.metaphorCards.filter(card => card.id !== id),
              lastUpdated: new Date().toISOString()
            };
          }
        });
      },
      
      addCivilization: (civilization) => {
        set((state) => ({
          civilizations: [...state.civilizations, civilization],
          lastUpdated: new Date().toISOString()
        }));
      },
      
      updateCivilization: (id, updates) => {
        set((state) => ({
          civilizations: state.civilizations.map(civilization => 
            civilization.id === id ? { ...civilization, ...updates } : civilization
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteCivilization: (id) => {
        set((state) => ({
          civilizations: state.civilizations.filter(civilization => civilization.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      addConstellation: (constellation) => {
        set((state) => ({
          constellations: [...state.constellations, constellation],
          lastUpdated: new Date().toISOString()
        }));
      },
      
      updateConstellation: (id, updates) => {
        set((state) => ({
          constellations: state.constellations.map(constellation => 
            constellation.id === id ? { ...constellation, ...updates } : constellation
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteConstellation: (id) => {
        set((state) => ({
          constellations: state.constellations.filter(constellation => constellation.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      // User functions
      getCourseById: (id) => {
        return get().courses.find(course => course.id === id);
      },
      
      getMeditationById: (id) => {
        return get().meditations.find(meditation => meditation.id === id);
      },
      
      getInstructorById: (id) => {
        return get().instructors.find(instructor => instructor.id === id);
      },
      
      getMetaphorCardById: (id, deck) => {
        if (deck === 'archangels') {
          return get().archangelCards.find(card => card.id === id);
        } else if (deck === 'amu-mom') {
          return get().amuMomCards.find(card => card.id === id);
        } else {
          return get().metaphorCards.find(card => card.id === id) || 
                 get().archangelCards.find(card => card.id === id) || 
                 get().amuMomCards.find(card => card.id === id);
        }
      },
      
      getCivilizationById: (id) => {
        return get().civilizations.find(civilization => civilization.id === id);
      },
      
      getConstellationById: (id) => {
        return get().constellations.find(constellation => constellation.id === id);
      },
      
      getCoursesByInstructor: (instructorId) => {
        return get().courses.filter(course => course.instructorId === instructorId);
      },
      
      getMeditationsByInstructor: (instructorId) => {
        return get().meditations.filter(meditation => meditation.instructorId === instructorId);
      },
      
      getCoursesByCategory: (categoryId) => {
        const category = get().categories.find(cat => cat.id === categoryId);
        if (!category) return [];
        return get().courses.filter(course => course.category === category.name);
      },
      
      getMeditationsByCategory: (categoryId) => {
        const category = get().categories.find(cat => cat.id === categoryId);
        if (!category) return [];
        return get().meditations.filter(meditation => meditation.category === category.name);
      },
      
      getCivilizationsByConstellation: (constellationId) => {
        const constellation = get().constellations.find(c => c.id === constellationId);
        if (!constellation) return [];
        return get().civilizations.filter(civ => civ.constellationId === constellationId);
      },
      
      // Sync functions for admin updates
      syncContent: (serverData) => {
        set((state) => ({
          ...state,
          ...serverData,
          lastUpdated: new Date().toISOString()
        }));
      },
      
      checkForUpdates: async () => {
        // In a real app, this would make an API call to check for content updates
        // For demo purposes, we'll just return true to simulate an update
        try {
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would compare lastUpdated with server timestamp
          // and only update if server data is newer
          return true;
        } catch (error) {
          console.error('Error checking for updates:', error);
          return false;
        }
      }
    }),
    {
      name: 'content-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist necessary data to avoid storage limits
      partialize: (state) => ({
        courses: state.courses,
        meditations: state.meditations,
        instructors: state.instructors,
        categories: state.categories,
        metaphorCards: state.metaphorCards,
        archangelCards: state.archangelCards,
        amuMomCards: state.amuMomCards,
        civilizations: state.civilizations,
        constellations: state.constellations,
        lastUpdated: state.lastUpdated
      }),
    }
  )
);