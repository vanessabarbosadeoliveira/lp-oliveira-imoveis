import { createClient } from '@/lib/supabase/server'
import { Title, Text, Button } from '@/components/simple'
import AnalysisHistoryTable, { type AnalysisHistoryRow } from '@/components/AnalysisHistoryTable/AnalysisHistoryTable'
import styles from './dashboard.module.css'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { count: clientesTotal },
    { data: templates },
    historyResult,
    completedResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer'),
    supabase
      .from('form_templates')
      .select('id, slug, title, description, public')
      .order('sort_order', { ascending: true }),
    supabase
      .from('form_responses')
      .select('id, status, updated_at, form_templates ( title, slug )')
      .eq('user_id', user!.id)
      .in('status', ['submitted', 'processing', 'complete'])
      .order('updated_at', { ascending: false }),
    supabase
      .from('form_responses')
      .select('form_template_id')
      .eq('user_id', user!.id)
      .eq('status', 'complete'),
  ])

  const history = (historyResult.data ?? []) as unknown as AnalysisHistoryRow[]

  const allTemplates = templates ?? []
  const templateIdToSlug = Object.fromEntries(allTemplates.map(t => [t.id, t.slug]))
  const usageBySlug: Record<string, number> = {}
  for (const r of completedResult.data ?? []) {
    const slug = templateIdToSlug[r.form_template_id]
    if (slug) usageBySlug[slug] = (usageBySlug[slug] ?? 0) + 1
  }

  return (
    <div>
      <Title as="h1" variant="section">Dashboard</Title>
      <Text variant="muted" className={styles.sub}>Visão geral da operação</Text>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{clientesTotal ?? '—'}</span>
          <span className={styles.statLabel}>Clientes ativos</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{allTemplates.length}</span>
          <span className={styles.statLabel}>Formulários</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{history.length}</span>
          <span className={styles.statLabel}>Minhas análises</span>
        </div>
      </div>

      {/* ── Formulários ───────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>Formulários</h2>
        {allTemplates.length === 0 ? (
          <p className={styles.empty}>Nenhum formulário cadastrado.</p>
        ) : (
          <div className={styles.toolGrid}>
            {allTemplates.map(tool => {
              const uses = usageBySlug[tool.slug] ?? 0
              return (
                <div key={tool.slug} className={styles.toolCard}>
                  <div className={styles.toolHeader}>
                    <h3 className={styles.toolTitle}>{tool.title}</h3>
                    {!tool.public && (
                      <span className={styles.draftBadge}>Não publicado</span>
                    )}
                  </div>
                  {tool.description && (
                    <p className={styles.toolDescription}>{tool.description}</p>
                  )}
                  <div className={styles.toolAction}>
                    <Button
                      href={`/portal/ferramentas/${tool.slug}`}
                      variant="solid"
                      size="md"
                    >
                      Iniciar
                    </Button>
                    <span className={styles.toolUsage}>{uses} uso{uses !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Histórico de análises ─────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>Meu histórico de análises</h2>
        <AnalysisHistoryTable rows={history} />
      </section>
    </div>
  )
}
