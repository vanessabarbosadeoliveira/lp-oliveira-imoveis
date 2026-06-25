import { ReactNode } from 'react'
import styles from './Text.module.css'

type Variant = 'body' | 'muted' | 'meta'
type As = 'p' | 'span' | 'li' | 'div'

export interface TextProps {
  as?: As
  variant?: Variant
  className?: string
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  body: styles.body,
  muted: styles.muted,
  meta: styles.meta,
}

export default function Text({
  as: Tag = 'p',
  variant = 'body',
  className,
  children,
}: TextProps) {
  const classes = [styles.text, variantClass[variant], className].filter(Boolean).join(' ')
  return <Tag className={classes}>{children}</Tag>
}
