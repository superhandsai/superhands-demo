import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteFooter } from '../App'

const meta: Meta<typeof SiteFooter> = {
  title: 'Components/SiteFooter',
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof SiteFooter>

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
