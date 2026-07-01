import { ElementType, ReactNode } from 'react'
import styles from './Tag.module.css'

export interface TagProps {
  as?: ElementType
  children: ReactNode
  className?: string
}

export default function Tag({ as: Tag = 'p', children, className }: TagProps) {
  const classes = [styles.tag, className].filter(Boolean).join(' ')
  return <Tag className={classes}>{children}</Tag>
}
