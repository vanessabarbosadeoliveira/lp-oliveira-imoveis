import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CopyButton from '@/app/portal/analise/[id]/CopyButton'
import styles from '@/app/portal/analise/[id]/analise.module.css'

export const metadata: Metadata = {
  title: 'Análise — Oliveira Imóveis',
}

type FormTemplate = { title: string; slug: string }

export default async function AdminAnalisePage({
  params,
}: {
  params: Promise<{ id: string; analysisId: string }>
}) {
  const { id: clientId, analysisId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin') redirect('/portal')

  const { data: response } = await supabase
    .from('form_responses')
    .select(`
      id, status, updated_at, content,
      form_templates ( title, slug )
    `)
    .eq('id', analysisId)
    .single()

  if (!response) notFound()

  const template = Array.isArray(response.form_templates)
    ? (response.form_templates[0] as FormTemplate | undefined) ?? null
    : (response.form_templates as FormTemplate | null)
  const analysisText = (response.content as string | null) ?? null

  const formattedDate = new Date(response.updated_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={styles.page}>
      <div>
        <a href={`/admin/clientes/${clientId}`} className={styles.back}>← Voltar ao cliente</a>
        <div className={styles.meta}>
          <h1>{template?.title ?? 'Análise'}</h1>
          <p className={styles.date}>Gerada em {formattedDate}</p>
        </div>
      </div>

      {analysisText ? (
        <div className={styles.resultCard}>
          <div className={styles.cardToolbar}>
            <CopyButton text={analysisText} />
          </div>
          <div className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analysisText}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <p className={styles.pending}>
          {response.status === 'processing'
            ? 'Esta análise ainda está sendo processada. Tente novamente em instantes.'
            : 'Nenhuma análise encontrada para esta resposta.'}
        </p>
      )}
    </div>
  )
}
