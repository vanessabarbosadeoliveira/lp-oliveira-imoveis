import { ReactNode } from 'react'
import styles from './Label.module.css'

export interface LabelProps {
  htmlFor?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export default function Label({ htmlFor, required, className, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={[styles.label, className].filter(Boolean).join(' ')}
    >
      {children}
      {required && <span className={styles.required} aria-hidden="true">*</span>}
    </label>
  )
}
