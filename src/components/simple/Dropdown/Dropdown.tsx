'use client'

import { useId, useRef, useState, useEffect } from 'react'
import Label from '../Label/Label'
import styles from './Dropdown.module.css'

export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownProps {
  label?: string
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: boolean
  disabled?: boolean
  id?: string
  wrapperClassName?: string
}

export default function Dropdown({
  label,
  options,
  value = '',
  onChange,
  placeholder = 'Selecione',
  required,
  error,
  disabled,
  id,
  wrapperClassName,
}: DropdownProps) {
  const autoId = useId()
  const triggerId = id ?? autoId
  const listId = `${triggerId}-list`

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === value)?.label

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(optValue: string) {
    onChange?.(optValue)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = options.findIndex(o => o.value === value)
      const next = options[Math.min(idx + 1, options.length - 1)]
      if (next) select(next.value)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = options.findIndex(o => o.value === value)
      const prev = options[Math.max(idx - 1, 0)]
      if (prev) select(prev.value)
    }
  }

  return (
    <div className={['form-field', wrapperClassName].filter(Boolean).join(' ')}>
      {label && (
        <Label htmlFor={triggerId} required={required}>{label}</Label>
      )}

      <div ref={containerRef} className={styles.container}>
        <button
          type="button"
          role="combobox"
          id={triggerId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-required={required}
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          onKeyDown={handleKeyDown}
          className={[
            styles.trigger,
            'input-base',
            error ? 'input-error' : undefined,
            !selectedLabel ? styles.placeholder : undefined,
          ].filter(Boolean).join(' ')}
        >
          <span>{selectedLabel ?? placeholder}</span>
          <svg
            className={[styles.chevron, open ? styles.chevronOpen : undefined].filter(Boolean).join(' ')}
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className={styles.list}
          >
            {options.map(opt => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={[
                  styles.option,
                  opt.value === value ? styles.optionSelected : undefined,
                ].filter(Boolean).join(' ')}
                onMouseDown={() => select(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
