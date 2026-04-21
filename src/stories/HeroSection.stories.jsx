import { HeroSearchGroup } from '../App.jsx'
import { tripma } from '../assets/tripma/urls.js'

export default {
  title: 'Pages/Hero Section',
  parameters: {
    layout: 'fullscreen',
  },
}

export const Default = {
  render: () => (
    <section className="hero" aria-labelledby="hero-heading">
      <img className="hero__map" src={tripma.heroMap} alt="" />
      <div className="hero__content">
        <HeroSearchGroup />
      </div>
    </section>
  ),
}
