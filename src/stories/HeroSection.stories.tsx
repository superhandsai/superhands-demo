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
    <section
      className="relative z-[2] min-h-[480px] flex items-center justify-center px-6 py-12 overflow-visible lg:min-h-[520px] lg:py-14 max-md:p-2 max-md:pb-12 after:content-[''] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.12)_45%,rgba(255,255,255,0.35)_100%)] after:pointer-events-none"
      aria-labelledby="hero-heading"
    >
      <img
        className="absolute inset-0 z-0 w-full h-full object-cover object-center"
        src={tripma.heroMap}
        alt=""
      />
      <div className="relative z-[2] w-full max-w-[1440px] flex flex-col items-start max-md:mx-auto">
        <HeroSearchGroup />
      </div>
    </section>
  ),
}
