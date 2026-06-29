'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, TextField } from '@/components/simple'
import styles from './ProfileForm.module.css'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function extractError(err: unknown): string {
  if (!err) return 'Erro desconhecido.'
  if (typeof err === 'string' && err) return err
  if (typeof err === 'object') {
    const e = err as Record<string, unknown>
    if (e.status === 500) return 'serviço indisponível no momento.'
    if (typeof e.message === 'string' && e.message && e.message !== '{}') return e.message
    const serialised = JSON.stringify(err)
    if (serialised && serialised !== '{}') return serialised
  }
  return 'Erro desconhecido.'
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(pw)) return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(pw)) return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(pw)) return 'A senha deve conter pelo menos um número.'
  return null
}

interface ProfileFormProps {
  initialFullName: string
  initialEmail: string
  initialWhatsapp: string
}

export default function ProfileForm({
  initialFullName,
  initialEmail,
  initialWhatsapp,
}: ProfileFormProps) {
  // — Info section
  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(initialEmail)
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp)
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({})
  const [infoStatus, setInfoStatus] = useState<string | null>(null)
  const [infoIsError, setInfoIsError] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)

  // — Password section
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwStatus, setPwStatus] = useState<string | null>(null)
  const [pwIsError, setPwIsError] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setInfoStatus(null)
    setInfoIsError(false)
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = 'Nome é obrigatório.'
    if (!email.trim()) next.email = 'E-mail é obrigatório.'
    if (whatsapp.replace(/\D/g, '').length < 10) next.whatsapp = 'WhatsApp inválido.'
    if (Object.keys(next).length) { setInfoErrors(next); return }
    setInfoErrors({})
    setInfoLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1 — Update user_metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), whatsapp },
    })
    if (metaError) {
      setInfoStatus(`Erro ao salvar dados: ${extractError(metaError)}`)
      setInfoIsError(true)
      setInfoLoading(false)
      return
    }

    // 2 — Mirror to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), whatsapp })
      .eq('id', user.id)

    if (profileError) {
      setInfoStatus(`Erro ao salvar perfil: ${extractError(profileError)}`)
      setInfoIsError(true)
      setInfoLoading(false)
      return
    }

    // 3 — Email change is a separate call; Supabase sends a confirmation link
    if (email !== initialEmail) {
      const { error: emailError } = await supabase.auth.updateUser({ email })
      if (emailError) {
        setInfoStatus('Suas informações foram salvas. Não foi possível alterar o e-mail — tente novamente mais tarde ou entre em contato com o suporte.')
        setInfoIsError(true)
        setInfoLoading(false)
        return
      }
      setInfoStatus('Informações salvas. Confirme o novo e-mail na sua caixa de entrada.')
      setInfoIsError(false)
    } else {
      setInfoStatus('Informações atualizadas com sucesso.')
      setInfoIsError(false)
    }

    setInfoLoading(false)
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwStatus(null)
    setPwIsError(false)
    const next: Record<string, string> = {}
    const pwError = validatePassword(newPassword)
    if (pwError) next.newPassword = pwError
    if (newPassword !== confirmPassword) next.confirmPassword = 'As senhas não coincidem.'
    if (Object.keys(next).length) { setPwErrors(next); return }
    setPwErrors({})
    setPwLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPwStatus(`Erro: ${error.message}`)
      setPwIsError(true)
    } else {
      setPwStatus('Senha alterada com sucesso.')
      setPwIsError(false)
      setNewPassword('')
      setConfirmPassword('')
    }
    setPwLoading(false)
  }

  return (
    <div className={styles.sections}>
      {/* ── Personal info ── */}
      <section className={styles.section}>
        <h2>Informações pessoais</h2>
        <form onSubmit={handleInfoSubmit} className={styles.form} noValidate>
          <TextField
            label="Nome completo"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            autoComplete="name"
            error={infoErrors.fullName}
          />
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            error={infoErrors.email}
          />
          <TextField
            label="WhatsApp"
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(formatPhone(e.target.value))}
            required
            autoComplete="tel"
            placeholder="(31) 9 0000-0000"
            maxLength={16}
            error={infoErrors.whatsapp}
          />
          {infoStatus && (
            <p className={infoIsError ? styles.error : styles.success}>
              {infoStatus}
            </p>
          )}
          <Button type="submit" size="md" disabled={infoLoading} className={styles.saveBtn}>
            {infoLoading ? 'Salvando…' : 'Salvar informações'}
          </Button>
        </form>
      </section>

      <div className={styles.divider} />

      {/* ── Password ── */}
      <section className={styles.section}>
        <h2>Alterar senha</h2>
        <form onSubmit={handlePasswordSubmit} className={styles.form} noValidate>
          <input
            type="email"
            name="username"
            autoComplete="username"
            value={initialEmail}
            readOnly
            aria-hidden="true"
            tabIndex={-1}
            className={styles.hiddenUsername}
          />
          <TextField
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={pwErrors.newPassword}
            hint="Mínimo 8 caracteres, com maiúscula, minúscula e número."
            showToggle
          />
          <TextField
            label="Confirmar nova senha"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={pwErrors.confirmPassword}
            showToggle
          />
          {pwStatus && (
            <p className={pwIsError ? styles.error : styles.success}>
              {pwStatus}
            </p>
          )}
          <Button type="submit" size="md" disabled={pwLoading} className={styles.saveBtn}>
            {pwLoading ? 'Salvando…' : 'Alterar senha'}
          </Button>
        </form>
      </section>

      <div className={styles.divider} />

      {/* ── Sign out ── */}
      <section className={styles.section}>
        <h2>Sessão</h2>
        <form action="/auth/signout" method="POST">
          <Button type="submit" variant="outline" size="md">
            Sair da conta
          </Button>
        </form>
      </section>
    </div>
  )
}
