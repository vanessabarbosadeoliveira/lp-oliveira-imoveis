import { ReactNode } from 'react'
import { Title, Text } from '../simple'
import styles from './StructuredText.module.css'

export type TextBlock = {
  type: 'paragraph'
  content: ReactNode
}

export type ListBlock = {
  type: 'list'
  items: ReactNode[]
}

export type ContentBlock = TextBlock | ListBlock

export type Section = {
  heading?: string
  lead?: TextBlock | null
  blocks: ContentBlock[]
}

export type LegalPageData = {
  tag: string
  title: string
  updatedAt: string
  sections: Section[]
}

interface StructuredTextProps {
  sections: Section[]
  className?: string
}

export default function StructuredText({ sections, className }: StructuredTextProps) {
  const classes = [styles.body, className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {sections.map((section, i) => (
        <article key={i} className={styles.section}>
          {section.heading && (
            <Title as="h2" variant="section">{section.heading}</Title>
          )}
          {section.lead && <Text variant="body">{section.lead.content}</Text>}
          {section.blocks.map((block, j) => {
            if (block.type === 'paragraph') {
              return <Text key={j} variant="body">{block.content}</Text>
            }
            return (
              <ul key={j} className={styles.list}>
                {block.items.map((item, k) => (
                  <Text key={k} as="li" variant="body" className={styles.item}>{item}</Text>
                ))}
              </ul>
            )
          })}
        </article>
      ))}
    </div>
  )
}
