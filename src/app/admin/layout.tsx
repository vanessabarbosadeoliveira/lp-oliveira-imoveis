import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Oliveira Imóveis</div>
        <nav className={styles.nav}>
          <a href="/admin" className={styles.navLink}>Dashboard</a>
          <a href="/admin/leads" className={styles.navLink}>Leads</a>
          <a href="/admin/clientes" className={styles.navLink}>Clientes</a>
        </nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.userName}>{profile?.full_name ?? user.email}</span>
          <form action="/auth/signout" method="POST">
            <button type="submit" className={styles.signOut}>Sair</button>
          </form>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
