import Image from 'next/image'
import casePic from '@/assets/images/centro_comercial.jpeg'
import { Section, Card, Tag, Title, Text, List } from '@/components/simple'
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
  { name: 'Pet shop', tag: '↑ recorrência' },
  { name: 'Eletro Ferragens Miller', tag: '+30% fat.' },
  { name: 'Pamonharia', tag: '↑ fluxo tarde' },
  { name: 'Pizzaria', tag: '↑ fluxo noite' },
  { name: 'Massas artesanais', tag: '↑ fidelização' },
  { name: 'Robust Suplementos', tag: '↑ recorrência' },
]

const STATS = [
  { num: '7+', label: 'Negócios no ecossistema' },
  { num: '30+', label: 'Anos de experiência em pesquisa de mercado' },
  { num: '0%', label: 'Vacância após curadoria' },
  { num: '2024', label: 'Início das operações em BH' },
]

const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Rua%20Palmira%20653-671%2C%20Serra%2C%20Belo%20Horizonte%20-%20MG'

export default function CaseSection() {
  return (
    <Section variant="light" id="caso">
      <div className={styles.grid}>
        <div className={styles.content}>
          <Tag className={styles.caseTag}>
            Case real · Serra · Belo Horizonte
          </Tag>
          <Title variant="display" className={styles.heading}>
            De <em>lojas vazias</em> a um<br />centro comercial de <em>sucesso</em>
          </Title>
          <Text variant="lead" className={styles.desc}>
            O Centro Comercial Iracema, na{' '}
            <a
              className={styles.addressLink}
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
            >
              Rua Palmira 653–671, Serra
            </a>{' '}
            era um imóvel com alta vacância. A Oliveira Imóveis aplicou seu método de curadoria e montou um ecossistema com 7 negócios complementares: saúde, alimentação, serviço e conveniência sob o mesmo teto.
          </Text>
          <Text variant="lead" className={styles.desc}>
            Cada lojista foi escolhido para gerar fluxo em horários diferentes e atender o mesmo público do bairro. <em>"Quem vai ao pilates conhece o pet shop. Quem busca ferragens passa pela pamonharia."</em>
          </Text>

          <blockquote className={styles.quote}>
            <Text variant="body" className={styles.quoteText}>"Em menos de 1 ano no Centro Comercial Iracema, nosso faturamento cresceu 30%. O ecossistema que a Oliveira Imóveis criou aqui faz toda a diferença."</Text>
            <Text as="cite" variant="meta">— Davi · Eletro Ferragens Miller · 30 anos de tradição na Serra</Text>
          </blockquote>

          <div className={styles.imageWrap}>
            <Image
              src={casePic}
              alt="Centro Comercial Iracema — Serra, Belo Horizonte"
              className={styles.image}
              sizes="(max-width: 960px) 100vw, 600px"
            />
          </div>

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
          <Title as="h3" className={styles.mapTitle}>Negócios do ecossistema · Iracema</Title>
          <List
            variant="dot"
            className={styles.mapList}
            contentClassName={styles.ecoContent}
            items={ECOSYSTEM.map(e => (
              <>
                <span className={styles.ecoName}>{e.name}</span>
                <span className={styles.ecoTag}>{e.tag}</span>
              </>
            ))}
          />
          <div className={styles.address}>
            <span className={styles.addressIcon}><MapPinIcon /></span>
            <Text variant="meta" as="span">
              <a
                className={styles.addressLink}
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
              >
                Rua Palmira, 653–671<br />Serra · Belo Horizonte – MG
              </a>
            </Text>
          </div>
        </Card>
      </div>
    </Section>
  )
}
