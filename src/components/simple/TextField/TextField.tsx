'use client'

import { useId, forwardRef, useState } from 'react'
import Label from '../Label/Label'
import styles from './TextField.module.css'

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | boolean
  hint?: string
  wrapperClassName?: string
  showToggle?: boolean
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, required, wrapperClassName, id, className, showToggle, type, ...inputProps },
    ref
  ) {
    const autoId = useId()
    const inputId = id ?? autoId
    const hasError = Boolean(error)
    const [visible, setVisible] = useState(false)

    const isPassword = type === 'password'
    const withToggle = isPassword && showToggle
    const resolvedType = withToggle && visible ? 'text' : type

    return (
      <div className={['form-field', wrapperClassName].filter(Boolean).join(' ')}>
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <div className={withToggle ? styles.inputWrapper : undefined}>
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            required={required}
            aria-invalid={hasError || undefined}
            className={[
              'input-base',
              hasError ? 'input-error' : undefined,
              withToggle ? styles.inputWithToggle : undefined,
              className,
            ].filter(Boolean).join(' ')}
            {...inputProps}
          />
          {withToggle && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setVisible(v => !v)}
              aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
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
