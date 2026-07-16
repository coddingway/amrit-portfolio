import { m } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow: string
  heading: string
  italicWord: string
  subtext: string
  buttonText?: string
  buttonHref?: string
}

export default function SectionHeader({
  eyebrow,
  heading,
  italicWord,
  subtext,
  buttonText,
  buttonHref = '#',
}: SectionHeaderProps) {
  const headingParts = heading.split(`{italic}`)

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-100px' }}
      className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">
            {eyebrow}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-light text-text-primary mb-3">
          {headingParts[0]}
          <span className="font-display italic">{italicWord}</span>
          {headingParts[1] || ''}
        </h2>
        <p className="text-sm md:text-base text-muted max-w-md">{subtext}</p>
      </div>

      {buttonText && (
        <a
          href={buttonHref}
          className="group relative hidden md:inline-flex items-center gap-2 rounded-full text-sm px-6 py-3 text-text-primary border border-stroke hover:border-transparent transition-all duration-300 shrink-0"
        >
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <span className="relative flex items-center gap-2 bg-surface rounded-full px-6 py-3 -mx-6 -my-3">
            {buttonText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </a>
      )}
    </m.div>
  )
}
