import { PassengersField } from '../PassengersField.jsx'

export default {
  title: 'Components/PassengersField',
  component: PassengersField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300, padding: 24 }}>
        <div className="flight-search">
          <Story />
        </div>
      </div>
    ),
  ],
}

export const Default = {}
