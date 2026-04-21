import { SectionTitle, SeeAllLink, StayCard, ArrowRightIcon } from '../App.jsx'
import { tripma } from '../assets/tripma/urls.js'

export default {
  title: 'Pages/Stays Section',
  parameters: {
    layout: 'padded',
  },
}

export const Default = {
  render: () => (
    <section className="band" style={{ maxWidth: 1312, margin: '0 auto' }}>
      <SectionTitle aside={<SeeAllLink />} headingId="stays-heading">
        Explore unique <span className="text-accent">places to stay</span>
      </SectionTitle>
      <div className="card-grid card-grid--stays">
        <StayCard
          image={tripma.stayMaldives}
          title={
            <>
              Stay among the atolls in <span className="text-accent">Maldives</span>
            </>
          }
          description="From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages."
        />
        <StayCard
          image={tripma.stayMorocco}
          title={
            <>
              Experience the Ourika Valley in <span className="text-accent">Morocco</span>
            </>
          }
          description="Morocco's Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East."
        />
        <StayCard
          image={tripma.stayMongolia}
          title={
            <>
              Live traditionally in <span className="text-accent">Mongolia</span>
            </>
          }
          description="Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel."
          imageClass="deal-card__image--mongolia"
        />
      </div>
      <div className="band__cta">
        <a className="btn btn--secondary" href="#">
          <span className="btn--secondary__text">Explore more stays</span>
          <span className="btn--secondary__icon" aria-hidden>
            <ArrowRightIcon className="btn--secondary__arrow" />
          </span>
        </a>
      </div>
    </section>
  ),
}
