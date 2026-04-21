import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeroSearchGroup } from '../App'
import { tripma } from '../assets/tripma/urls'

const meta: Meta = {
  title: 'Pages/Hero Section',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <section className="hero" aria-labelledby="hero-heading">
      <img className="hero__map" src={tripma.heroMap} alt="" />
      <div className="hero__content">
        <HeroSearchGroup />
      </div>
    </section>
  ),
}
