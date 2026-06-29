'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, TextField } from '@/components/simple'
import styles from './LoginForm.module.css'

type Mode = 'login' | 'forgot' | 'sent'

export default function LoginForm() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Read directly from DOM so browser-autofilled values are captured
    const email = emailRef.current?.value ?? ''
    const password = passwordRef.current?.value ?? ''

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

    const pixelId = sessionStorage.getItem('pixel_id')
    if (pixelId) {
      await supabase.from('profiles').update({ pixel_id: pixelId }).eq('id', data.user.id)
    }

    router.push(profile?.role === 'admin' ? '/admin' : '/portal')
    router.refresh()
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    })

    setLoading(false)

    if (resetError) {
      setError(`Erro: ${resetError.message} (${resetError.status ?? resetError.code ?? 'sem código'})`)
      return
    }

    setMode('sent')
  }

  if (mode === 'sent') {
    return (
      <div className={styles.form}>
        <p className={styles.sentMessage}>
          Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes. Verifique também a pasta de spam.
        </p>
        <button type="button" className={styles.textBtn} onClick={() => { setMode('login'); setForgotEmail('') }}>
          ← Voltar ao login
        </button>
      </div>
    )
  }

  if (mode === 'forgot') {
    return (
      <form key="forgot" onSubmit={handleForgot} className={styles.form} noValidate>
        <TextField
          label="E-mail"
          type="email"
          value={forgotEmail}
          onChange={e => setForgotEmail(e.target.value)}
          required
          autoComplete="email"
          hint="Enviaremos um link para você criar uma nova senha."
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" size="lg" className={styles.submit} disabled={loading || !forgotEmail.trim()}>
          {loading ? 'Enviando…' : 'Enviar link'}
        </Button>
        <button type="button" className={styles.textBtn} onClick={() => { setMode('login'); setError(null) }}>
          ← Voltar ao login
        </button>
      </form>
    )
  }

  return (
    <form key="login" onSubmit={handleSubmit} className={styles.form}>
      <TextField
        ref={emailRef}
        label="E-mail"
        type="email"
        required
        autoComplete="email"
      />
      <div className={styles.passwordRow}>
        <TextField
          ref={passwordRef}
          label="Senha"
          type="password"
          required
          autoComplete="current-password"
        />
        <button type="button" className={styles.textBtn} onClick={() => { setMode('forgot'); setError(null) }}>
          Esqueci minha senha
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
