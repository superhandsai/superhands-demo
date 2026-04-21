import { SearchPills } from '../SearchPills.jsx'

export default {
  title: 'Components/SearchPills',
  component: SearchPills,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selectedTab: {
      control: 'select',
      options: ['flights', 'hotels', 'cars', null],
    },
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
}

export const FlightsSelected = {
  args: {
    selectedTab: 'flights',
  },
}

export const HotelsSelected = {
  args: {
    selectedTab: 'hotels',
  },
}

export const CarsSelected = {
  args: {
    selectedTab: 'cars',
  },
}

export const NoneSelected = {
  args: {
    selectedTab: null,
  },
}

export const Small = {
  args: {
    selectedTab: 'flights',
    size: 'sm',
  },
}

export const Large = {
  args: {
    selectedTab: 'flights',
    size: 'lg',
  },
}
