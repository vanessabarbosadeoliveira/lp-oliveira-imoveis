import { ReactNode } from 'react'
import styles from './List.module.css'

export type ListVariant = 'dot' | 'dash' | 'ordered' | 'check'

export interface ListProps {
  items: ReactNode[]
  variant?: ListVariant
  className?: string
  itemClassName?: string
  contentClassName?: string
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function List({
  items,
  variant = 'dot',
  className,
  itemClassName,
  contentClassName,
}: ListProps) {
  const Tag = variant === 'ordered' ? 'ol' : 'ul'

  return (
    <Tag className={[styles.list, styles[variant], className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <li key={i} className={[styles.item, itemClassName].filter(Boolean).join(' ')}>
          {variant !== 'ordered' && (
            <span className={styles.marker} aria-hidden="true">
              {variant === 'check' && <CheckIcon />}
            </span>
          )}
          <span className={[styles.content, contentClassName].filter(Boolean).join(' ')}>
            {item}
          </span>
        </li>
      ))}
    </Tag>
  )
}
