import AboutHero from '../components/about/AboutHero'
import ExperienceTimeline from '../components/about/ExperienceTimeline'
import EducationSection from '../components/about/EducationSection'
import AboutCTA from '../components/about/AboutCTA'

/**
 * About page — Steps 13–16
 *
 * Step 13 ✅  AboutHero          (headline, typewriter role, stats, glass avatar card)
 * Step 14 ✅  ExperienceTimeline (vertical timeline, glass cards, GSAP stagger)
 * Step 15 ✅  EducationSection   (education + certifications, glassmorphism)
 * Step 16 ✅  AboutCTA           (Calendly booking + contact link)
 */
export default function About() {
  return (
    <main>
      <AboutHero />
      <ExperienceTimeline />
      <EducationSection />
      <AboutCTA />
    </main>
  )
}
