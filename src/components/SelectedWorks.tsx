import { m } from 'framer-motion'
import SectionHeader from './SectionHeader'

const PROJECTS = [
  {
    title: 'Automotive Motion',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/3]',
  },
  {
    title: 'Urban Architecture',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Human Perspective',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/3]',
  },
]

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          heading="Featured {italic}"
          italicWord="projects"
          subtext="A selection of projects I've worked on, from concept to launch."
          buttonText="View all work"
          buttonHref="#"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <m.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: '-50px' }}
              className={`${project.span} group cursor-pointer`}
            >
              <div
                className={`relative ${project.aspect} bg-surface border border-stroke rounded-3xl overflow-hidden`}
              >
                {/* Background image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Halftone overlay */}
                <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bg/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <span className="relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
                    <span className="absolute inset-[-2px] rounded-full accent-gradient animate-gradient-shift" />
                    <span className="relative bg-white text-bg rounded-full px-5 py-2.5 flex items-center gap-2">
                      View —{' '}
                      <span className="font-display italic">
                        {project.title}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
