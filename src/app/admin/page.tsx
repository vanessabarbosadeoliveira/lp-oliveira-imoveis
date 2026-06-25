import { createClient } from '@/lib/supabase/server'
import { Title, Text } from '@/components/simple'
import styles from './dashboard.module.css'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: leadsTotal }, { count: clientesTotal }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
  ])

  return (
    <div>
      <Title as="h1" variant="section">Dashboard</Title>
      <Text variant="muted" className={styles.sub}>Visão geral da operação</Text>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{leadsTotal ?? '—'}</span>
          <span className={styles.statLabel}>Leads recebidos</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{clientesTotal ?? '—'}</span>
          <span className={styles.statLabel}>Clientes ativos</span>
        </div>
      </div>
    </div>
  )
}
