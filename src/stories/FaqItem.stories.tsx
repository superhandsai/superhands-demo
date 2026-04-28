import type { Meta, StoryObj } from '@storybook/react-vite'
import { FaqItem } from '../components/FaqItem'

const meta: Meta<typeof FaqItem> = {
  title: 'Components/FaqItem',
  component: FaqItem,
  decorators: [
    Story => (
      <div style={{ maxWidth: 640, padding: 24, background: '#fafafa' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FaqItem>

export const Default: Story = {
  args: {
    question: 'How do I change my flight dates?',
    answer:
      'Open My Trips, pick your booking, and tap "Change flight". Most fares allow a change with a fee and fare difference.',
  },
}

export const WithMeta: Story = {
  args: {
    question: 'What is the carry-on allowance?',
    answer: 'Most economy fares include one small bag that fits under the seat.',
    meta: 'Baggage',
  },
}
