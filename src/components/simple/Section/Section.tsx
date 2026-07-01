import { ReactNode } from 'react'
import styles from './Section.module.css'

export interface SectionProps {
  variant?: 'light' | 'alt'
  compact?: boolean
  id?: string
  className?: string
  children: ReactNode
}

export default function Section({ variant = 'light', compact = false, id, className, children }: SectionProps) {
  const classes = [styles.section, styles[variant], compact ? styles.compact : null, className].filter(Boolean).join(' ')
  return (
    <section id={id} className={classes}>
      <div className={styles.inner}>{children}</div>
    </section>
  )
}
