import RegisterForm from '../auth/RegisterForm/RegisterForm'
import Button from '../simple/Button/Button'
import styles from './HeroSection.module.css'

const BADGES = [
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    label: 'R$0 para solicitar',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'BH e região',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: 'Dados antes do contrato',
  },
]

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '5562981835901'
const WHATSAPP_TEXT = encodeURIComponent(
  'Olá! Vim pelo site da Oliveira Imóveis e quero receber a pesquisa gratuita.'
)

export default function HeroSection() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 id="hero-heading" className={styles.heading}>
            Quer crescer sua<br />
            loja no <em>ponto certo?</em>
          </h1>

          <p className={styles.description}>
            Receba gratuitamente uma análise do ponto, do entorno e do potencial
            comercial antes de expandir.
          </p>

          <ul className={styles.badges} role="list">
            {BADGES.map(b => (
              <li key={b.label} className={styles.badge}>
                {b.icon}
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <div className={styles.registerCard}>
            <h2 className={styles.registerCardTitle}>Comece sua Análise Gratuita</h2>
            <p className={styles.registerCardSub}>Fale com um especialista ou faça uma pesquisa de mercado agora pela nossa plataforma.</p>
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  )
}
