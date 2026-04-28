import type { Meta, StoryObj } from '@storybook/react-vite'
import { Testimonial } from '../App'
import { tripma } from '../assets/tripma/urls'

const meta: Meta<typeof Testimonial> = {
  title: 'Components/Testimonial',
  component: Testimonial,
  argTypes: {
    name: { control: 'text' },
    stars: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    children: { control: 'text' },
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Testimonial>

export const FiveStar: Story = {
  args: {
    avatar: tripma.avatar1,
    name: 'Yifei Chen',
    stars: 5,
    meta: (
      <>
        Seoul, South Korea <span className="text-grey-300">|</span> April 2026
      </>
    ),
    children:
      'What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues.',
  },
}

export const FourStar: Story = {
  args: {
    avatar: tripma.avatar2,
    name: 'Kaori Yamaguchi',
    stars: 4,
    meta: (
      <>
        Honolulu, Hawaii <span className="text-grey-300">|</span> February 2026
      </>
    ),
    children:
      'My family and I visit Hawaii every year, and we usually book our flights using other services. Tripma was recommended to us by a long time friend.',
  },
}

export const ThreeStar: Story = {
  args: {
    avatar: tripma.avatar3,
    name: 'Sam Martinez',
    stars: 3,
    meta: (
      <>
        Mexico City, Mexico <span className="text-grey-300">|</span> March 2026
      </>
    ),
    children:
      'The booking process was straightforward, but I had some trouble finding specific seat options. Customer support was helpful when I reached out.',
  },
}

export const OneStar: Story = {
  args: {
    avatar: tripma.avatar1,
    name: 'Alex Thompson',
    stars: 1,
    meta: (
      <>
        London, UK <span className="text-grey-300">|</span> January 2026
      </>
    ),
    children:
      'My flight was cancelled and the rebooking process took longer than expected. Hoping for a smoother experience next time.',
  },
}

export const ShortReview: Story = {
  args: {
    avatar: tripma.avatar2,
    name: 'Li Wei',
    stars: 5,
    meta: (
      <>
        Beijing, China <span className="text-grey-300">|</span> April 2026
      </>
    ),
    children: 'Excellent! Will use again.',
  },
}

export const LongReview: Story = {
  args: {
    avatar: tripma.avatar3,
    name: 'Priya Sharma',
    stars: 5,
    meta: (
      <>
        Mumbai, India <span className="text-grey-300">|</span> February 2026
      </>
    ),
    children:
      'I cannot recommend Tripma enough! From the moment I started searching for flights to my honeymoon destination, the experience was seamless. The interface made it incredibly easy to compare prices across different airlines and dates. When I needed to make a last-minute change to my itinerary, their customer service team was responsive and resolved everything within minutes. The price alerts feature saved us over £200 on our return flights. This has completely changed how I book travel.',
  },
}

export const GridOfThree: Story = {
  decorators: [
    Story => (
      <div
        className="grid grid-cols-3 gap-10 items-start max-lg:grid-cols-1 max-lg:gap-8"
        style={{ maxWidth: 1312 }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <Testimonial
        avatar={tripma.avatar1}
        name="Yifei Chen"
        stars={5}
        meta={
          <>
            Seoul, South Korea <span className="text-grey-300">|</span> April 2026
          </>
        }
      >
        What a great experience using Tripma! I booked all of my flights for my gap year.
      </Testimonial>
      <Testimonial
        avatar={tripma.avatar2}
        name="Kaori Yamaguchi"
        stars={4}
        meta={
          <>
            Honolulu, Hawaii <span className="text-grey-300">|</span> February 2026
          </>
        }
      >
        My family and I visit Hawaii every year. Tripma was recommended by a friend.
      </Testimonial>
      <Testimonial
        avatar={tripma.avatar3}
        name="Anthony Lewis"
        stars={5}
        meta={
          <>
            Berlin, Germany <span className="text-grey-300">|</span> April 2026
          </>
        }
      >
        Tripma had the best browsing experience so I figured I'd give it a try.
      </Testimonial>
    </>
  ),
}
