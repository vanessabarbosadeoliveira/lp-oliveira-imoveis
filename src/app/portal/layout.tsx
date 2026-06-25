import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import styles from './portal.module.css'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.logo}>Oliveira Imóveis</span>
        <nav className={styles.nav}>
          <a href="/portal" className={styles.navLink}>Início</a>
          <a href="/portal/perfil" className={styles.navLink}>Meu perfil</a>
        </nav>
        <div className={styles.userArea}>
          <span className={styles.userName}>{profile?.full_name ?? user.email}</span>
          <form action="/auth/signout" method="POST">
            <button type="submit" className={styles.signOut}>Sair</button>
          </form>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
