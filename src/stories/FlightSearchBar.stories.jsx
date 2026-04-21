import { FlightSearchBar, HeroSearchGroup } from '../App.jsx'

export default {
  title: 'Components/FlightSearchBar',
  component: FlightSearchBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1200, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
}

export const Default = {}

export const OnWhiteBackground = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1200, padding: 32, background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
}

export const OnAccentBackground = {
  decorators: [
    (Story) => (
      <div
        className="hero__search-block"
        style={{ maxWidth: 1200 }}
      >
        <Story />
      </div>
    ),
  ],
}

export const NarrowContainer = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}
