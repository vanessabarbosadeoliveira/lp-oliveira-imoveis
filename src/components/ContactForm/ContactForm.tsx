'use client'

import { useState } from 'react'
import { Button, TextField, Dropdown, Checkbox } from '../simple'
import { Popup, Termos, Privacidade } from '../popup'
import { saveLeadAction } from './actions'
import styles from './ContactForm.module.css'

const EXPANSION_OPTIONS = [
  { value: 'Nos próximos 3 meses', label: 'Nos próximos 3 meses' },
  { value: 'No próximo semestre', label: 'No próximo semestre' },
  { value: 'No próximo ano', label: 'No próximo ano' },
  { value: 'Ainda estou avaliando', label: 'Ainda estou avaliando' },
]

type Fields = {
  nome: string
  email: string
  whatsapp: string
  negocio: string
  expansao: string
  terms: boolean
}

const EMPTY: Fields = {
  nome: '',
  email: '',
  whatsapp: '',
  negocio: '',
  expansao: '',
  terms: false,
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openPopup, setOpenPopup] = useState<'termos' | 'privacidade' | null>(null)

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: false }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, boolean>> = {}
    if (!fields.nome.trim()) next.nome = true
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = true
    if (fields.whatsapp.replace(/\D/g, '').length < 10) next.whatsapp = true
    if (!fields.negocio.trim()) next.negocio = true
    if (!fields.expansao) next.expansao = true
    if (!fields.terms) next.terms = true
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    saveLeadAction({
      nome: fields.nome,
      email: fields.email,
      whatsapp: fields.whatsapp,
      negocio: fields.negocio,
      expansao: fields.expansao,
    }).catch(() => {})

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE
    const text = encodeURIComponent(
      `Olá! Vim pelo site da Oliveira Imóveis.\n\n` +
      `*Nome:* ${fields.nome}\n` +
      `*E-mail:* ${fields.email}\n` +
      `*WhatsApp:* ${fields.whatsapp}\n` +
      `*Negócio:* ${fields.negocio}\n` +
      `*Momento de expansão:* ${fields.expansao}`
    )
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener')

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className={styles.successTitle}>Pedido enviado!</p>
          <p className={styles.successMsg}>
            Nossa equipe vai entrar em contato com você pelo WhatsApp em breve com a análise gratuita.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Receba a pesquisa gratuita</h2>
      <p className={styles.cardSubtitle}>Preencha e nossa equipe chama você no WhatsApp.</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          id="nome"
          label="Nome"
          required
          type="text"
          error={errors.nome}
          placeholder="Seu nome"
          value={fields.nome}
          onChange={e => set('nome', e.target.value)}
          autoComplete="name"
        />

        <TextField
          id="email"
          label="E-mail"
          required
          type="email"
          error={errors.email}
          placeholder="seunome@email.com"
          value={fields.email}
          onChange={e => set('email', e.target.value)}
          autoComplete="email"
        />

        <TextField
          id="whatsapp"
          label="WhatsApp"
          required
          type="tel"
          error={errors.whatsapp}
          placeholder="(31) 9 0000-0000"
          value={fields.whatsapp}
          onChange={e => set('whatsapp', formatPhone(e.target.value))}
          autoComplete="tel"
          maxLength={16}
        />

        <TextField
          id="negocio"
          label="Qual é o seu negócio?"
          required
          type="text"
          error={errors.negocio}
          placeholder="Ex: Pilates, estética, pet shop…"
          value={fields.negocio}
          onChange={e => set('negocio', e.target.value)}
        />

        <Dropdown
          id="expansao"
          label="Momento da expansão"
          required
          error={errors.expansao}
          options={EXPANSION_OPTIONS}
          value={fields.expansao}
          onChange={v => set('expansao', v)}
        />

        <Checkbox
          id="terms"
          error={errors.terms}
          checked={fields.terms}
          onChange={e => set('terms', e.target.checked)}
          label={
            <>
              Li e concordo com os{' '}
              <button
                type="button"
                onClick={() => setOpenPopup('termos')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Termos de Uso
              </button>
              {' '}e a{' '}
              <button
                type="button"
                onClick={() => setOpenPopup('privacidade')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Política de Privacidade
              </button>
              .
            </>
          }
        />

        <Button type="submit" size="lg" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Enviando…' : 'Quero minha análise'}
        </Button>

        <p className={styles.disclaimer}>
          Sem custo. Sem compromisso. Apenas contato sobre locação.
        </p>
      </form>

      <Popup isOpen={openPopup === 'termos'} onClose={() => setOpenPopup(null)} title="Termos de Uso">
        <Termos />
      </Popup>

      <Popup isOpen={openPopup === 'privacidade'} onClose={() => setOpenPopup(null)} title="Política de Privacidade">
        <Privacidade />
      </Popup>
    </div>
  )
}
