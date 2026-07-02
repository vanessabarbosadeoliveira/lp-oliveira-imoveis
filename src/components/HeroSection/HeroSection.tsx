import { Tag, Title, Text } from '@/components/simple'
import Button from '@/components/simple/Button/Button'
import DualHeroCard from './DualHeroCard'
import styles from './HeroSection.module.css'

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 7l1.8 1.8L9.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HeroSection() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading" id="inicio">
      <div className={styles.inner}>
        <div className={styles.left}>
          <Title as="h1" variant="hero" id="hero-heading" className={styles.heading}>
            Seu próximo ponto<br />
            precisa de <em>dados,</em><br />
            não de sorte.
          </Title>

          <Text variant="lead" className={styles.description}>
            Antes de assinar um contrato, saiba se o ponto tem fluxo de público, vocação comercial e vizinhos certos para o seu negócio crescer de verdade.
          </Text>
        </div>

        <div className={styles.right}>
          <DualHeroCard />
        </div>
      </div>
    </section>
  )
}
