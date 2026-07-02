import Button from '@/components/simple/Button/Button'

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  'Olá! Vim pelo site da Oliveira Imóveis e gostaria de ajuda para encontrar uma loja no ponto certo para o meu negócio.'
)}`

export default function WhatsAppButton() {
  return (
    <Button href={WHATSAPP_HREF} variant="solid" size="md">
      Falar com especialista
    </Button>
  )
}
