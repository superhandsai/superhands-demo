import { HeroSearchGroup } from '../App.jsx'

export default {
  title: 'Components/HeroSearchGroup',
  component: HeroSearchGroup,
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
