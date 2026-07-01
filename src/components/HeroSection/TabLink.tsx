'use client'

import Button from '@/components/simple/Button/Button'
import type { ButtonVariant, ButtonSize } from '@/components/simple/Button/Button'

interface TabLinkProps {
  tab: 'especialista' | 'plataforma'
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

export default function TabLink({ tab, variant, size = 'md', children }: TabLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('switch-hero-tab', { detail: tab }))
    // Wait two animation frames so React flushes the re-render before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('opcoes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }

  return (
    <Button href={`#tab-${tab}`} variant={variant} size={size} onClick={handleClick}>
      {children}
    </Button>
  )
}
