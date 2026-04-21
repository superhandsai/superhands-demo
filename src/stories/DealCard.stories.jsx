import { DealCard } from '../App.jsx'
import { tripma } from '../assets/tripma/urls.js'

export default {
  title: 'Components/DealCard',
  component: DealCard,
  argTypes: {
    title: { control: 'text' },
    highlight: { control: 'text' },
    price: { control: 'text' },
    description: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
}

export const Shanghai = {
  args: {
    image: tripma.dealShanghai,
    title: 'The Bund,',
    highlight: ' Shanghai',
    price: '£400',
    description: "China's most international city",
  },
}

export const Sydney = {
  args: {
    image: tripma.dealSydney,
    title: 'Sydney Opera House,',
    highlight: ' Sydney',
    price: '£780',
    description: 'Take a stroll along the famous harbor',
  },
}

export const Kyoto = {
  args: {
    image: tripma.dealKyoto,
    title: 'Kōdaiji Temple,',
    highlight: ' Kyoto',
    price: '£620',
    description: 'Step back in time in the Gion district',
  },
}

export const HighPrice = {
  args: {
    image: tripma.dealSydney,
    title: 'First Class to',
    highlight: ' Tokyo',
    price: '£4,250',
    description: 'Premium cabin with lie-flat seats and lounge access',
  },
}

export const LowPrice = {
  args: {
    image: tripma.dealShanghai,
    title: 'Budget hop to',
    highlight: ' Dublin',
    price: '£29',
    description: 'One-way fare, carry-on only',
  },
}

export const LongDescription = {
  args: {
    image: tripma.dealKyoto,
    title: 'Ancient temples of',
    highlight: ' Angkor Wat',
    price: '£890',
    description:
      'Explore the sprawling temple complex dating back to the 12th century, surrounded by lush jungle and intricate stone carvings that tell stories of an ancient Khmer civilization at the height of its power.',
  },
}

export const NoHighlight = {
  args: {
    image: tripma.dealShanghai,
    title: 'Weekend getaway deal',
    highlight: '',
    price: '£150',
    description: 'Grab a last-minute weekend escape',
  },
}

export const DollarCurrency = {
  args: {
    image: tripma.dealSydney,
    title: 'Golden Gate Bridge,',
    highlight: ' San Francisco',
    price: '$320',
    description: 'Walk across the iconic landmark',
  },
}

export const EuroCurrency = {
  args: {
    image: tripma.dealKyoto,
    title: 'Eiffel Tower,',
    highlight: ' Paris',
    price: '€275',
    description: 'The city of lights awaits',
  },
}

export const GridOfThree = {
  decorators: [
    (Story) => (
      <div className="card-grid card-grid--deals" style={{ maxWidth: 1312 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <DealCard
        image={tripma.dealShanghai}
        title="The Bund,"
        highlight=" Shanghai"
        price="£400"
        description="China's most international city"
      />
      <DealCard
        image={tripma.dealSydney}
        title="Sydney Opera House,"
        highlight=" Sydney"
        price="£780"
        description="Take a stroll along the famous harbor"
      />
      <DealCard
        image={tripma.dealKyoto}
        title="Kōdaiji Temple,"
        highlight=" Kyoto"
        price="£620"
        description="Step back in time in the Gion district"
      />
    </>
  ),
}
