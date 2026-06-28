import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Button from '@/components/simple/Button/Button'
import NavLink from './NavLink'
import styles from './portal.module.css'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a href="/portal" className={styles.brand} aria-label="Oliveira Imóveis — portal">
          <Image
            src="/assets/logo/logo.png"
            alt="Logotipo Oliveira Imóveis"
            width={40}
            height={40}
            className={styles.logo}
            priority
          />
          <div className={styles.brandName}>
            OLIVEIRA IMÓVEIS
            <span>Consultoria Imobiliária</span>
          </div>
        </a>

        <nav className={styles.nav}>
          <NavLink href="/portal/ferramentas/pesquisa-mercado">Pesquisa de Mercado</NavLink>
        </nav>

        <Button href="/portal/perfil" variant="outline" size="sm" aria-label="Meu perfil">
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
      </header>

      <main>{children}</main>
    </div>
  )
}
