export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  purchasedCourses: string[];
  purchasedMeditations: string[];
  favorites: string[];
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  courses: string[];
  meditations: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  instructorId: string;
  price: number; // 0 for free
  isFeatured: boolean;
  lessons: Lesson[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  audioUrl: string;
  order: number;
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  instructorId: string;
  duration: number; // in minutes
  audioUrl: string;
  price: number; // 0 for free
  isFeatured: boolean;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Base interface for alien civilizations
export interface AlienCivilization {
  id: string;
  name: string;
  constellation: string;
  description: string;
  image: string;
  traits: string[];
  history: string;
}

// Extended interface for the app's civilization data model
export interface Civilization {
  id: string;
  name: string;
  constellationId: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  traits: string[];
  history: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deity {
  id: string;
  name: string;
  culture: string;
  type: 'god' | 'saint' | 'deity';
  description: string;
  image: string;
  domains: string[];
  stories: string[];
}

export interface RunicStave {
  id: string;
  name: string;
  image: string;
  description: string;
  purpose: string;
  creator: string;
  createdAt: string;
}

export interface Constellation {
  id: string;
  name: string;
  latinName: string;
  image: string;
  description: string;
  civilizations: string[]; // IDs of civilizations
  stars: string[];
  coordinates: {
    ra: string; // Right Ascension
    dec: string; // Declination
  };
}

export interface CosmicScheme {
  id: string;
  title: string;
  image: string;
  description: string;
  category: 'chakras' | 'energies' | 'logos' | 'universe' | 'other';
  createdAt: string;
  createdBy: string;
}

export interface NumerologyNumber {
  number: number;
  name: string;
  description: string;
  traits: string[];
  influence: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'oils' | 'incense' | 'crystals' | 'books' | 'other';
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface MetaphorCard {
  id: string;
  name: string;
  image: string;
  description: string;
  meaning: {
    upright: string;
    reversed?: string;
  };
  keywords: string[];
  category: string;
  deck: 'cosmic' | 'archangels' | 'amu-mom'; // Added deck property
}

export interface CardDeck {
  id: string;
  name: string;
  description: string;
  author: string;
  authorImage: string;
  coverImage: string;
  cardCount: number;
  type: 'cosmic' | 'archangels' | 'amu-mom';
}