import { Section, Tag, Title, Text, List } from '@/components/simple'
import TabLink from '@/components/HeroSection/TabLink'
import styles from './CtaSection.module.css'

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
          Nossa análise une dados, tecnologia e mais de 30 anos de experiência em pesquisa de mercado para transformar a escolha do ponto comercial em uma decisão mais estratégica.
        </Text>
        <List variant="check" items={CTA_FEATURES} className={styles.features} />
        <div className={styles.cta}>
          <TabLink tab="especialista">Falar com especialista</TabLink>
          <TabLink tab="plataforma" variant="outline">Fazer pesquisa gratuita</TabLink>
        </div>
      </div>
    </Section>
  )
}
