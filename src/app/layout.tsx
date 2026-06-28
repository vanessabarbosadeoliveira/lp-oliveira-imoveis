import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import PixelCapture from '@/components/PixelCapture/PixelCapture'

// @ts-ignore: global stylesheet import is handled by Next.js (don't remove this comment)
import '../css/globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Oliveira Imóveis — Expansão Comercial',
  description:
    'Receba gratuitamente uma análise do ponto, do entorno e do potencial comercial antes de expandir.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <PixelCapture />
        {children}
      </body>
    </html>
  )
}
