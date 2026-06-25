'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, TextField } from '@/components/simple'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError('E-mail ou senha inválidos.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    router.push(profile?.role === 'admin' ? '/admin' : '/portal')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextField
        label="E-mail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
