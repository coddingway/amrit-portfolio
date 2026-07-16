import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    title: 'Abstract Flow',
  },
  {
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    title: 'Color Study',
  },
  {
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80',
    title: 'Geometric',
  },
  {
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
    title: 'Texture Play',
  },
  {
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80',
    title: 'Light Study',
  },
  {
    image: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&q=80',
    title: 'Organic Forms',
  },
]

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      // Pin the center content
      if (contentRef.current) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top center',
          end: 'bottom center',
          pin: true,
          pinSpacing: false,
        })
      }

      // Parallax columns
      if (col1Ref.current) {
        gsap.to(col1Ref.current, {
          y: -200,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      if (col2Ref.current) {
        gsap.to(col2Ref.current, {
          y: -400,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const leftItems = ITEMS.slice(0, 3)
  const rightItems = ITEMS.slice(3, 6)

  return (
    <>
      <section ref={sectionRef} className="relative min-h-[300vh] bg-bg">
        {/* Pinned center content */}
        <div ref={contentRef} className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Explorations
              </span>
              <span className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-light text-text-primary mb-3">
              Visual <span className="font-display italic">playground</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8">
              Experimental work exploring form, color, and motion.
            </p>
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 rounded-full text-sm px-6 py-3 text-text-primary border border-stroke hover:border-transparent transition-all duration-300"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="relative flex items-center gap-2 bg-bg rounded-full px-6 py-3 -mx-6 -my-3">
                Dribbble
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Parallax columns */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="max-w-[1400px] mx-auto h-full px-6 md:px-16">
            <div className="grid grid-cols-2 gap-12 md:gap-40 h-full">
              {/* Left column */}
              <div ref={col1Ref} className="flex flex-col gap-8 pt-[20vh]">
                {leftItems.map(item => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setLightbox(item.image)}
                    className="pointer-events-auto cursor-pointer aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-stroke bg-surface hover:rotate-1 transition-transform duration-500 p-0"
                    style={{ display: 'block' }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Right column */}
              <div
                ref={col2Ref}
                className="flex flex-col gap-8 pt-[40vh] items-end"
              >
                {rightItems.map(item => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setLightbox(item.image)}
                    className="pointer-events-auto cursor-pointer aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-stroke bg-surface hover:-rotate-1 transition-transform duration-500 p-0"
                    style={{ display: 'block' }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <button
          type="button"
          aria-label="Close lightbox"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-8 cursor-pointer w-full border-none"
          style={{ background: 'rgba(0,0,0,0.9)' }}
        >
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </button>
      )}
    </>
  )
}
