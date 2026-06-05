import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HlsVideo from './HlsVideo'

const MARQUEE_TEXT = 'BUILDING THE FUTURE \u2022 '
const SOCIALS = [
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Dribbble', href: '#' },
  { name: 'GitHub', href: '#' },
]

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <footer className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      {/* Background Video (flipped) */}
      <div className="absolute inset-0">
        <HlsVideo flip />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        {/* Marquee */}
        <div className="overflow-hidden mb-16 md:mb-24">
          <div
            ref={marqueeRef}
            className="whitespace-nowrap text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary/10"
          >
            {Array.from({ length: 10 })
              .map(() => MARQUEE_TEXT)
              .join('')}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16 md:mb-24 px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-light text-text-primary mb-4">
            Let's work <span className="font-display italic">together</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8">
            Have a project in mind? Let's create something extraordinary.
          </p>
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative inline-flex items-center gap-2 rounded-full text-sm px-8 py-4 text-text-primary border border-stroke hover:border-transparent transition-all duration-300"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="relative flex items-center gap-2 bg-bg rounded-full px-8 py-4 -mx-8 -my-4">
              hello@michaelsmith.com
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </span>
          </a>
        </div>

        {/* Footer Bar */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-stroke pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              {SOCIALS.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-xs text-muted hover:text-text-primary uppercase tracking-[0.15em] transition-colors duration-300"
                >
                  {social.name}
                </a>
              ))}
            </div>

            {/* Available */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-xs text-muted">
                Available for projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
