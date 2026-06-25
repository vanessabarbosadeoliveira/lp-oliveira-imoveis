'use client'

import { useId, forwardRef } from 'react'
import Label from '../Label/Label'

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
  wrapperClassName?: string
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, required, wrapperClassName, id, className, ...inputProps },
    ref
  ) {
    const autoId = useId()
    const inputId = id ?? autoId

    return (
      <div className={['form-field', wrapperClassName].filter(Boolean).join(' ')}>
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={['input-base', error ? 'input-error' : undefined, className].filter(Boolean).join(' ')}
          {...inputProps}
        />
      </div>
    )
  }
)

TextField.displayName = 'TextField'
export default TextField
