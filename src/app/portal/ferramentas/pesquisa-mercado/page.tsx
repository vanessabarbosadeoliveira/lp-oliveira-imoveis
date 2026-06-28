import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PesquisaForm from './PesquisaForm'

export const metadata: Metadata = {
  title: 'Pesquisa de Mercado V5 — Oliveira Imóveis',
}

export interface TemplateField {
  id: string
  key: string
  label: string
  field_type: 'text' | 'textarea' | 'number' | 'currency' | 'select' | 'multiselect' | 'location' | 'range'
  placeholder: string | null
  hint: string | null
  required: boolean
  options: Array<{ label: string; value: string }> | null
  sort_order: number
  section: string | null
}

export default async function PesquisaMercadoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: raw } = await supabase
    .from('form_templates')
    .select(`
      id, title, description,
      form_template_fields (
        sort_order, section,
        form_fields ( id, key, label, field_type, placeholder, hint, required, options )
      )
    `)
    .eq('slug', 'pesquisa-mercado')
    .single()

  if (!raw) {
    return (
      <p style={{ color: 'var(--text-muted)', padding: '2rem' }}>
        Formulário não encontrado. Execute <code>seeds.sql</code> no Supabase primeiro.
      </p>
    )
  }

  type RawJunction = {
    sort_order: number
    section: string | null
    form_fields: Omit<TemplateField, 'sort_order' | 'section'>
  }

  const fields: TemplateField[] = ((raw.form_template_fields ?? []) as unknown as RawJunction[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(ftf => ({
      ...ftf.form_fields,
      sort_order: ftf.sort_order,
      section: ftf.section ?? null,
    }))

  // Find or create a draft for this attempt
  const { data: existingDraft } = await supabase
    .from('form_responses')
    .select('id')
    .eq('user_id', user.id)
    .eq('form_template_id', raw.id)
    .eq('status', 'draft')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let responseId: string

  if (existingDraft) {
    responseId = existingDraft.id
  } else {
    const { data: created, error } = await supabase
      .from('form_responses')
      .insert({ user_id: user.id, form_template_id: raw.id })
      .select('id')
      .single()
    if (error || !created) redirect('/portal')
    responseId = created.id
  }

  // Load the most recent answer per field across ALL of this user's responses
  // for this template. Two queries: get all response IDs, then get all field answers.
  const { data: allResponses } = await supabase
    .from('form_responses')
    .select('id')
    .eq('user_id', user.id)
    .eq('form_template_id', raw.id)

  const allIds = (allResponses ?? []).map(r => r.id)

  const { data: allAnswers } = await supabase
    .from('field_responses')
    .select('form_field_id, value, created_at')
    .in('form_response_id', allIds)
    .order('created_at', { ascending: false })

  // First occurrence per form_field_id is the most recent (ordered desc above)
  const existingValues: Record<string, string> = {}
  for (const row of allAnswers ?? []) {
    if (!(row.form_field_id in existingValues)) {
      existingValues[row.form_field_id] = row.value ?? ''
    }
  }

  return (
    <PesquisaForm
      responseId={responseId}
      fields={fields}
      existingValues={existingValues}
    />
  )
}
