import type { Meta, StoryObj } from '@storybook/react-vite'
import { StayCard } from '../App'
import { tripma } from '../assets/tripma/urls'

const meta: Meta<typeof StayCard> = {
  title: 'Components/StayCard',
  component: StayCard,
  argTypes: {
    description: { control: 'text' },
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof StayCard>

export const Maldives: Story = {
  args: {
    image: tripma.stayMaldives,
    title: (
      <>
        Stay among the atolls in <span className="text-purple">Maldives</span>
      </>
    ),
    description:
      "From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages.",
  },
}

export const Morocco: Story = {
  args: {
    image: tripma.stayMorocco,
    title: (
      <>
        Experience the Ourika Valley in <span className="text-purple">Morocco</span>
      </>
    ),
    description:
      "Morocco's Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East.",
  },
}

export const Mongolia: Story = {
  args: {
    image: tripma.stayMongolia,
    title: (
      <>
        Live traditionally in <span className="text-purple">Mongolia</span>
      </>
    ),
    description:
      'Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel.',
    imageClass: 'deal-card__image--mongolia',
  },
}

export const ShortDescription: Story = {
  args: {
    image: tripma.stayMaldives,
    title: (
      <>
        Relax in <span className="text-purple">Bali</span>
      </>
    ),
    description: 'Tropical paradise awaits.',
  },
}

export const LongDescription: Story = {
  args: {
    image: tripma.stayMorocco,
    title: (
      <>
        Discover the history of <span className="text-purple">Rome</span>
      </>
    ),
    description:
      'Walk through millennia of history from the Colosseum to the Vatican, explore cobblestone streets lined with trattorias, and discover ancient ruins hidden around every corner of the Eternal City. Rome rewards the curious traveller with layers of art, architecture, and culture spanning over two thousand years.',
  },
}

export const PlainTitle: Story = {
  args: {
    image: tripma.stayMaldives,
    title: 'A cozy cabin in the Swiss Alps',
    description: 'Nestled in the mountains with breathtaking views of snow-capped peaks.',
  },
}

export const GridOfThree: Story = {
  decorators: [
    Story => (
      <div
        className="grid gap-10 w-full grid-cols-3 cursor-pointer max-lg:grid-cols-2 max-md:grid-cols-1"
        style={{ maxWidth: 1312 }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <StayCard
        image={tripma.stayMaldives}
        title={
          <>
            Stay among the atolls in <span className="text-purple">Maldives</span>
          </>
        }
        description="From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells."
      />
      <StayCard
        image={tripma.stayMorocco}
        title={
          <>
            Experience the Ourika Valley in <span className="text-purple">Morocco</span>
          </>
        }
        description="Morocco's Hispano-Moorish architecture blends influences from Berber culture and Spain."
      />
      <StayCard
        image={tripma.stayMongolia}
        title={
          <>
            Live traditionally in <span className="text-purple">Mongolia</span>
          </>
        }
        description="Traditional Mongolian yurts consists of an angled latticework of wood or bamboo."
        imageClass="deal-card__image--mongolia"
      />
    </>
  ),
}
