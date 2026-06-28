import Button from '@/components/simple/Button/Button'
import styles from './AnalysisHistoryTable.module.css'

type FormTemplate = { title: string; slug: string }

export type AnalysisHistoryRow = {
  id: string
  status: string
  updated_at: string
  form_templates: FormTemplate | null
}

interface AnalysisHistoryTableProps {
  rows: AnalysisHistoryRow[]
  getAnalysisHref?: (id: string) => string
}

const STATUS_LABEL: Record<string, string> = {
  submitted:  'Enviado',
  processing: 'Processando',
  complete:   'Concluído',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AnalysisHistoryTable({ rows, getAnalysisHref }: AnalysisHistoryTableProps) {
  const analysisHref = getAnalysisHref ?? ((id: string) => `/portal/analise/${id}`)
  if (rows.length === 0) {
    return <p className={styles.empty}>Nenhuma análise realizada ainda.</p>
  }

  const sorted = [...rows].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Ferramenta</th>
          <th>Data e hora</th>
          <th>Status</th>
          <th>Análise</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(row => (
          <tr key={row.id}>
            <td className={styles.toolName}>{row.form_templates?.title ?? '—'}</td>
            <td>{formatDate(row.updated_at)}</td>
            <td>
              <span className={`${styles.statusBadge}${row.status === 'processing' ? ` ${styles.processing}` : ''}`}>
                {STATUS_LABEL[row.status] ?? row.status}
              </span>
            </td>
            <td>
              {row.status === 'complete' && (
                <Button
                  href={analysisHref(row.id)}
                  variant="outline"
                  size="sm"
                >
                  Ver análise
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
