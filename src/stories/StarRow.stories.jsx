import { StarRow } from '../App.jsx'

export default {
  title: 'Components/StarRow',
  component: StarRow,
  argTypes: {
    filled: { control: { type: 'range', min: 0, max: 10, step: 1 } },
    total: { control: { type: 'range', min: 1, max: 10, step: 1 } },
  },
}

export const FiveStars = { args: { filled: 5, total: 5 } }
export const FourStars = { args: { filled: 4, total: 5 } }
export const ThreeStars = { args: { filled: 3, total: 5 } }
export const TwoStars = { args: { filled: 2, total: 5 } }
export const OneStar = { args: { filled: 1, total: 5 } }
export const Empty = { args: { filled: 0, total: 5 } }

export const ThreeOutOfThree = { args: { filled: 3, total: 3 } }
export const SevenOutOfTen = { args: { filled: 7, total: 10 } }

export const SideBySide = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <StarRow filled={5} total={5} />
      <StarRow filled={4} total={5} />
      <StarRow filled={3} total={5} />
      <StarRow filled={2} total={5} />
      <StarRow filled={1} total={5} />
      <StarRow filled={0} total={5} />
    </div>
  ),
}
