import { tripma } from '../assets/tripma/urls'

export interface Destination {
  id: string
  city: string
  country: string
  airportCode: string
  image: string
  fromPriceGBP: number
  tagline: string
  description: string
  continent: 'Asia' | 'Europe' | 'Oceania' | 'Africa' | 'Americas'
}

export const DESTINATIONS: readonly Destination[] = [
  {
    id: 'shanghai',
    city: 'Shanghai',
    country: 'China',
    airportCode: 'PVG',
    image: tripma.dealShanghai,
    fromPriceGBP: 400,
    tagline: 'The Bund',
    description: "China's most international city, where colonial heritage meets a skyline that keeps rewriting itself.",
    continent: 'Asia',
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    airportCode: 'SYD',
    image: tripma.dealSydney,
    fromPriceGBP: 780,
    tagline: 'Sydney Opera House',
    description: 'Take a stroll along the famous harbour and catch a ferry to Manly Beach for the afternoon.',
    continent: 'Oceania',
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    airportCode: 'KIX',
    image: tripma.dealKyoto,
    fromPriceGBP: 620,
    tagline: 'Kōdaiji Temple',
    description: 'Step back in time in the Gion district and watch geiko slip between teahouses at dusk.',
    continent: 'Asia',
  },
  {
    id: 'cancun',
    city: 'Cancún',
    country: 'Mexico',
    airportCode: 'CUN',
    image: tripma.stayMaldives,
    fromPriceGBP: 520,
    tagline: 'Mayan Riviera',
    description: 'Turquoise water, cenotes, and ruins within an hour of the beach.',
    continent: 'Americas',
  },
  {
    id: 'marrakesh',
    city: 'Marrakesh',
    country: 'Morocco',
    airportCode: 'RAK',
    image: tripma.stayMorocco,
    fromPriceGBP: 210,
    tagline: 'Ourika Valley',
    description: "A short flight, a long way from home. Souks, riads, and the High Atlas on the horizon.",
    continent: 'Africa',
  },
  {
    id: 'ulaanbaatar',
    city: 'Ulaanbaatar',
    country: 'Mongolia',
    airportCode: 'UBN',
    image: tripma.stayMongolia,
    fromPriceGBP: 890,
    tagline: 'Steppe country',
    description: 'Stay in a traditional ger under a sky that goes on forever.',
    continent: 'Asia',
  },
  {
    id: 'lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    airportCode: 'LIS',
    image: tripma.dealShanghai,
    fromPriceGBP: 145,
    tagline: 'Tram 28',
    description: 'Pastéis de nata, fado, and seven hills of tiled facades.',
    continent: 'Europe',
  },
  {
    id: 'reykjavik',
    city: 'Reykjavík',
    country: 'Iceland',
    airportCode: 'KEF',
    image: tripma.stayMorocco,
    fromPriceGBP: 265,
    tagline: 'Northern lights',
    description: 'Glaciers, geothermal pools, and waterfalls in the land of fire and ice.',
    continent: 'Europe',
  },
  {
    id: 'rio',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    airportCode: 'GIG',
    image: tripma.dealSydney,
    fromPriceGBP: 710,
    tagline: 'Cidade Maravilhosa',
    description: 'Copacabana, Sugarloaf, and samba that spills into the street after dark.',
    continent: 'Americas',
  },
]
