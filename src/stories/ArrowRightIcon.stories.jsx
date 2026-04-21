import { ArrowRightIcon } from '../App.jsx'

export default {
  title: 'Components/ArrowRightIcon',
  component: ArrowRightIcon,
  decorators: [
    (Story) => (
      <div style={{ width: 24, height: 24, color: '#605dec' }}>
        <Story />
      </div>
    ),
  ],
}

export const Default = {}
