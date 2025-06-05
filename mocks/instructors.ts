import { Instructor } from '@/types';

export const instructors: Instructor[] = [
  {
    id: '1',
    name: 'Алексей Михайлов',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    bio: 'Практикующий медитацию более 20 лет. Специализируется на техниках глубокого погружения и связи с космическими энергиями.',
    specialties: ['Космическая медитация', 'Энергетические практики', 'Астральные путешествия'],
    courses: ['1', '3'],
    meditations: ['1', '2', '5']
  },
  {
    id: '2',
    name: 'Елена Соколова',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    bio: 'Мастер медитации и эзотерических практик. Изучала древние техники в Тибете и Индии. Помогает найти внутреннюю гармонию через связь с космосом.',
    specialties: ['Чакральная медитация', 'Плеядианские техники', 'Звуковая терапия'],
    courses: ['2'],
    meditations: ['3', '4']
  },
  {
    id: '3',
    name: 'Николай Звездин',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    bio: 'Астрофизик и духовный практик. Объединяет научные знания о космосе с древними медитативными техниками для достижения высших состояний сознания.',
    specialties: ['Квантовая медитация', 'Космическая энергия', 'Научная эзотерика'],
    courses: ['4'],
    meditations: ['6', '7']
  }
];