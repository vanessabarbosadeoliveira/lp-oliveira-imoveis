'use client'

import { useState } from 'react'
import { Button, TextField } from '@/components/simple'
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = 'Nome é obrigatório.'
    if (!email.trim()) next.email = 'E-mail é obrigatório.'
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'WhatsApp inválido.'
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
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <TextField
        label="Nome completo"
        type="text"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        required
        autoComplete="name"
        error={errors.fullName}
      />
      <TextField
        label="E-mail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
        error={errors.email}
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
        error={errors.phone}
      />
      <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
        {loading ? 'Aguarde…' : 'Falar com especialista'}
      </Button>
    </form>
  )
}
