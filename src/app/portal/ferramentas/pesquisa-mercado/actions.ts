'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function generateResearchAction(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'ERRO: Não autenticado.'

  const responseId = formData.get('response_id') as string
  if (!responseId) return 'ERRO: ID de resposta inválido.'

  const upserts: Array<{
    form_response_id: string
    form_field_id: string
    value: string
  }> = []

  for (const [key, val] of formData.entries()) {
    if (key.startsWith('field_')) {
      const fieldId = key.slice(6)
      const value = (val as string).trim()
      if (value) {
        upserts.push({ form_response_id: responseId, form_field_id: fieldId, value })
      }
    }
  }

  if (upserts.length > 0) {
    const { error } = await supabase
      .from('field_responses')
      .upsert(upserts, { onConflict: 'form_response_id,form_field_id' })
    if (error) return `ERRO ao salvar campos: ${error.message}`
  }

  const { data: response } = await supabase
    .from('form_responses')
    .select('form_template_id')
    .eq('id', responseId)
    .single()
  if (!response) return 'ERRO: Resposta não encontrada.'

  const { count: completedCount } = await supabase
    .from('form_responses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('form_template_id', response.form_template_id)
    .eq('status', 'complete')

  if ((completedCount ?? 0) >= 2) {
    return 'Você já utilizou as 2 análises disponíveis para esta ferramenta.'
  }

  const { data: template } = await supabase
    .from('form_templates')
    .select('llm_prompt_template')
    .eq('id', response.form_template_id)
    .single()
  if (!template?.llm_prompt_template) return 'ERRO: Template de prompt não encontrado.'

  const { data: fieldResps } = await supabase
    .from('field_responses')
    .select('value, form_fields ( key )')
    .eq('form_response_id', responseId)

  let prompt = template.llm_prompt_template
  for (const fr of fieldResps ?? []) {
    const field = fr.form_fields as unknown as { key: string }
    if (field?.key) {
      prompt = prompt.replace(new RegExp(`\\{\\{${field.key}\\}\\}`, 'g'), fr.value ?? '')
    }
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return 'ERRO: DEEPSEEK_API_KEY não configurada no servidor.'

  let text: string
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return `ERRO: ${(err as { error?: { message?: string } })?.error?.message ?? res.statusText}`
    }

    const data = await res.json()
    text = (data.choices?.[0]?.message?.content as string) ?? ''
  } catch (e) {
    return `ERRO de rede: ${e instanceof Error ? e.message : String(e)}`
  }

  await supabase
    .from('form_responses')
    .update({ status: 'complete', content: text })
    .eq('id', responseId)

  redirect(`/portal/analise/${responseId}`)
}
