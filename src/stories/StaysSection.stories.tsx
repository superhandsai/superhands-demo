import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRightIcon, SectionTitle, SeeAllLink, StayCard } from '../App'
import { tripma } from '../assets/tripma/urls'

const meta: Meta = {
  title: 'Pages/Stays Section',
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <section
      className="pt-10 pb-10 flex flex-col gap-6 max-md:pt-4"
      style={{ maxWidth: 1312, margin: '0 auto' }}
    >
      <SectionTitle aside={<SeeAllLink />} headingId="stays-heading">
        Explore unique <span className="text-purple">places to stay</span>
      </SectionTitle>
      <div className="grid gap-10 w-full grid-cols-3 cursor-pointer max-lg:grid-cols-2 max-md:grid-cols-1">
        <StayCard
          image={tripma.stayMaldives}
          title={
            <>
              Stay among the atolls in <span className="text-purple">Maldives</span>
            </>
          }
          description="From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages."
        />
        <StayCard
          image={tripma.stayMorocco}
          title={
            <>
              Experience the Ourika Valley in <span className="text-purple">Morocco</span>
            </>
          }
          description="Morocco's Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East."
        />
        <StayCard
          image={tripma.stayMongolia}
          title={
            <>
              Live traditionally in <span className="text-purple">Mongolia</span>
            </>
          }
          description="Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel."
          imageClass="deal-card__image--mongolia"
        />
      </div>
      <div className="flex justify-center pt-6">
        <a
          className="inline-flex items-center justify-center min-h-12 px-5 py-6 font-sans text-[18px] font-normal border-2 border-purple rounded-[16px] cursor-pointer no-underline bg-transparent text-purple gap-[10px] transition-[background,color,border-color] duration-200 hover:bg-[color-mix(in_srgb,var(--color-purple)_12%,transparent)] hover:no-underline focus-visible:outline-[3px] focus-visible:outline-[color-mix(in_srgb,var(--color-purple)_35%,transparent)] focus-visible:outline-offset-2"
          href="#"
        >
          <span className="font-semibold">Explore more stays</span>
          <span className="flex w-6 h-6 flex-shrink-0 items-center justify-center" aria-hidden>
            <ArrowRightIcon className="block flex-shrink-0" />
          </span>
        </a>
      </div>
    </section>
  ),
}
