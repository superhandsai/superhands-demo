import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoardingPass } from '../components/BoardingPass'
import { generateFlights } from '../data/flights'
import type { Booking } from '../lib/bookingsStore'

const flight = generateFlights({ from: 'LHR', to: 'CDG', depart: '2026-05-10' })[0]

const booking: Booking = {
  pnr: 'TRP9X3',
  createdAt: new Date().toISOString(),
  status: 'confirmed',
  accountEmail: 'jane@example.com',
  flight,
  fareType: 'standard',
  passengers: [
    { id: 'p1', firstName: 'Jane', lastName: 'Smith', dob: '1990-03-14' },
  ],
  seats: [{ passengerId: 'p1', segmentId: `${flight.id}:out1`, seat: '14A' }],
  extras: { checkedBagsByPassenger: {}, mealsByPassenger: {}, insurance: false, priorityBoarding: false },
  totalGBP: 212,
  paymentLast4: '1234',
  contactEmail: 'jane@example.com',
  contactPhone: '+44 20 7946 0958',
}

const meta: Meta<typeof BoardingPass> = {
  title: 'Components/BoardingPass',
  component: BoardingPass,
  decorators: [
    Story => (
      <div style={{ padding: 24, background: '#f0edff', maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof BoardingPass>

export const Default: Story = {
  args: { booking, passenger: booking.passengers[0], seat: '14A' },
}

export const SeatAtCheckIn: Story = {
  args: { booking, passenger: booking.passengers[0], seat: 'TBD' },
}
