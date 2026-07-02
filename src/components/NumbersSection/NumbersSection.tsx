import { Section, Text } from '@/components/simple'
import styles from './NumbersSection.module.css'

const NUMBERS = [
  { num: '7+', label: 'Negócios no ecossistema' },
  { num: '100%', label: 'Foco em comercial' },
  { num: '30+', label: 'Anos de experiência em pesquisa de mercado' },
  { num: '2024', label: 'Atuando em BH' },
]

export default function NumbersSection() {
  return (
    <Section variant="alt" compact className={styles.bordered}>
      <div className={styles.grid}>
        {NUMBERS.map(n => (
          <div key={n.label} className={styles.item}>
            <div className={styles.num}>{n.num}</div>
            <Text variant="meta" className={styles.label}>{n.label}</Text>
          </div>
        ))}
      </div>
    </Section>
  )
}
