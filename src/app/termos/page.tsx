import type { Metadata } from 'next'
import Termos from '@/components/popup/Termos/Termos'

export const metadata: Metadata = {
  title: 'Termos de Uso — Oliveira Imóveis',
  description: 'Termos que regulam o acesso às páginas, formulários e canais digitais da Oliveira Imóveis.',
}

export default function TermosPage() {
  return <Termos />
}
