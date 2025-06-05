import { Constellation } from '@/types';

export const constellations: Constellation[] = [
  {
    id: 'pleiades',
    name: 'Плеяды',
    latinName: 'Pleiades (M45)',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Плеяды — рассеянное звёздное скопление в созвездии Тельца. Одно из ближайших к Земле и наиболее заметных для невооружённого глаза звёздных скоплений. В ясную ночь можно увидеть невооружённым глазом до 10-12 звёзд этого скопления.',
    civilizations: ['pleiadians'],
    stars: ['Альциона', 'Электра', 'Майя', 'Меропа', 'Тайгета', 'Целено', 'Астеропа'],
    coordinates: {
      ra: '03h 47m',
      dec: '+24° 07′'
    }
  },
  {
    id: 'lyra',
    name: 'Лира',
    latinName: 'Lyra',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1211&q=80',
    description: 'Лира — небольшое созвездие северного полушария неба. Содержит одну из ярчайших звёзд неба — Вегу. В созвездии Лиры находится знаменитая планетарная туманность «Кольцо» (M57).',
    civilizations: ['lyrans'],
    stars: ['Вега', 'Шелиак', 'Сулафат', 'Альхена'],
    coordinates: {
      ra: '18h 30m',
      dec: '+40° 00′'
    }
  },
  {
    id: 'orion',
    name: 'Орион',
    latinName: 'Orion',
    image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
    description: 'Орион — одно из наиболее заметных и узнаваемых созвездий на ночном небе. Расположено на небесном экваторе. Содержит яркие звёзды Бетельгейзе и Ригель, а также знаменитую туманность Ориона.',
    civilizations: ['orions'],
    stars: ['Бетельгейзе', 'Ригель', 'Беллатрикс', 'Саиф', 'Альнитак', 'Альнилам', 'Минтака'],
    coordinates: {
      ra: '05h 30m',
      dec: '+00° 00′'
    }
  },
  {
    id: 'sirius',
    name: 'Сириус',
    latinName: 'Sirius (Alpha Canis Majoris)',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1213&q=80',
    description: 'Сириус — ярчайшая звезда ночного неба, расположенная в созвездии Большого Пса. Это двойная звезда, состоящая из яркой звезды главной последовательности Сириус A и её тусклого белого карлика-компаньона Сириус B.',
    civilizations: ['sirians'],
    stars: ['Сириус A', 'Сириус B'],
    coordinates: {
      ra: '06h 45m',
      dec: '-16° 43′'
    }
  },
  {
    id: 'arcturus',
    name: 'Арктур',
    latinName: 'Arcturus (Alpha Boötis)',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    description: 'Арктур — ярчайшая звезда в созвездии Волопаса и четвёртая по яркости звезда ночного неба. Это оранжевый гигант, находящийся на расстоянии около 37 световых лет от Солнца.',
    civilizations: ['arcturians'],
    stars: ['Арктур'],
    coordinates: {
      ra: '14h 15m',
      dec: '+19° 11′'
    }
  },
  {
    id: 'andromeda',
    name: 'Андромеда',
    latinName: 'Andromeda',
    image: 'https://images.unsplash.com/photo-1506703719100-a0b3a3c7be4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Андромеда — созвездие северного полушария неба. В этом созвездии находится ближайшая к нам крупная галактика — Галактика Андромеды (M31), которая видна невооружённым глазом как туманное пятнышко.',
    civilizations: ['andromedans'],
    stars: ['Альферац', 'Мирах', 'Аламак', 'Адхил'],
    coordinates: {
      ra: '01h 00m',
      dec: '+40° 00′'
    }
  },
  {
    id: 'vega',
    name: 'Вега',
    latinName: 'Vega (Alpha Lyrae)',
    image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1178&q=80',
    description: 'Вега — ярчайшая звезда в созвездии Лиры и пятая по яркости звезда ночного неба. Это бело-голубая звезда главной последовательности, находящаяся на расстоянии около 25 световых лет от Солнца.',
    civilizations: ['vegans'],
    stars: ['Вега'],
    coordinates: {
      ra: '18h 36m',
      dec: '+38° 47′'
    }
  },
  {
    id: 'centauri',
    name: 'Альфа Центавра',
    latinName: 'Alpha Centauri',
    image: 'https://images.unsplash.com/photo-1475066392170-59d55d96fe51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    description: 'Альфа Центавра — ближайшая к Солнечной системе звёздная система, находящаяся на расстоянии около 4,37 световых лет. Это тройная звёздная система, состоящая из двух звёзд, похожих на Солнце (Альфа Центавра A и B), и красного карлика Проксима Центавра.',
    civilizations: ['centaurians'],
    stars: ['Альфа Центавра A', 'Альфа Центавра B', 'Проксима Центавра'],
    coordinates: {
      ra: '14h 39m',
      dec: '-60° 50′'
    }
  }
];