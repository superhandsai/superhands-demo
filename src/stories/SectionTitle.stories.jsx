import { SectionTitle, SeeAllLink } from '../App.jsx'

export default {
  title: 'Components/SectionTitle',
  component: SectionTitle,
}

export const Default = {
  args: {
    children: (
      <>
        Find your next adventure with these <span className="text-accent">flight deals</span>
      </>
    ),
    headingId: 'demo-heading',
  },
}

export const WithSeeAll = {
  args: {
    children: (
      <>
        Explore unique <span className="text-accent">places to stay</span>
      </>
    ),
    aside: <SeeAllLink />,
    headingId: 'demo-heading-2',
  },
}

export const PlainText = {
  args: {
    children: 'Popular destinations this month',
    headingId: 'demo-heading-3',
  },
}

export const LongTitle = {
  args: {
    children: (
      <>
        Discover the most popular weekend getaways near you with{' '}
        <span className="text-accent">exclusive member-only pricing</span>
      </>
    ),
    aside: <SeeAllLink />,
    headingId: 'demo-heading-4',
  },
}

export const NoAside = {
  args: {
    children: (
      <>
        What <span className="text-accent">Tripma</span> users are saying
      </>
    ),
    headingId: 'demo-heading-5',
  },
}
