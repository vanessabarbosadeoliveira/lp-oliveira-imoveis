import { ReactNode } from 'react'
import styles from './Tag.module.css'

export interface TagProps {
  children: ReactNode
  className?: string
}

export default function Tag({ children, className }: TagProps) {
  const classes = [styles.tag, className].filter(Boolean).join(' ')
  return <p className={classes}>{children}</p>
}
