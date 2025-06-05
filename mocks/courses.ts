import { Course } from '@/types';

export const courses: Course[] = [
  {
    id: '1',
    title: 'Путь к звездам Плеяд',
    description: 'Курс глубокого погружения в космическую энергию созвездия Плеяд. Вы научитесь устанавливать связь с высшими энергиями и применять их для трансформации своей жизни.',
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1211&q=80',
    instructorId: '1',
    price: 2900,
    isFeatured: true,
    lessons: [
      {
        id: '1-1',
        title: 'Введение в энергию Плеяд',
        description: 'Знакомство с историей и энергетическим влиянием созвездия Плеяд на Землю и человечество.',
        duration: 45,
        audioUrl: 'path/to/audio1.mp3',
        order: 1
      },
      {
        id: '1-2',
        title: 'Первый контакт',
        description: 'Техники установления первичного энергетического контакта с Плеядами.',
        duration: 35,
        audioUrl: 'path/to/audio2.mp3',
        order: 2
      },
      {
        id: '1-3',
        title: 'Глубокое погружение',
        description: 'Медитативные практики для глубокого погружения в энергетическое поле Плеяд.',
        duration: 60,
        audioUrl: 'path/to/audio3.mp3',
        order: 3
      }
    ],
    category: 'Космическая энергия',
    tags: ['Плеяды', 'Космос', 'Энергия', 'Трансформация'],
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-05-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'Чакральная гармония',
    description: 'Курс по балансировке и активации чакр с использованием космической энергии Плеяд. Научитесь чувствовать и направлять энергию для исцеления и развития.',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    instructorId: '2',
    price: 3500,
    isFeatured: true,
    lessons: [
      {
        id: '2-1',
        title: 'Основы чакральной системы',
        description: 'Изучение семи основных чакр и их влияния на физическое и энергетическое тело.',
        duration: 40,
        audioUrl: 'path/to/audio4.mp3',
        order: 1
      },
      {
        id: '2-2',
        title: 'Муладхара и Свадхистана',
        description: 'Работа с корневой и сакральной чакрами для укрепления жизненной силы.',
        duration: 55,
        audioUrl: 'path/to/audio5.mp3',
        order: 2
      }
    ],
    category: 'Чакры',
    tags: ['Чакры', 'Энергия', 'Исцеление', 'Баланс'],
    rating: 4.9,
    reviewCount: 87,
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-05T11:45:00Z'
  },
  {
    id: '3',
    title: 'Астральные путешествия',
    description: 'Курс по технике астральных путешествий и выхода из тела. Научитесь безопасно исследовать тонкие миры и возвращаться обогащенными новым опытом.',
    coverImage: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    instructorId: '1',
    price: 4200,
    isFeatured: false,
    lessons: [
      {
        id: '3-1',
        title: 'Подготовка к астральному выходу',
        description: 'Техники расслабления и подготовки сознания к астральному путешествию.',
        duration: 50,
        audioUrl: 'path/to/audio6.mp3',
        order: 1
      },
      {
        id: '3-2',
        title: 'Первый выход',
        description: 'Пошаговая инструкция для первого безопасного астрального путешествия.',
        duration: 65,
        audioUrl: 'path/to/audio7.mp3',
        order: 2
      }
    ],
    category: 'Астральные практики',
    tags: ['Астрал', 'Путешествия', 'Выход из тела', 'Тонкие миры'],
    rating: 4.7,
    reviewCount: 56,
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-07-12T16:10:00Z'
  },
  {
    id: '4',
    title: 'Квантовая медитация',
    description: 'Инновационный курс, объединяющий современные научные знания о квантовой физике с древними медитативными практиками для расширения сознания.',
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    instructorId: '3',
    price: 0, // Free course
    isFeatured: true,
    lessons: [
      {
        id: '4-1',
        title: 'Квантовая теория и сознание',
        description: 'Введение в основы квантовой физики и ее связь с человеческим сознанием.',
        duration: 45,
        audioUrl: 'path/to/audio8.mp3',
        order: 1
      },
      {
        id: '4-2',
        title: 'Практика квантовой медитации',
        description: 'Техники медитации, основанные на принципах квантовой физики.',
        duration: 40,
        audioUrl: 'path/to/audio9.mp3',
        order: 2
      }
    ],
    category: 'Научная эзотерика',
    tags: ['Квантовая физика', 'Наука', 'Сознание', 'Медитация'],
    rating: 4.6,
    reviewCount: 42,
    createdAt: '2023-04-18T11:30:00Z',
    updatedAt: '2023-08-01T09:45:00Z'
  }
];