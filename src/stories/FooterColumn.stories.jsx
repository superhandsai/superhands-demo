import { FooterColumn } from '../App.jsx'

export default {
  title: 'Components/FooterColumn',
  component: FooterColumn,
  argTypes: {
    title: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
}

export const About = {
  args: {
    title: 'About',
    links: ['About Tripma', 'How it works', 'Careers', 'Press', 'Blog', 'Forum'],
  },
}

export const PartnerWithUs = {
  args: {
    title: 'Partner with us',
    links: [
      'Partnership programs',
      'Affiliate program',
      'Connectivity partners',
      'Promotions and events',
      'Integrations',
      'Community',
      'Loyalty program',
    ],
  },
}

export const Support = {
  args: {
    title: 'Support',
    links: ['Help Center', 'Contact us', 'Privacy policy', 'Terms of service', 'Trust and safety', 'Accessibility'],
  },
}

export const GetTheApp = {
  args: {
    title: 'Get the app',
    links: ['Tripma for Android', 'Tripma for iOS', 'Mobile site'],
  },
}

export const SingleLink = {
  args: {
    title: 'Legal',
    links: ['Terms & Conditions'],
  },
}

export const ManyLinks = {
  args: {
    title: 'All destinations',
    links: [
      'London',
      'New York',
      'Tokyo',
      'Paris',
      'Sydney',
      'Dubai',
      'Singapore',
      'Barcelona',
      'Rome',
      'Berlin',
      'Seoul',
      'Bangkok',
    ],
  },
}
