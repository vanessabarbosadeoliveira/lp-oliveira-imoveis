'use client'

import { usePathname } from 'next/navigation'
import styles from './NavLink.module.css'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  exact?: boolean
}

export default function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/')

  return (
    <a
      href={href}
      className={[styles.navLink, isActive ? styles.active : undefined]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </a>
  )
}
