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
        const el = document.getElementById('opcoes')
        if (!el) return
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-height')
        ) || 72
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight
        window.scrollTo({ top, behavior: 'smooth' })
      })
    })
  }

  return (
    <Button href={`#tab-${tab}`} variant={variant} size={size} onClick={handleClick}>
      {children}
    </Button>
  )
}
