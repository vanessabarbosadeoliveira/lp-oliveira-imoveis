import { ReactNode } from 'react'
import styles from './Text.module.css'

type Variant = 'lead' | 'body' | 'muted' | 'meta'
type As = 'p' | 'span' | 'li' | 'div' | 'cite'

export interface TextProps {
  as?: As
  variant?: Variant
  className?: string
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  lead: styles.lead,
  body: styles.body,
  muted: styles.muted,
  meta: styles.meta,
}

export default function Text({
  as: Tag = 'p',
  variant,
  className,
  children,
}: TextProps) {
  const classes = [styles.text, variant ? variantClass[variant] : null, className].filter(Boolean).join(' ')
  return <Tag className={classes}>{children}</Tag>
}
