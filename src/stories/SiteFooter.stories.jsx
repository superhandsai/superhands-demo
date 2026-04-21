import { SiteFooter } from '../App.jsx'

export default {
  title: 'Components/SiteFooter',
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Default = {}

export const NarrowViewport = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
  },
}

export const TabletViewport = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    chromatic: { viewports: [768] },
  },
}
