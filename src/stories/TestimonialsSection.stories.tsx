import type { Meta, StoryObj } from '@storybook/react-vite'
import { Testimonial } from '../App'
import { tripma } from '../assets/tripma/urls'

const meta: Meta = {
  title: 'Pages/Testimonials Section',
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <section
      className="pt-20 pb-6 flex flex-col gap-6"
      style={{ maxWidth: 1312, margin: '0 auto' }}
    >
      <h2
        className="m-0 mb-6 w-full font-bold text-grey-600 leading-[1.2] text-left max-w-[min(100%,42rem)]"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}
      >
        What <span className="text-purple">Tripma</span> users are saying
      </h2>
      <div className="grid grid-cols-3 gap-10 items-start max-lg:grid-cols-1 max-lg:gap-8">
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
          What a great experience using Tripma! I booked all of my flights for my gap year
          through Tripma and never had any issues. When I had to cancel a flight because of
          an emergency, Tripma support helped me
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
          My family and I visit Hawaii every year, and we usually book our flights using
          other services. Tripma was recommended to us by a long time friend, and I'm so
          glad we tried it out!
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
          When I was looking to book my flight to Berlin from LAX, Tripma had the best
          browsing experience so I figured I'd give it a try.
        </Testimonial>
      </div>
    </section>
  ),
}
