'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, TextField, Checkbox } from '@/components/simple'
import { Popup, Termos, Privacidade } from '@/components/popup'
import { gtagEvent, fbqEvent } from '@/lib/gtag'
import styles from './RegisterForm.module.css'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(pw)) return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(pw)) return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(pw)) return 'A senha deve conter pelo menos um número.'
  return null
}

export default function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | boolean>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [openPopup, setOpenPopup] = useState<'termos' | 'privacidade' | null>(null)

  function validate() {
    const next: Record<string, string | boolean> = {}

    if (!fullName.trim()) next.fullName = 'Nome é obrigatório.'
    if (!email.trim()) next.email = 'E-mail é obrigatório.'
    if (whatsapp.replace(/\D/g, '').length < 10) next.whatsapp = 'WhatsApp inválido.'

    const pwError = validatePassword(password)
    if (pwError) next.password = pwError

    if (password !== confirmPassword) next.confirmPassword = 'As senhas não coincidem.'
    if (!terms) next.terms = true

    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const supabase = createClient()
    const pixelId = sessionStorage.getItem('pixel_id') ?? undefined
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, whatsapp, pixel_id: pixelId },
      },
    })

    if (error) {
      setServerError(
        error.message && error.message !== '{}'
          ? error.message
          : 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      )
      setLoading(false)
      return
    }

    gtagEvent('form_submitted', { event_category: 'landing_page', event_label: 'cadastro_plataforma' })
    gtagEvent('generate_lead', { event_category: 'landing_page', event_label: 'cadastro_plataforma' })
    gtagEvent('sign_up', { method: 'email' })
    fbqEvent('Lead', { content_name: 'Análise Gratuita Oliveira Imóveis', content_category: 'Cadastro Plataforma' })
    router.push('/portal')
    router.refresh()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <TextField
          label="Nome completo"
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          autoComplete="name"
          error={errors.fullName as string | undefined}
        />
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          error={errors.email as string | undefined}
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
          error={errors.whatsapp as string | undefined}
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          error={errors.password as string | undefined}
          hint="Mínimo 8 caracteres, com maiúscula, minúscula e número."
          showToggle
        />
        <TextField
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          error={errors.confirmPassword as string | undefined}
          showToggle
        />

        <Checkbox
          id="register-terms"
          checked={terms}
          onChange={e => setTerms(e.target.checked)}
          error={!!errors.terms}
          label={
            <>
              Li e concordo com os{' '}
              <button
                type="button"
                onClick={() => setOpenPopup('termos')}
                className={styles.linkBtn}
              >
                Termos de Uso
              </button>
              {' '}e a{' '}
              <button
                type="button"
                onClick={() => setOpenPopup('privacidade')}
                className={styles.linkBtn}
              >
                Política de Privacidade
              </button>
              .
            </>
          }
        />

        {serverError && <p className={styles.error}>{serverError}</p>}
        <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
          {loading ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>

      <Popup isOpen={openPopup === 'termos'} onClose={() => setOpenPopup(null)} title="Termos de Uso">
        <Termos />
      </Popup>
      <Popup isOpen={openPopup === 'privacidade'} onClose={() => setOpenPopup(null)} title="Política de Privacidade">
        <Privacidade />
      </Popup>
    </>
  )
}
