import HeroSection from '../components/hero/HeroSection'
import StatsStrip from '../components/landing/StatsStrip'
import ClientLogoStrip from '../components/landing/ClientLogoStrip'
import FeaturedWork from '../components/landing/FeaturedWork'
import SkillsCarousel from '../components/landing/SkillsCarousel'
import FootballTeaser from '../components/landing/FootballTeaser'
import PhotographyTeaser from '../components/landing/PhotographyTeaser'
import LandingFooter from '../components/landing/LandingFooter'

/**
 * Landing page — composed section by section.
 *
 * Step 7  ✅  HeroSection        (Aurora + Particles + 5-line GSAP reveal)
 * Step 8  ✅  StatsStrip         (Count-up + DrawSVG underlines)
 * Step 9  ✅  FeaturedWork       (Card Swap + Tilted Card + BorderGlow)
 * Step 10 ✅  FootballTeaser     (Marquee + DrawSVG pitch + stat chips)
 * Step 11 ✅  PhotographyTeaser  (Masonry grid + scroll stagger)
 * Step 11b✅  SkillsCarousel     (3-row GSAP marquee — frontend / platforms / tools)
 * Step 12 ✅  LandingFooter      (Calendly booking + LinkedIn + nav + copyright)
 */
export default function Landing() {
  return (
    <main>
      <HeroSection />
      <StatsStrip />
      <ClientLogoStrip />
      <FeaturedWork />
      <SkillsCarousel />
      <FootballTeaser />
      <PhotographyTeaser />
      <LandingFooter />
    </main>
  )
}
