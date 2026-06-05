import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { transitionTo } from '../lib/transition'

interface TransitionLinkProps {
  to:        string
  children:  React.ReactNode
  className?: string | ((props: { isActive: boolean }) => string)
  style?:    React.CSSProperties
  onClick?:  () => void
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>
  /** If true, renders as <a> for external URLs — skips transition entirely */
  external?: boolean
  /** aria-label */
  'aria-label'?: string
}

/**
 * Drop-in replacement for react-router NavLink that triggers the
 * GSAP page transition before navigating.
 *
 * Handles:
 *  • Cmd/Ctrl+click → opens in new tab (native browser behaviour)
 *  • Middle click   → opens in new tab
 *  • Same-route clicks → no transition, no re-render
 *  • isActive prop  → mirrors NavLink behaviour for className
 */
export default function TransitionLink({
  to,
  children,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  'aria-label': ariaLabel,
}: TransitionLinkProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to))

  const resolvedClass =
    typeof className === 'function' ? className({ isActive }) : className

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let modifier-key clicks through for new-tab behaviour
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return
      }
      e.preventDefault()
      onClick?.()
      transitionTo(to, navigate)
    },
    [to, navigate, onClick],
  )

  return (
    <a
      href={to}
      onClick={handleClick}
      className={resolvedClass}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}
