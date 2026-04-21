import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRightIcon } from '../App'

const meta: Meta<typeof ArrowRightIcon> = {
  title: 'Components/ArrowRightIcon',
  component: ArrowRightIcon,
  decorators: [
    Story => (
      <div style={{ width: 24, height: 24, color: '#605dec' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ArrowRightIcon>

export const Default: Story = {}
