'use client'

import { useState } from 'react'
import { Button, TextField, Checkbox } from '@/components/simple'
import { Popup, Termos, Privacidade } from '@/components/popup'
import { gtagEvent, fbqEvent } from '@/lib/gtag'
import styles from './LeadForm.module.css'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function LeadForm() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | boolean>>({})
  const [loading, setLoading] = useState(false)
  const [openPopup, setOpenPopup] = useState<'termos' | 'privacidade' | null>(null)

  function validate() {
    const next: Record<string, string | boolean> = {}
    if (!fullName.trim()) next.fullName = 'Nome é obrigatório.'
    if (!email.trim()) next.email = 'E-mail é obrigatório.'
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'WhatsApp inválido.'
    if (!terms) next.terms = true
    return next
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    gtagEvent('form_submitted', { event_category: 'landing_page', event_label: 'hero_whatsapp_lead' })
    gtagEvent('generate_lead', { event_category: 'landing_page', event_label: 'hero_whatsapp_lead' })
    fbqEvent('Lead', { content_name: 'Análise Gratuita Oliveira Imóveis', content_category: 'Lead form' })

    const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '5562981835901'
    const message = `Olá! Sou ${fullName}. Tenho interesse em uma análise de mercado gratuita. Meu WhatsApp é ${phone} e meu e-mail é ${email}.`
    window.location.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
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
          value={phone}
          onChange={e => setPhone(formatPhone(e.target.value))}
          required
          autoComplete="tel"
          placeholder="(31) 9 0000-0000"
          maxLength={16}
          error={errors.phone as string | undefined}
        />

        <Checkbox
          id="lead-terms"
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

        <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
          {loading ? 'Aguarde…' : 'Falar com especialista'}
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
