import { createClient } from '@/lib/supabase/server'
import { Title, Text, Button } from '@/components/simple'
import AnalysisHistoryTable, { type AnalysisHistoryRow } from '@/components/AnalysisHistoryTable/AnalysisHistoryTable'
import styles from './portal-home.module.css'

const MAX_USES = 2

const FERRAMENTAS = [
  {
    slug: 'pesquisa-mercado',
    title: 'Pesquisa de Mercado',
    motivation: 'Tome decisões informadas de compra e venda com base em dados reais do mercado imobiliário.',
    description:
      'Preencha um formulário com as características do imóvel e da região de interesse. ' +
      'Nossa inteligência artificial gera um relatório detalhado com análise de preços, ' +
      'perfil da área e tendências do mercado local.',
    href: '/portal/ferramentas/pesquisa-mercado',
  },
] as const

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '5562981835901'
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Olá! Vim pelo site da Oliveira Imóveis e quero receber a pesquisa gratuita.')}`

export default async function PortalHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Cliente'

  const ferramentaSlugs = FERRAMENTAS.map(f => f.slug)

  const [historyResult, templatesResult, completedResult] = await Promise.all([
    supabase
      .from('form_responses')
      .select('id, status, updated_at, form_templates ( title, slug )')
      .eq('user_id', user!.id)
      .in('status', ['submitted', 'processing', 'complete'])
      .order('updated_at', { ascending: false }),
    supabase
      .from('form_templates')
      .select('id, slug')
      .in('slug', ferramentaSlugs),
    supabase
      .from('form_responses')
      .select('form_template_id')
      .eq('user_id', user!.id)
      .eq('status', 'complete'),
  ])

  const history = (historyResult.data ?? []) as unknown as AnalysisHistoryRow[]

  const templateIdToSlug = Object.fromEntries(
    (templatesResult.data ?? []).map(t => [t.id, t.slug])
  )
  const usageBySlug: Record<string, number> = {}
  for (const r of completedResult.data ?? []) {
    const slug = templateIdToSlug[r.form_template_id]
    if (slug) usageBySlug[slug] = (usageBySlug[slug] ?? 0) + 1
  }

  return (
    <div>
      <div className={styles.greeting}>
        <Title as="h1" variant="section">Olá, {firstName}</Title>
        <Text variant="muted" className={styles.sub}>Bem-vindo ao seu portal Oliveira Imóveis.</Text>
        <div className={styles.helpCard}>
          <div className={styles.helpText}>
            <p className={styles.helpTitle}>Encontre o ponto ideal para o seu negócio</p>
            <p className={styles.helpDesc}>
              Nossa equipe pode te ajudar gratuitamente a encontrar e avaliar o melhor ponto comercial
              para a sua expansão — com dados reais de mercado, perfil da região e análise da concorrência.
            </p>
          </div>
          <Button href={WHATSAPP_HREF} variant="solid" size="md">
            Falar com especialista
          </Button>
        </div>
      </div>

      {/* ── Ferramentas ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>Ferramentas disponíveis</h2>
        <div className={styles.toolGrid}>
          {FERRAMENTAS.map(tool => {
            const uses = usageBySlug[tool.slug] ?? 0
            return (
              <div key={tool.slug} className={styles.toolCard}>
                <h3>{tool.title}</h3>
                <p className={styles.toolMotivation}>{tool.motivation}</p>
                <p className={styles.toolDescription}>{tool.description}</p>
                <div className={styles.toolAction}>
                  <Button href={tool.href} variant="solid" size="md">Iniciar</Button>
                  <span className={styles.toolUsage}>{uses}/{MAX_USES}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── History ─────────────────────────────────────────────── */}
      <section className={styles.historySection}>
        <h2 className={styles.sectionLabel}>Histórico de análises</h2>
        <AnalysisHistoryTable rows={history} />
      </section>
    </div>
  )
}
