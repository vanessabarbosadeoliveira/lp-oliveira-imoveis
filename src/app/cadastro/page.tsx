import type { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm/RegisterForm'
import { Title, Text } from '@/components/simple'
import styles from './cadastro.module.css'

export const metadata: Metadata = {
  title: 'Criar conta — Oliveira Imóveis',
}

export default function CadastroPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>Oliveira Imóveis</div>
        <Title as="h1" variant="section" className={styles.heading}>Criar conta</Title>
        <Text variant="muted" className={styles.sub}>Acesse o portal do cliente</Text>
        <RegisterForm />
        <p className={styles.footer}>
          Já tem uma conta?{' '}
          <Link href="/login" className={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
