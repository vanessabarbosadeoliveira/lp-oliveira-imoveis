import { ReactNode } from 'react'
import styles from './Title.module.css'

type Variant = 'display' | 'section'

export interface TitleProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  variant?: Variant
  id?: string
  className?: string
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  display: styles.display,
  section: styles.section,
}

export default function Title({
  as: Tag = 'h2',
  variant = 'display',
  id,
  className,
  children,
}: TitleProps) {
  const classes = [styles.title, variantClass[variant], className].filter(Boolean).join(' ')
  return <Tag id={id} className={classes}>{children}</Tag>
}
