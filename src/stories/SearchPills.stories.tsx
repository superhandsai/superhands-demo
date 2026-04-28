import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchPills } from '../SearchPills'

const meta: Meta<typeof SearchPills> = {
  title: 'Components/SearchPills',
  component: SearchPills,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selectedTab: {
      control: 'select',
      options: ['flights', 'hotels', 'cars', undefined],
    },
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: 600, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof SearchPills>

export const FlightsSelected: Story = {
  args: { selectedTab: 'flights' },
}

export const HotelsSelected: Story = {
  args: { selectedTab: 'hotels' },
}

export const CarsSelected: Story = {
  args: { selectedTab: 'cars' },
}

export const NoneSelected: Story = {
  args: { selectedTab: undefined },
}

export const Small: Story = {
  args: { selectedTab: 'flights', size: 'sm' },
}

export const Large: Story = {
  args: { selectedTab: 'flights', size: 'lg' },
}
