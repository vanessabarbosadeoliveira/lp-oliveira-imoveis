import { Section, Text } from '@/components/simple'
import styles from './NumbersSection.module.css'

const NUMBERS = [
  { num: '2016', label: 'Atuando em BH' },
  { num: '7+', label: 'Negócios no ecossistema' },
  { num: '100%', label: 'Foco em comercial' },
  { num: '4', label: 'Etapas do método' },
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
