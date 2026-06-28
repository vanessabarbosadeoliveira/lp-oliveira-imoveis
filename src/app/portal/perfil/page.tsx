import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Title } from '@/components/simple'
import ProfileForm from '@/components/auth/ProfileForm/ProfileForm'
import styles from './perfil.module.css'

export const metadata: Metadata = {
  title: 'Meu perfil — Oliveira Imóveis',
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, whatsapp')
    .eq('id', user.id)
    .single()

  const meta = user.user_metadata ?? {}

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>Oliveira Imóveis</div>
        <Title as="h1" variant="section" className={styles.heading}>Meu perfil</Title>
        <ProfileForm
          initialFullName={profile?.full_name ?? meta.full_name ?? ''}
          initialEmail={user.email ?? ''}
          initialWhatsapp={profile?.whatsapp ?? meta.whatsapp ?? ''}
        />
      </div>
    </div>
  )
}
