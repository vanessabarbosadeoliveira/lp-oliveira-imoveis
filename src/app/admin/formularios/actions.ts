'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FormField, FormTemplate } from './types'

// Parses {{key}} tokens from a prompt string, preserving first-appearance order.
function extractKeys(prompt: string | null | undefined): string[] {
  if (!prompt) return []
  const seen = new Set<string>()
  const keys: string[] = []
  for (const [, key] of prompt.matchAll(/\{\{(\w+)\}\}/g)) {
    if (!seen.has(key)) { seen.add(key); keys.push(key) }
  }
  return keys
}

async function syncTemplateFields(
  supabase: SupabaseClient,
  templateId: string,
  llmPrompt: string | null | undefined
): Promise<string | null> {
  const keys = extractKeys(llmPrompt)

  const { error: deleteError } = await supabase
    .from('form_template_fields')
    .delete()
    .eq('form_template_id', templateId)
  if (deleteError) return deleteError.message

  if (keys.length === 0) return null

  const { data: fields, error: fieldsError } = await supabase
    .from('form_fields')
    .select('id, key')
    .in('key', keys)
  if (fieldsError) return fieldsError.message
  if (!fields || fields.length === 0) return null

  const keyOrder = new Map(keys.map((k, i) => [k, i]))
  const rows = (fields as { id: string; key: string }[]).map(f => ({
    form_template_id: templateId,
    form_field_id: f.id,
    sort_order: keyOrder.get(f.key) ?? 0,
    section: null,
  }))

  const { error: insertError } = await supabase
    .from('form_template_fields')
    .insert(rows)
  if (insertError) return insertError.message

  return null
}

export async function createFormField(
  data: Omit<FormField, 'id' | 'created_at'>
): Promise<{ data: FormField | null; error: string | null }> {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('form_fields')
    .insert(data)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/admin/formularios')
  return { data: row as FormField, error: null }
}

export async function createFormTemplate(
  data: Omit<FormTemplate, 'id' | 'created_at'>
): Promise<{ data: FormTemplate | null; error: string | null }> {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('form_templates')
    .insert(data)
    .select()
    .single()
  if (error) return { data: null, error: error.message }

  const syncErr = await syncTemplateFields(supabase, (row as FormTemplate).id, data.llm_prompt_template)
  if (syncErr) return { data: null, error: syncErr }

  revalidatePath('/admin/formularios/templates')
  return { data: row as FormTemplate, error: null }
}

export async function updateFormField(
  id: string,
  data: Partial<Omit<FormField, 'id' | 'key' | 'created_at'>>
): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('form_fields')
    .update(data)
    .eq('id', id)
  if (error) return error.message
  revalidatePath('/admin/formularios')
  return null
}

export async function deleteFormField(id: string): Promise<string | null> {
  const supabase = await createClient()

  const { count, error: checkError } = await supabase
    .from('form_template_fields')
    .select('*', { count: 'exact', head: true })
    .eq('form_field_id', id)

  if (checkError) return checkError.message

  if (count && count > 0) {
    return 'Este campo está em uso em um ou mais formulários e não pode ser excluído.'
  }

  const { error } = await supabase
    .from('form_fields')
    .delete()
    .eq('id', id)

  if (error) return error.message
  revalidatePath('/admin/formularios')
  return null
}

export async function updateFormTemplate(
  id: string,
  data: Partial<Omit<FormTemplate, 'id' | 'slug' | 'created_at'>>
): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('form_templates')
    .update(data)
    .eq('id', id)
  if (error) return error.message

  const syncErr = await syncTemplateFields(supabase, id, data.llm_prompt_template)
  if (syncErr) return syncErr

  revalidatePath('/admin/formularios/templates')
  return null
}

export async function deleteFormTemplate(id: string): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('form_templates')
    .delete()
    .eq('id', id)
  if (error) return error.message
  revalidatePath('/admin/formularios')
  return null
}
