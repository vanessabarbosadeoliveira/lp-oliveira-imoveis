import { Section, Card, Tag, Title, Text, List } from '@/components/simple'
import Button from '@/components/simple/Button/Button'
import styles from './AboutSection.module.css'

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const ABOUT_ITEMS = [
  'Foco exclusivo em imóveis comerciais em BH e região',
  'Método proprietário de análise e curadoria de ecossistemas',
  'Marketing digital com tráfego pago e campanhas segmentadas',
  'Gestão próxima e transparente com análise de mercado contínua',
  'Case comprovado: Centro Comercial Iracema — Serra, BH',
]

export default function AboutSection() {
  return (
    <Section variant="light">
      <div className={styles.grid}>
        <div className={styles.content}>
          <Tag>Quem somos</Tag>
          <Title variant="display" className={styles.heading}>
            Mais do que uma imobiliária —<br />estrategistas de ponto comercial
          </Title>
          <Text variant="lead" className={styles.lead}>
            A Oliveira Imóveis nasceu com um propósito claro: posicionar espaços comerciais com estratégia e curadoria de negócios — gerando resultado real para proprietários e lojistas.
          </Text>
          <List variant="check" items={ABOUT_ITEMS} />
        </div>

        <Card className={styles.visual}>
          <Title as="h3" className={styles.visualTitle}>Centro Comercial Iracema</Title>
          <Text variant="muted" className={styles.visualDesc}>
            Um ecossistema real de negócios complementares que se multiplicam no mesmo endereço — provando que o ponto certo, com os vizinhos certos, faz toda a diferença.
          </Text>
          <div className={styles.address}>
            <span className={styles.addressIcon}><MapPinIcon /></span>
            <Text variant="meta" as="span">
              Rua Palmira, 653 a 671<br />Serra · Belo Horizonte – MG
            </Text>
          </div>
          <div className={styles.visualCta}>
            <Button href="#opcoes" size="md">
              Quero a análise gratuita
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  )
}
