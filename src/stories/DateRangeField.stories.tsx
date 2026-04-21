import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeField } from '../DateRangeField'

const meta: Meta<typeof DateRangeField> = {
  title: 'Components/DateRangeField',
  component: DateRangeField,
  decorators: [
    Story => (
      <div style={{ maxWidth: 400, padding: 24 }}>
        <div className="flight-search">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof DateRangeField>

export const RoundTrip: Story = { args: { oneWay: false } }
export const OneWay: Story = { args: { oneWay: true } }
