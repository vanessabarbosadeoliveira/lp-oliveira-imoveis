import Header from '../Header/Header'
import StructuredText from '../StructuredText/StructuredText'
import { Title, Text, Tag, Divider } from '../simple'
import styles from './LegalLayout.module.css'
import type { LegalPageData } from '../StructuredText/StructuredText'

export type { LegalPageData } from '../StructuredText/StructuredText'

interface LegalLayoutProps {
  data: LegalPageData
}

export default function LegalLayout({ data }: LegalLayoutProps) {
  return (
    <>
      <div>
        <a href="/" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar ao site
        </a>

        <Tag className={styles.tagSpacing}>{data.tag}</Tag>
        <Title as="h1" variant="display" className={styles.titleSpacing}>{data.title}</Title>
        <Text variant="meta" className={styles.metaSpacing}>{data.updatedAt}</Text>
        <Divider className={styles.dividerSpacing} />
        <StructuredText sections={data.sections} />
      </div>
    </>
  )
}
