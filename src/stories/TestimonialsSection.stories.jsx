import { Testimonial } from '../App.jsx'
import { tripma } from '../assets/tripma/urls.js'

export default {
  title: 'Pages/Testimonials Section',
  parameters: {
    layout: 'padded',
  },
}

export const Default = {
  render: () => (
    <section
      className="band band--testimonials"
      style={{ maxWidth: 1312, margin: '0 auto' }}
    >
      <h2 className="testimonials__title">
        What <span className="text-accent">Tripma</span> users are saying
      </h2>
      <div className="testimonial-grid">
        <Testimonial
          avatar={tripma.avatar1}
          name="Yifei Chen"
          stars={5}
          meta={
            <>
              Seoul, South Korea <span className="text-muted-sep">|</span> April 2026
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
              Honolulu, Hawaii <span className="text-muted-sep">|</span> February 2026
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
              Berlin, Germany <span className="text-muted-sep">|</span> April 2026
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
