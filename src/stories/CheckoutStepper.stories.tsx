import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckoutStepper } from '../components/CheckoutStepper'

const meta: Meta<typeof CheckoutStepper> = {
  title: 'Components/CheckoutStepper',
  component: CheckoutStepper,
  decorators: [
    Story => (
      <div style={{ maxWidth: 720, padding: 24, background: '#fafafa' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof CheckoutStepper>

export const Passengers: Story = { args: { current: 'passengers' } }
export const Seats: Story = { args: { current: 'seats' } }
export const Extras: Story = { args: { current: 'extras' } }
export const Payment: Story = { args: { current: 'payment' } }
