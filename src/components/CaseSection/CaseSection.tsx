import { Section, Card, Tag, Title, Text } from '@/components/simple'
import styles from './CaseSection.module.css'

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const ECOSYSTEM = [
  { name: 'Pilates & saúde', tag: '↑ fluxo manhã' },
  { name: 'Pet shop', tag: '↑ fidelização' },
  { name: 'Eletro Ferragens Miller', tag: '+30% fat.' },
  { name: 'Pamonharia', tag: '↑ fluxo tarde' },
  { name: 'Pizzaria', tag: '↑ fluxo noite' },
  { name: 'Massas artesanais', tag: '↑ fidelização' },
  { name: 'Robust Suplementos', tag: '↑ recorrência' },
]

const STATS = [
  { num: '7+', label: 'Negócios no ecossistema' },
  { num: '30%', label: 'Crescimento no faturamento' },
  { num: '0%', label: 'Vacância após curadoria' },
  { num: '2016', label: 'Início das operações em BH' },
]

export default function CaseSection() {
  return (
    <Section variant="alt" id="caso">
      <div className={styles.grid}>
        <div className={styles.content}>
          <Tag className={styles.caseTag}>
            Case real · Serra · Belo Horizonte
          </Tag>
          <Title variant="display" className={styles.heading}>
            De lojas vazias a um<br />centro comercial de sucesso
          </Title>
          <Text variant="lead" className={styles.desc}>
            O Centro Comercial Iracema, na Rua Palmira 653–671, Serra, era um imóvel com alta vacância. A Oliveira Imóveis aplicou seu método de curadoria e montou um ecossistema com 7 negócios complementares: saúde, alimentação, serviço e conveniência sob o mesmo teto.
          </Text>
          <Text variant="lead" className={styles.desc}>
            Cada lojista foi escolhido para gerar fluxo em horários diferentes e atender o mesmo público do bairro. <em>"Quem vai ao pilates conhece o pet shop. Quem busca ferragens passa pela pamonharia."</em>
          </Text>

          <blockquote className={styles.quote}>
            <Text variant="body" className={styles.quoteText}>"Em menos de 1 ano no Centro Comercial Iracema, nosso faturamento cresceu 30%. O ecossistema que a Oliveira Imóveis criou aqui faz toda a diferença."</Text>
            <Text as="cite" variant="meta">— Davi · Eletro Ferragens Miller · 30 anos de tradição na Serra</Text>
          </blockquote>

          <div className={styles.statsGrid}>
            {STATS.map(s => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statNum}>{s.num}</div>
                <Text variant="meta" className={styles.statLabel}>{s.label}</Text>
              </div>
            ))}
          </div>
        </div>

        <Card className={styles.map}>
          <Text variant="meta" className={styles.mapTitle}>Negócios do ecossistema · Iracema</Text>
          <div className={styles.mapList}>
            {ECOSYSTEM.map(e => (
              <div key={e.name} className={styles.ecoItem}>
                <span className={styles.ecoBullet} aria-hidden="true" />
                <span className={styles.ecoName}>{e.name}</span>
                <span className={styles.ecoTag}>{e.tag}</span>
              </div>
            ))}
          </div>
          <div className={styles.address}>
            <span className={styles.addressIcon}><MapPinIcon /></span>
            <Text variant="meta" as="span">
              Rua Palmira, 653–671<br />Serra · Belo Horizonte – MG
            </Text>
          </div>
        </Card>
      </div>
    </Section>
  )
}
