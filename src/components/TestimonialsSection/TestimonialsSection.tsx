import { Section, Card, Tag, Title, Text } from '@/components/simple'
import styles from './TestimonialsSection.module.css'

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z" />
    </svg>
  )
}

const TESTIMONIALS = [
  {
    stars: 5,
    text: 'Em menos de 1 ano no Centro Comercial Iracema, nosso faturamento cresceu 30%. O ecossistema que a Oliveira Imóveis criou aqui faz toda a diferença.',
    initial: 'D',
    name: 'Davi',
    biz: 'Eletro Ferragens Miller · 30 anos na Serra',
    result: '+30% de faturamento em menos de 1 ano',
  },
  {
    stars: 5,
    text: 'Boa localidade e boa relação entre os lojistas e com a Oliveira Imóveis, que parecem sempre interessados em melhorar o local.',
    initial: 'W',
    name: 'Walter Junior',
    biz: 'Robust Suplementos · Serra, BH',
    result: 'Ambiente colaborativo entre lojistas',
  },
  {
    stars: 5,
    text: 'A segurança foi o que mais nos surpreendeu. Estamos na Serra há quase 10 anos e a diferença em relação ao ponto anterior foi enorme. O fluxo constante trouxe muito mais tranquilidade.',
    initial: 'L',
    name: 'Lojista do Iracema',
    biz: 'Quase 10 anos na Serra · BH',
    result: 'Segurança e fluxo constante no ponto',
  },
]

export default function TestimonialsSection() {
  return (
    <Section variant="alt">
      <Tag>Depoimentos reais</Tag>
      <Title variant="display" className={styles.heading}>
        Quem já está no <em>ecossistema</em><br />fala por si
      </Title>

      <div className={styles.grid}>
        {TESTIMONIALS.map(t => (
          <Card key={t.name} className={styles.card}>
            <div className={styles.quoteIcon}><QuoteIcon /></div>
            <div className={styles.stars} aria-label={`${t.stars} estrelas`}>
              {Array.from({ length: t.stars }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <Text variant="body" className={styles.text}>{t.text}</Text>
            <div className={styles.author}>
              <div className={styles.avatar} aria-hidden="true">{t.initial}</div>
              <div>
                <Text variant="body" className={styles.name}>{t.name}</Text>
                <Text variant="meta">{t.biz}</Text>
              </div>
            </div>
            <div className={styles.result}>
              <Text variant="meta">{t.result}</Text>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
