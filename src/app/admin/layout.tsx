import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Button from '@/components/simple/Button/Button'
import NavLink from '@/components/simple/NavLink/NavLink'
import MobileMenu from '@/components/MobileMenu/MobileMenu'
import styles from './admin.module.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/portal')

  return (
    <div className={styles.shell}>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className={styles.sidebar}>
        <a href="/admin" className={styles.brand} aria-label="Oliveira Imóveis — admin">
          <Image
            src="/assets/logo/logo.png"
            alt="Logotipo Oliveira Imóveis"
            width={36}
            height={36}
            className={styles.logo}
            priority
          />
          <div className={styles.brandName}>
            OLIVEIRA IMÓVEIS
            <span>Consultoria Imobiliária</span>
          </div>
        </a>
        <nav className={styles.nav}>
          <NavLink href="/admin" exact>Dashboard</NavLink>
          <NavLink href="/admin/clientes">Clientes</NavLink>
        </nav>
        <div className={styles.sidebarFooter}>
          <Button href="/admin/perfil" variant="outline" size="sm" className={styles.profileBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
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
          <form action="/auth/signout" method="POST">
            <button type="submit" className={styles.signOut}>Sair</button>
          </form>
        </div>
      </aside>

      {/* Mobile header — hidden on desktop, shown on mobile */}
      <header className={styles.mobileHeader}>
        <a href="/admin" className={styles.brand} aria-label="Oliveira Imóveis — admin">
          <Image
            src="/assets/logo/logo.png"
            alt="Logotipo Oliveira Imóveis"
            width={36}
            height={36}
            className={styles.logo}
            priority
          />
          <div className={styles.brandName}>
            OLIVEIRA IMÓVEIS
            <span>Consultoria Imobiliária</span>
          </div>
        </a>
        <MobileMenu>
          <NavLink href="/admin" exact>Dashboard</NavLink>
          <NavLink href="/admin/clientes">Clientes</NavLink>
          <hr className={styles.menuDivider} />
          <Button href="/admin/perfil" variant="outline" size="sm" className={styles.menuProfileBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
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
          <form action="/auth/signout" method="POST">
            <button type="submit" className={styles.menuSignOut}>Sair da conta</button>
          </form>
        </MobileMenu>
      </header>

      <main>{children}</main>
    </div>
  )
}
