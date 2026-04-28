import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeroSearchGroup } from '../App'

const meta: Meta<typeof HeroSearchGroup> = {
  title: 'Components/HeroSearchGroup',
  component: HeroSearchGroup,
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

type Story = StoryObj<typeof HeroSearchGroup>

export const Default: Story = {}
