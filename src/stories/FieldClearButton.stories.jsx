import { FieldClearButton } from '../FieldClearButton.jsx'

export default {
  title: 'Components/FieldClearButton',
  component: FieldClearButton,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 40, height: 40 }}>
        <Story />
      </div>
    ),
  ],
}

export const Default = {
  args: {
    ariaLabel: 'Clear field',
    onClear: () => console.log('cleared'),
  },
}
