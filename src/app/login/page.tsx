import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm/LoginForm'
import { Title, Text } from '@/components/simple'
import styles from './login.module.css'

export const metadata: Metadata = {
  title: 'Entrar — Oliveira Imóveis',
}

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>Oliveira Imóveis</div>
        <Title as="h1" variant="section" className={styles.heading}>Acesse sua conta</Title>
        <Text variant="muted" className={styles.sub}>Painel administrativo e portal do cliente</Text>
        <LoginForm />
      </div>
    </div>
  )
}
