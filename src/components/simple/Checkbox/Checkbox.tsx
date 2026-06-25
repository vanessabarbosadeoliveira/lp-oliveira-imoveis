'use client'

import { useId, ReactNode } from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: ReactNode
  error?: boolean
}

export default function Checkbox({ label, error, id, ...inputProps }: CheckboxProps) {
  const autoId = useId()
  const checkboxId = id ?? autoId

  return (
    <div className={[styles.row, error ? styles.rowError : undefined].filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        id={checkboxId}
        className={styles.checkbox}
        {...inputProps}
      />
      <label htmlFor={checkboxId} className={styles.checkboxLabel}>
        {label}
      </label>
    </div>
  )
}
