'use client'

import Button from '@/components/simple/Button/Button'
import styles from './portal.module.css'

export default function PortalProfileButton() {
  return (
    <Button
      href="/portal/perfil"
      variant="outline"
      size="sm"
      aria-label="Meu perfil"
      className={styles.desktopOnly}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      Meu perfil
    </Button>
  )
}
