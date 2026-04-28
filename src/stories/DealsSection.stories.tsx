import type { Meta, StoryObj } from '@storybook/react-vite'
import { DealCard, SectionTitle, SeeAllLink } from '../App'
import { tripma } from '../assets/tripma/urls'

const meta: Meta = {
  title: 'Pages/Deals Section',
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <section
      className="pt-10 pb-10 flex flex-col gap-6 max-md:pt-0"
      style={{ maxWidth: 1312, margin: '0 auto' }}
    >
      <SectionTitle aside={<SeeAllLink />} headingId="deals-heading">
        Find your next adventure with these <span className="text-purple">flight deals</span>
      </SectionTitle>
      <div className="grid gap-10 w-full grid-cols-3 cursor-pointer max-lg:grid-cols-2 max-md:grid-cols-1">
        <DealCard
          image={tripma.dealShanghai}
          title="The Bund,"
          highlight=" Shanghai"
          price="£400"
          description="China's most international city"
        />
        <DealCard
          image={tripma.dealSydney}
          title="Sydney Opera House,"
          highlight=" Sydney"
          price="£780"
          description="Take a stroll along the famous harbor"
        />
        <DealCard
          image={tripma.dealKyoto}
          title="Kōdaiji Temple,"
          highlight=" Kyoto"
          price="£620"
          description="Step back in time in the Gion district"
        />
      </div>
    </section>
  ),
}
