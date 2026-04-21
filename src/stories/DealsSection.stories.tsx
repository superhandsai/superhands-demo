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
    <section className="band" style={{ maxWidth: 1312, margin: '0 auto' }}>
      <SectionTitle aside={<SeeAllLink />} headingId="deals-heading">
        Find your next adventure with these <span className="text-accent">flight deals</span>
      </SectionTitle>
      <div className="card-grid card-grid--deals">
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
