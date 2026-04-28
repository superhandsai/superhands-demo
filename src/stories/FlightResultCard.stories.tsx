import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlightResultCard } from '../components/FlightResultCard'
import { generateFlights } from '../data/flights'

const meta: Meta<typeof FlightResultCard> = {
  title: 'Components/FlightResultCard',
  component: FlightResultCard,
  decorators: [
    Story => (
      <div style={{ maxWidth: 920, padding: 24, background: '#fafafa' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FlightResultCard>

const sample = generateFlights({ from: 'LHR', to: 'JFK', depart: '2026-07-01', return: '2026-07-10' })

export const Direct: Story = {
  args: {
    flight: sample.find(f => f.stops === 0) ?? sample[0],
    onSelect: () => {},
  },
}

export const OneStop: Story = {
  args: {
    flight: sample.find(f => f.stops === 1) ?? sample[0],
    onSelect: () => {},
  },
}

export const TwoStops: Story = {
  args: {
    flight: sample.find(f => f.stops === 2) ?? sample[0],
    onSelect: () => {},
  },
}

export const LowSeatsAvailable: Story = {
  args: {
    flight: { ...sample[0], seatsRemaining: 2 },
    onSelect: () => {},
  },
}
