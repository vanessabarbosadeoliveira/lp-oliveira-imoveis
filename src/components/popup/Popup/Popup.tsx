'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Popup.module.css'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: string
  'aria-label'?: string
}

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '720px',
  'aria-label': ariaLabel,
}: PopupProps) {
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    triggerRef.current = document.activeElement
    dialogRef.current?.focus()

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const titleId = 'popup-title'

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        style={{ '--popup-max-width': maxWidth } as React.CSSProperties}
      >
        <div className={styles.header}>
          {title ? (
            <span id={titleId} className={styles.headerTitle}>{title}</span>
          ) : (
            <span />
          )}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.documentElement
  )
}
