'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Popup, Termos, Privacidade } from '@/components/popup'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  const [openPopup, setOpenPopup] = useState<'termos' | 'privacidade' | null>(null)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a href="/" className={styles.brand} aria-label="Oliveira Imóveis — início">
          <Image
            src="/assets/logo/logo.png"
            alt="Logotipo Oliveira Imóveis"
            width={28}
            height={28}
            className={styles.logo}
          />
          <div className={styles.brandName}>
            OLIVEIRA IMÓVEIS
            <span>Consultoria Imobiliária</span>
          </div>
        </a>

        <div className={styles.copy}>© 2024 Oliveira Imóveis · Belo Horizonte, MG</div>

        <div className={styles.links}>
          <button
            type="button"
            className={styles.link}
            onClick={() => setOpenPopup('termos')}
          >
            Termos de Uso
          </button>
          <button
            type="button"
            className={styles.link}
            onClick={() => setOpenPopup('privacidade')}
          >
            Privacidade
          </button>
        </div>
      </div>

      <Popup
        isOpen={openPopup === 'termos'}
        onClose={() => setOpenPopup(null)}
        title="Termos de Uso"
      >
        <Termos />
      </Popup>

      <Popup
        isOpen={openPopup === 'privacidade'}
        onClose={() => setOpenPopup(null)}
        title="Política de Privacidade"
      >
        <Privacidade />
      </Popup>
    </footer>
  )
}
