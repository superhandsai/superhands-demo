import { DateRangeField } from '../DateRangeField.jsx'

export default {
  title: 'Components/DateRangeField',
  component: DateRangeField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 24 }}>
        <div className="flight-search">
          <Story />
        </div>
      </div>
    ),
  ],
}

export const RoundTrip = { args: { oneWay: false } }
export const OneWay = { args: { oneWay: true } }
