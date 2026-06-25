import type { Metadata } from 'next'
import Privacidade from '@/components/popup/Privacidade/Privacidade'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Oliveira Imóveis',
  description: 'Como a Oliveira Imóveis coleta, utiliza e protege seus dados pessoais.',
}

export default function PrivacidadePage() {
  return <Privacidade />
}
