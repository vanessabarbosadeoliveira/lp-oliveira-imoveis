import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AnalysisHistoryTable, { type AnalysisHistoryRow } from '@/components/AnalysisHistoryTable/AnalysisHistoryTable'
import styles from './cliente.module.css'

export const metadata: Metadata = {
  title: 'Cliente — Oliveira Imóveis',
}

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type FormTemplateInfo = { title: string; slug: string }
type FieldInfo = { label: string }
type FieldResponseData = { value: string; form_fields: FieldInfo | FieldInfo[] | null }
type ResponseData = {
  id: string
  status: string
  updated_at: string
  form_templates: FormTemplateInfo | FormTemplateInfo[] | null
  field_responses: FieldResponseData[] | null
}

function resolveTemplate(t: FormTemplateInfo | FormTemplateInfo[] | null): FormTemplateInfo | null {
  if (!t) return null
  return Array.isArray(t) ? (t[0] ?? null) : t
}

function resolveField(f: FieldInfo | FieldInfo[] | null): FieldInfo | null {
  if (!f) return null
  return Array.isArray(f) ? (f[0] ?? null) : f
}

export default async function ClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: clientId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin') redirect('/portal')

  const { data: client } = await supabase
    .from('profiles')
    .select('id, full_name, email, whatsapp, pixel_id, created_at')
    .eq('id', clientId)
    .eq('role', 'customer')
    .single()

  if (!client) notFound()

  const { data: responsesData } = await supabase
    .from('form_responses')
    .select(`
      id, status, updated_at,
      form_templates ( title, slug ),
      field_responses ( value, form_fields ( label ) )
    `)
    .eq('user_id', clientId)
    .in('status', ['submitted', 'processing', 'complete'])
    .order('updated_at', { ascending: false })

  const responses = (responsesData ?? []) as unknown as ResponseData[]

  const historyRows: AnalysisHistoryRow[] = responses.map(r => ({
    id: r.id,
    status: r.status,
    updated_at: r.updated_at,
    form_templates: resolveTemplate(r.form_templates),
  }))

  type FieldEntry = { label: string; value: string }
  type FieldGroup = { analysisId: string; title: string; date: string; fields: FieldEntry[] }

  const fieldGroups: FieldGroup[] = responses
    .map(r => ({
      analysisId: r.id,
      title: resolveTemplate(r.form_templates)?.title ?? '—',
      date: formatDate(r.updated_at),
      fields: (r.field_responses ?? []).map(fr => ({
        label: resolveField(fr.form_fields)?.label ?? '—',
        value: fr.value,
      })),
    }))
    .filter(g => g.fields.length > 0)

  const memberSince = new Date(client.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })

  return (
    <div className={styles.page}>
      <div>
        <a href="/admin/clientes" className={styles.back}>← Voltar para Clientes</a>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <ProfileIcon />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{client.full_name ?? '—'}</h1>
            <div className={styles.profileMeta}>
              {client.email && (
                <span className={styles.profileMetaItem}><strong>E-mail:</strong> {client.email}</span>
              )}
              {client.whatsapp && (
                <span className={styles.profileMetaItem}><strong>WhatsApp:</strong> {client.whatsapp}</span>
              )}
              {client.pixel_id && (
                <span className={styles.profileMetaItem}><strong>Pixel ID:</strong> {client.pixel_id}</span>
              )}
              <span className={styles.profileMetaItem}><strong>Desde:</strong> {memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>Análises</h2>
        <AnalysisHistoryTable
          rows={historyRows}
          getAnalysisHref={(id) => `/admin/clientes/${clientId}/analise/${id}`}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>Respostas do Formulário</h2>
        {fieldGroups.length === 0 ? (
          <p className={styles.empty}>Nenhuma resposta registrada ainda.</p>
        ) : (
          <div className={styles.fieldGroups}>
            {fieldGroups.map(group => (
              <div key={group.analysisId} className={styles.fieldGroup}>
                <p className={styles.fieldGroupTitle}>
                  {group.title}
                  <span className={styles.fieldGroupDate}>{group.date}</span>
                </p>
                <table className={styles.fieldTable}>
                  <thead>
                    <tr>
                      <th>Campo</th>
                      <th>Resposta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.fields.map((f, i) => (
                      <tr key={i}>
                        <td className={styles.fieldLabel}>{f.label}</td>
                        <td>{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
