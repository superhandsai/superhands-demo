import type { Meta, StoryObj } from '@storybook/react-vite'
import { PassengersField } from '../PassengersField'

const meta: Meta<typeof PassengersField> = {
  title: 'Components/PassengersField',
  component: PassengersField,
  decorators: [
    Story => (
      <div style={{ maxWidth: 300, padding: 24 }}>
        <div className="flight-search">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof PassengersField>

export const Default: Story = {}
