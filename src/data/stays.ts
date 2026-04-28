import { tripma } from '../assets/tripma/urls'

export interface Stay {
  id: string
  name: string
  location: string
  country: string
  image: string
  nightlyGBP: number
  rating: number
  reviewCount: number
  type: 'Hotel' | 'Villa' | 'Apartment' | 'Retreat' | 'Cabin'
  amenities: string[]
  description: string
}

export const STAYS: readonly Stay[] = [
  {
    id: 'maldives-atoll',
    name: 'Raa Atoll Overwater Suites',
    location: 'Raa Atoll',
    country: 'Maldives',
    image: tripma.stayMaldives,
    nightlyGBP: 420,
    rating: 4.9,
    reviewCount: 842,
    type: 'Retreat',
    amenities: ['Private pool', 'Snorkel house reef', 'All-inclusive', 'Sea-plane transfer'],
    description:
      "From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages.",
  },
  {
    id: 'ourika-riad',
    name: 'Riad de la Vallée',
    location: 'Ourika Valley',
    country: 'Morocco',
    image: tripma.stayMorocco,
    nightlyGBP: 135,
    rating: 4.7,
    reviewCount: 312,
    type: 'Villa',
    amenities: ['Rooftop terrace', 'Hammam', 'Breakfast included', 'Mountain views'],
    description:
      "Morocco's Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East.",
  },
  {
    id: 'mongolia-ger',
    name: 'Three Camel Lodge',
    location: 'Gobi Desert',
    country: 'Mongolia',
    image: tripma.stayMongolia,
    nightlyGBP: 310,
    rating: 4.8,
    reviewCount: 128,
    type: 'Cabin',
    amenities: ['Guided excursions', 'Wood stove', 'Full board', 'Stargazing'],
    description:
      'Traditional Mongolian yurts consist of an angled latticework of wood or bamboo for walls, ribs, and a wheel.',
  },
  {
    id: 'kyoto-townhouse',
    name: 'Machiya Townhouse — Gion',
    location: 'Gion',
    country: 'Japan',
    image: tripma.dealKyoto,
    nightlyGBP: 280,
    rating: 4.9,
    reviewCount: 201,
    type: 'Apartment',
    amenities: ['Ofuro bath', 'Private garden', 'Tatami room', 'Walking to Kiyomizu-dera'],
    description:
      'A restored 100-year-old townhouse in the heart of the historic Gion district. Sliding shoji panels, warm wood, and a tiny zen garden.',
  },
  {
    id: 'sydney-harbour',
    name: 'The Harbour Rocks',
    location: 'The Rocks',
    country: 'Australia',
    image: tripma.dealSydney,
    nightlyGBP: 225,
    rating: 4.6,
    reviewCount: 1890,
    type: 'Hotel',
    amenities: ['Harbour view', 'Rooftop bar', 'Gym', 'Pet-friendly'],
    description:
      'Boutique heritage hotel a short walk from the Opera House, the Botanic Gardens, and the ferry to Manly.',
  },
  {
    id: 'shanghai-bund',
    name: 'Waitan Riverside Hotel',
    location: 'The Bund',
    country: 'China',
    image: tripma.dealShanghai,
    nightlyGBP: 190,
    rating: 4.5,
    reviewCount: 2450,
    type: 'Hotel',
    amenities: ['Pudong view', 'Pool', 'Spa', 'Concierge'],
    description:
      'Modern tower with panoramic views across the Huangpu to the Pudong skyline.',
  },
]
