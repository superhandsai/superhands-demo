import type { Meta, StoryObj } from '@storybook/react-vite'
import { SeeAllLink } from '../App'

const meta: Meta<typeof SeeAllLink> = {
  title: 'Components/SeeAllLink',
  component: SeeAllLink,
}

export default meta

type Story = StoryObj<typeof SeeAllLink>

export const Default: Story = {}
