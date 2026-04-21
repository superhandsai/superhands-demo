import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldClearButton } from '../FieldClearButton'

const meta: Meta<typeof FieldClearButton> = {
  title: 'Components/FieldClearButton',
  component: FieldClearButton,
  decorators: [
    Story => (
      <div style={{ position: 'relative', width: 40, height: 40 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof FieldClearButton>

export const Default: Story = {
  args: {
    ariaLabel: 'Clear field',
    onClear: () => console.log('cleared'),
  },
}
