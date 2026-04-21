import type { Meta, StoryObj } from '@storybook/react-vite'
import { StarRow } from '../App'

const meta: Meta<typeof StarRow> = {
  title: 'Components/StarRow',
  component: StarRow,
  argTypes: {
    filled: { control: { type: 'range', min: 0, max: 10, step: 1 } },
    total: { control: { type: 'range', min: 1, max: 10, step: 1 } },
  },
}

export default meta

type Story = StoryObj<typeof StarRow>

export const FiveStars: Story = { args: { filled: 5, total: 5 } }
export const FourStars: Story = { args: { filled: 4, total: 5 } }
export const ThreeStars: Story = { args: { filled: 3, total: 5 } }
export const TwoStars: Story = { args: { filled: 2, total: 5 } }
export const OneStar: Story = { args: { filled: 1, total: 5 } }
export const Empty: Story = { args: { filled: 0, total: 5 } }

export const ThreeOutOfThree: Story = { args: { filled: 3, total: 3 } }
export const SevenOutOfTen: Story = { args: { filled: 7, total: 10 } }

export const SideBySide: Story = {
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
