import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SeatMap } from '../components/SeatMap'

const meta: Meta<typeof SeatMap> = {
  title: 'Components/SeatMap',
  component: SeatMap,
  decorators: [
    Story => (
      <div style={{ padding: 24, background: '#fafafa', maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SeatMap>

function Interactive() {
  const [sel, setSel] = useState<Record<string, string>>({})
  return (
    <SeatMap
      takenSeed={7}
      selectedByPassenger={sel}
      currentPassengerId="p1"
      onSelect={seat => setSel({ p1: seat })}
    />
  )
}

export const Interactive_: Story = {
  render: () => <Interactive />,
}

export const NoSelectionYet: Story = {
  args: {
    takenSeed: 12,
    selectedByPassenger: {},
    currentPassengerId: 'p1',
    onSelect: () => {},
  },
}
