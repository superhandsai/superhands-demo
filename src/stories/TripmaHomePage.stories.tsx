import type { Meta, StoryObj } from '@storybook/react-vite'
import App from '../App'

const meta: Meta<typeof App> = {
  title: 'Pages/Tripma Home',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof App>

export const FullPage: Story = {}
