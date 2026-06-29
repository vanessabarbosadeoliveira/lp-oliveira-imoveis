'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, TextField, Title, Text } from '@/components/simple'
import styles from '@/app/login/login.module.css'
import formStyles from '@/components/auth/LoginForm/LoginForm.module.css'

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(pw)) return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(pw)) return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(pw)) return 'A senha deve conter pelo menos um número.'
  return null
}

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    const pwError = validatePassword(password)
    if (pwError) next.password = pwError
    if (password !== confirm) next.confirm = 'As senhas não coincidem.'
    if (Object.keys(next).length) { setErrors(next); return }
    setErrors({})
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setStatus('Não foi possível redefinir a senha. O link pode ter expirado — solicite um novo.')
      setLoading(false)
      return
    }

    router.push('/portal')
    router.refresh()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>Oliveira Imóveis</div>
        <Title as="h1" variant="section" className={styles.heading}>Nova senha</Title>
        <Text variant="muted" className={styles.sub}>Escolha uma senha segura para a sua conta.</Text>
        <form onSubmit={handleSubmit} className={formStyles.form} noValidate>
          <TextField
            label="Nova senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={errors.password}
            hint="Mínimo 8 caracteres, com maiúscula, minúscula e número."
            showToggle
          />
          <TextField
            label="Confirmar senha"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            error={errors.confirm}
            showToggle
          />
          {status && <p className={formStyles.error}>{status}</p>}
          <Button type="submit" size="lg" className={formStyles.submit} disabled={loading}>
            {loading ? 'Salvando…' : 'Redefinir senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}
