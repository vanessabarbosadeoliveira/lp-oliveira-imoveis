import { Section, Card, Tag, Title, Text } from '@/components/simple'
import TabLink from '@/components/HeroSection/TabLink'
import styles from './MethodSection.module.css'

function SearchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function MethodSection() {
  return (
    <Section variant="light">
      <div className={styles.intro}>
        <Tag>Como trabalhamos</Tag>
        <Title variant="display" className={styles.heading}>
          Não alugamos espaço.<br />Montamos ecossistemas.
        </Title>
        <Text variant="lead">
          Cada negócio que entra em um ponto Oliveira Imóveis passou por etapas de análise estratégica — para que o conjunto seja mais forte que cada parte.
        </Text>
      </div>

      <Card className={styles.step}>
        <div className={styles.stepNum} aria-hidden="true">01</div>
        <div className={styles.stepIcon}><SearchIcon /></div>
        <Title as="h3" className={styles.stepTitle}>Curadoria estratégica de ponto e perfil</Title>
        <Text variant="muted">
          Analisamos a vocação comercial do ponto, o fluxo real de público e o potencial da região antes de indicar qualquer espaço. Não trabalhamos com volume — trabalhamos com estratégia.
        </Text>
      </Card>

      <div className={styles.cta}>
        <TabLink tab="especialista">Falar com especialista</TabLink>
        <TabLink tab="plataforma" variant="outline">Fazer pesquisa agora</TabLink>
      </div>
    </Section>
  )
}
