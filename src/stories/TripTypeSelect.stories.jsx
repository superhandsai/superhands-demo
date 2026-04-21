import { useState } from 'react'
import { TripTypeSelect } from '../App.jsx'

export default {
  title: 'Components/TripTypeSelect',
  component: TripTypeSelect,
}

function TripTypeSelectWrapper(args) {
  const [value, setValue] = useState(args.value || 'return')
  return <TripTypeSelect value={value} onChange={setValue} />
}

export const Default = {
  render: (args) => <TripTypeSelectWrapper {...args} />,
  args: { value: 'return' },
}

export const OneWay = {
  render: (args) => <TripTypeSelectWrapper {...args} />,
  args: { value: 'one-way' },
}

export const MultiCity = {
  render: (args) => <TripTypeSelectWrapper {...args} />,
  args: { value: 'multi-city' },
}
