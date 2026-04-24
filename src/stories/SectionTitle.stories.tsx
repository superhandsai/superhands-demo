import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionTitle, SeeAllLink } from '../App'

const meta: Meta<typeof SectionTitle> = {
  title: 'Components/SectionTitle',
  component: SectionTitle,
}

export default meta

type Story = StoryObj<typeof SectionTitle>

export const Default: Story = {
  args: {
    children: (
      <>
        Find your next adventure with these <span className="text-purple">flight deals</span>
      </>
    ),
    headingId: 'demo-heading',
  },
}

export const WithSeeAll: Story = {
  args: {
    children: (
      <>
        Explore unique <span className="text-purple">places to stay</span>
      </>
    ),
    aside: <SeeAllLink />,
    headingId: 'demo-heading-2',
  },
}

export const PlainText: Story = {
  args: {
    children: 'Popular destinations this month',
    headingId: 'demo-heading-3',
  },
}

export const LongTitle: Story = {
  args: {
    children: (
      <>
        Discover the most popular weekend getaways near you with{' '}
        <span className="text-purple">exclusive member-only pricing</span>
      </>
    ),
    aside: <SeeAllLink />,
    headingId: 'demo-heading-4',
  },
}

export const NoAside: Story = {
  args: {
    children: (
      <>
        What <span className="text-purple">Tripma</span> users are saying
      </>
    ),
    headingId: 'demo-heading-5',
  },
}
