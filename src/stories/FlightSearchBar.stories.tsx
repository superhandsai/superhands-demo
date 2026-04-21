import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlightSearchBar } from '../App'

const meta: Meta<typeof FlightSearchBar> = {
  title: 'Components/FlightSearchBar',
  component: FlightSearchBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: 1200, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof FlightSearchBar>

export const Default: Story = {}

export const OnWhiteBackground: Story = {
  decorators: [
    Story => (
      <div style={{ maxWidth: 1200, padding: 32, background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
}

export const OnAccentBackground: Story = {
  decorators: [
    Story => (
      <div className="hero__search-block" style={{ maxWidth: 1200 }}>
        <Story />
      </div>
    ),
  ],
}

export const NarrowContainer: Story = {
  decorators: [
    Story => (
      <div style={{ maxWidth: 480, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}
