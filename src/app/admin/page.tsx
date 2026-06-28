import { createClient } from '@/lib/supabase/server'
import { Title, Text } from '@/components/simple'
import styles from './dashboard.module.css'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: clientesTotal } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')

  return (
    <div>
      <Title as="h1" variant="section">Dashboard</Title>
      <Text variant="muted" className={styles.sub}>Visão geral da operação</Text>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{clientesTotal ?? '—'}</span>
          <span className={styles.statLabel}>Clientes ativos</span>
        </div>
      </div>
    </div>
  )
}
