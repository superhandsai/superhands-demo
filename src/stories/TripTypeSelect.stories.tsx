import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TripTypeSelect } from '../App'

type TripType = 'return' | 'one-way' | 'multi-city'
type WrapperArgs = { value: TripType }

const meta: Meta<typeof TripTypeSelect> = {
  title: 'Components/TripTypeSelect',
  component: TripTypeSelect,
}

export default meta

type Story = StoryObj<WrapperArgs>

function TripTypeSelectWrapper({ value: initialValue }: WrapperArgs) {
  const [value, setValue] = useState<TripType>(initialValue || 'return')
  return <TripTypeSelect value={value} onChange={setValue} />
}

export const Default: Story = {
  render: args => <TripTypeSelectWrapper {...args} />,
  args: { value: 'return' },
}

export const OneWay: Story = {
  render: args => <TripTypeSelectWrapper {...args} />,
  args: { value: 'one-way' },
}

export const MultiCity: Story = {
  render: args => <TripTypeSelectWrapper {...args} />,
  args: { value: 'multi-city' },
}
