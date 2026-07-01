import { ReactNode } from 'react'
import styles from './Title.module.css'

type Variant = 'hero' | 'display' | 'section'

export interface TitleProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  variant?: Variant
  id?: string
  className?: string
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  hero: styles.hero,
  display: styles.display,
  section: styles.section,
}

export default function Title({
  as: Tag = 'h2',
  variant,
  id,
  className,
  children,
}: TitleProps) {
  const classes = [styles.title, variant ? variantClass[variant] : null, className].filter(Boolean).join(' ')
  return <Tag id={id} className={classes}>{children}</Tag>
}
