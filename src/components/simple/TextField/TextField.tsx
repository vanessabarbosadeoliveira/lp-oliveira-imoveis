'use client'

import { useId, forwardRef } from 'react'
import Label from '../Label/Label'
import styles from './TextField.module.css'

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | boolean
  hint?: string
  wrapperClassName?: string
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, required, wrapperClassName, id, className, ...inputProps },
    ref
  ) {
    const autoId = useId()
    const inputId = id ?? autoId
    const hasError = Boolean(error)

    return (
      <div className={['form-field', wrapperClassName].filter(Boolean).join(' ')}>
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={hasError || undefined}
          className={['input-base', hasError ? 'input-error' : undefined, className].filter(Boolean).join(' ')}
          {...inputProps}
        />
        {typeof error === 'string' && error && (
          <span className={styles.errorMsg}>{error}</span>
        )}
        {hint && !error && (
          <span className={styles.hint}>{hint}</span>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
export default TextField
