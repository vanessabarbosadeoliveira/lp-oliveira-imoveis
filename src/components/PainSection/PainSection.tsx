import { Section, Card, Tag, Title, Text } from '@/components/simple'
import styles from './PainSection.module.css'

function TrendDownIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function FileWarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <circle cx="12" cy="19" r="0.5" fill="currentColor" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

const PAINS = [
  {
    Icon: TrendDownIcon,
    title: 'Fluxo de pessoas que não é o seu público',
    desc: 'Movimento intenso não significa cliente certo. Uma rua com muito trânsito pode ter zero potencial para pilates, estética ou pet shop. Sem análise, você só descobre depois do contrato.',
  },
  {
    Icon: UsersIcon,
    title: 'Vizinhos que drenam ao invés de atrair',
    desc: 'Pontos isolados, sem negócios complementares, forçam você a construir todo o fluxo do zero. Nos melhores ecossistemas, quem vai ao pilates descobre o pet shop ao lado.',
  },
  {
    Icon: FileWarningIcon,
    title: 'Contrato assinado sem análise do entorno',
    desc: 'Sem dados sobre potencial da região, vocação do ponto e perfil de concorrência, a decisão vira aposta. E contrato de locação comercial tem multa por rescisão antecipada.',
  },
]

export default function PainSection() {
  return (
    <Section variant="light">
      <Tag>O risco de decidir sem dados</Tag>
      <Title variant="display" className={styles.heading}>
        O ponto <em>errado<br />custa mais</em> do que o aluguel
      </Title>
      <Text variant="lead" className={styles.lead}>
        Muitos empreendedores fecham um contrato animados com a localização — e só descobrem o problema depois que as chaves estão em mãos.
      </Text>

      <div className={styles.grid}>
        {PAINS.map(p => (
          <Card key={p.title}>
            <div className={styles.cardIcon}><p.Icon /></div>
            <Title as="h3" className={styles.cardTitle}>{p.title}</Title>
            <Text variant="muted">{p.desc}</Text>
          </Card>
        ))}
      </div>

      <div className={styles.callout}>
        <div className={styles.calloutIcon}><InfoIcon /></div>
        <Text variant="body">
          A Oliveira Imóveis resolve exatamente isso. Antes de qualquer contrato, analisamos o ponto, o entorno e o perfil do público para garantir que seu negócio entra no lugar certo — e cresce.
        </Text>
      </div>
    </Section>
  )
}
