'use client'

import { useId, forwardRef } from 'react'
import Label from '../Label/Label'
import styles from './TextArea.module.css'

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: boolean
  wrapperClassName?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, error, required, wrapperClassName, id, className, ...textareaProps },
    ref
  ) {
    const autoId = useId()
    const textareaId = id ?? autoId

    return (
      <div className={['form-field', wrapperClassName].filter(Boolean).join(' ')}>
        {label && <Label htmlFor={textareaId} required={required}>{label}</Label>}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          className={[styles.textarea, error ? 'input-error' : undefined, className].filter(Boolean).join(' ')}
          {...textareaProps}
        />
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
export default TextArea
