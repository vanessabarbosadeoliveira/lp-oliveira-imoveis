'use client'

import { useState, useEffect } from 'react'
import LeadForm from '@/components/LeadForm'
import RegisterForm from '@/components/auth/RegisterForm/RegisterForm'
import styles from './DualHeroCard.module.css'

type Tab = 'especialista' | 'plataforma'

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function DualHeroCard() {
  const [activeTab, setActiveTab] = useState<Tab>('especialista')

  useEffect(() => {
    const onTabSwitch = (e: Event) => {
      const tab = (e as CustomEvent<Tab>).detail
      setActiveTab(tab)
    }
    window.addEventListener('switch-hero-tab', onTabSwitch)
    return () => window.removeEventListener('switch-hero-tab', onTabSwitch)
  }, [])

  return (
    <div className={styles.card} id="opcoes">
      <div className={styles.tabs} role="tablist">
        <button
          id="tab-especialista"
          className={`${styles.tab} ${activeTab === 'especialista' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('especialista')}
          role="tab"
          aria-selected={activeTab === 'especialista'}
          type="button"
        >
          <span className={styles.tabIcon}><ChatIcon /></span>
          <span className={styles.tabContent}>
            <span className={styles.tabTitle}>Falar com especialista</span>
          </span>
        </button>
        <button
          id="tab-plataforma"
          className={`${styles.tab} ${activeTab === 'plataforma' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('plataforma')}
          role="tab"
          aria-selected={activeTab === 'plataforma'}
          type="button"
        >
          <span className={styles.tabIcon}><SearchIcon /></span>
          <span className={styles.tabContent}>
            <span className={styles.tabTitle}>Fazer pesquisa agora</span>
          </span>
        </button>
      </div>

      {activeTab === 'especialista' ? (
        <div className={styles.panel} role="tabpanel">
          <h2 className={styles.panelTitle}>Fale com um de nossos especialistas</h2>
          <p className={styles.panelDesc}>
            Preencha o formulário e nossa equipe entra em contato pelo WhatsApp para entender seu negócio e indicar o melhor ponto.
          </p>
          <LeadForm />
        </div>
      ) : (
        <div className={styles.panel} role="tabpanel">
          <h2 className={styles.panelTitle}>Crie sua conta e faça a pesquisa agora</h2>
          <p className={styles.panelDesc}>
            Acesse a plataforma Oliveira Imóveis, informe o bairro e segmento do seu negócio e receba a análise do ponto na hora.
          </p>
          <RegisterForm />
        </div>
      )}
    </div>
  )
}
