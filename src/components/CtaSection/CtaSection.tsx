import { Section, Tag, Title, Text } from '@/components/simple'
import TabLink from '@/components/HeroSection/TabLink'
import styles from './CtaSection.module.css'

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

const CTA_FEATURES = [
  'Análise do ponto e entorno sem custo',
  'Potencial comercial da região mapeado',
  'Perfil dos vizinhos e fluxo de público',
  'Especialistas em imóveis comerciais em BH',
  'Retorno pelo WhatsApp em até 1 dia útil',
]

export default function CtaSection() {
  return (
    <Section variant="alt">
      <div className={styles.content}>
        <Tag>Pronto para expandir com segurança?</Tag>
        <Title variant="display" className={styles.heading}>
          Antes de assinar qualquer<br />contrato, <em>fale com a gente.</em>
        </Title>
        <Text variant="lead" className={styles.lead}>
          Nossa análise é gratuita, sem compromisso e feita por quem conhece o mercado comercial de BH desde 2016. Você recebe dados reais para tomar a decisão mais importante da sua expansão.
        </Text>
        <ul className={styles.features}>
          {CTA_FEATURES.map(f => (
            <li key={f} className={styles.feature}>
              <span className={styles.check}><CheckIcon /></span>
              <Text as="span" variant="body">{f}</Text>
            </li>
          ))}
        </ul>
        <div className={styles.cta}>
          <TabLink tab="especialista">Falar com especialista</TabLink>
          <TabLink tab="plataforma" variant="outline">Fazer pesquisa agora</TabLink>
        </div>
      </div>
    </Section>
  )
}
