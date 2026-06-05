import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const ENTRIES = [
  {
    title: 'The Future of Design Systems in 2026',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&q=80',
    readTime: '5 min read',
    date: 'Mar 15, 2026',
  },
  {
    title: 'Building with Motion: A GSAP Deep Dive',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80',
    readTime: '8 min read',
    date: 'Feb 28, 2026',
  },
  {
    title: 'Why Typography Matters More Than Ever',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&q=80',
    readTime: '4 min read',
    date: 'Feb 10, 2026',
  },
  {
    title: 'Rethinking Navigation for Modern Interfaces',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    readTime: '6 min read',
    date: 'Jan 22, 2026',
  },
]

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          heading="Recent {italic}"
          italicWord="thoughts"
          subtext="Writings on design, development, and the creative process."
          buttonText="View all"
          buttonHref="#"
        />

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.a
              key={entry.title}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: '-50px' }}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-[40px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300"
            >
              <img
                src={entry.image}
                alt=""
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <span className="flex-1 text-sm md:text-base text-text-primary group-hover:text-white transition-colors">
                {entry.title}
              </span>
              <span className="flex items-center gap-4 text-xs text-muted shrink-0">
                <span>{entry.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span>{entry.date}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
