import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteHeader } from '../App'

const meta: Meta<typeof SiteHeader> = {
  title: 'Components/SiteHeader',
  component: SiteHeader,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof SiteHeader>

export const Default: Story = {}

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
  },
}

export const TabletViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    chromatic: { viewports: [768] },
  },
}
