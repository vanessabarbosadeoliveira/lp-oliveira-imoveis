import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavLink from './NavLink'
import MobileMenu from '@/components/MobileMenu/MobileMenu'
import PortalProfileButton from './PortalProfileButton'
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

        <PortalProfileButton />

        <MobileMenu>
          <NavLink href="/portal/ferramentas/pesquisa-mercado">Pesquisa de Mercado</NavLink>
          <hr className={styles.menuDivider} />
          <NavLink href="/portal/perfil">Meu perfil</NavLink>
          <form action="/auth/signout" method="POST">
            <button type="submit" className={styles.menuSignOut}>Sair da conta</button>
          </form>
        </MobileMenu>
      </header>

      <main>{children}</main>
    </div>
  )
}
