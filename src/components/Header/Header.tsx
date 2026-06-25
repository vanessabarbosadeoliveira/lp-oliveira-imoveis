import Image from 'next/image'
import Button from '../simple/Button/Button'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.brand} aria-label="Oliveira Imóveis — início">
        <Image
          src="/assets/logo/logo.png"
          alt="Logotipo Oliveira Imóveis"
          width={40}
          height={40}
          className={styles.logo}
          priority
        />
        <div className={styles.brandName}>
          OLIVEIRA IMÓVEIS
          <span>Consultoria Imobiliária</span>
        </div>
      </a>

      <Button href="/login" variant="outline" size="sm" aria-label="Entrar na plataforma">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Entrar
      </Button>
    </header>
  )
}
