import { createClient } from '@/lib/supabase/server'
import { Title, Text } from '@/components/simple'
import styles from './portal-home.module.css'

export default async function PortalHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Cliente'

  return (
    <div>
      <Title as="h1" variant="section">Olá, {firstName}</Title>
      <Text variant="muted" className={styles.sub}>Bem-vindo ao seu portal Oliveira Imóveis.</Text>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Minhas solicitações</span>
          <Text variant="muted">Nenhuma solicitação em aberto.</Text>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Imóveis indicados</span>
          <Text variant="muted">Em breve você receberá sugestões personalizadas.</Text>
        </div>
      </div>
    </div>
  )
}
