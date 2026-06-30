import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import FormulariosEditor from './FormulariosEditor'
import type { FormField, FormTemplate } from './types'
import styles from './formularios.module.css'

export const metadata: Metadata = {
  title: 'Campos — Oliveira Imóveis',
}

export default async function FormulariosPage() {
  const supabase = await createClient()

  const [{ data: fieldsData }, { data: templatesData }, { data: usedData }] =
    await Promise.all([
      supabase
        .from('form_fields')
        .select('*')
        .order('created_at', { ascending: true }),
      supabase
        .from('form_templates')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase
        .from('form_template_fields')
        .select('form_field_id'),
    ])

  const fields = (fieldsData ?? []) as FormField[]
  const templates = (templatesData ?? []) as FormTemplate[]
  const usedFieldIds = Array.from(
    new Set((usedData ?? []).map((r: { form_field_id: string }) => r.form_field_id))
  )

  return (
    <div className={styles.page}>
      <FormulariosEditor
        fields={fields}
        templates={templates}
        usedFieldIds={usedFieldIds}
        defaultTab="fields"
        title="Campos"
        subtitle="Gerencie os campos utilizados nos formulários do portal."
      />
    </div>
  )
}
