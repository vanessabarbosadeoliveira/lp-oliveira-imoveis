'use client'

import { useState, useMemo } from 'react'
import styles from './Table.module.css'

export type ColumnType = 'string' | 'number' | 'date' | 'email' | 'phone'

export interface Column {
  key: string
  label: string
  type: ColumnType
  sortable?: boolean
  render?: (row: Record<string, unknown>) => React.ReactNode
}

export interface TableProps {
  columns: Column[]
  rows: Record<string, unknown>[]
  pageSize?: number
  emptyMessage?: string
}

function renderCell(value: unknown, type: ColumnType): React.ReactNode {
  if (value == null || value === '') return <span className={styles.empty}>—</span>
  switch (type) {
    case 'date':
      return new Date(value as string).toLocaleDateString('pt-BR')
    case 'email':
      return <a href={`mailto:${value}`} className={styles.emailLink}>{String(value)}</a>
    case 'number':
      return Number(value).toLocaleString('pt-BR')
    default:
      return String(value)
  }
}

function compareValues(a: unknown, b: unknown, type: ColumnType): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (type === 'number') return Number(a) - Number(b)
  if (type === 'date') return new Date(a as string).getTime() - new Date(b as string).getTime()
  return String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' })
}

export default function Table({
  columns,
  rows,
  pageSize = 10,
  emptyMessage = 'Nenhum resultado encontrado.',
}: TableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  function handleSort(col: Column) {
    if (!col.sortable) return
    if (sortKey === col.key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(col.key)
      setSortDir('asc')
    }
    setPage(0)
  }

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    const col = columns.find(c => c.key === sortKey)
    if (!col) return rows
    return [...rows].sort((a, b) => {
      const cmp = compareValues(a[sortKey], b[sortKey], col.type)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir, columns])

  const totalPages = Math.ceil(sortedRows.length / pageSize)
  const pageRows = sortedRows.slice(page * pageSize, (page + 1) * pageSize)
  const from = sortedRows.length === 0 ? 0 : page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, sortedRows.length)

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              {columns.map(col => {
                const isActive = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    className={[
                      styles.th,
                      col.sortable ? styles.sortable : undefined,
                      isActive ? styles.thActive : undefined,
                      col.type === 'number' ? styles.alignRight : undefined,
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleSort(col)}
                    aria-sort={
                      isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                  >
                    <span className={styles.thInner}>
                      {col.label}
                      {col.sortable && isActive && (
                        <span className={styles.sortIcon} aria-hidden="true">
                          {sortDir === 'asc' ? '↓' : '↑'}
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyRow}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr key={(row.id as string) ?? i} className={styles.tr}>
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={[
                        styles.td,
                        col.type === 'number' ? styles.alignRight : undefined,
                        col.type === 'email' ? styles.tdEmail : undefined,
                      ].filter(Boolean).join(' ')}
                    >
                      {col.render ? col.render(row) : renderCell(row[col.key], col.type)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sortedRows.length > pageSize && (
        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            {from}–{to} de {sortedRows.length}
          </span>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
            >
              ← Anterior
            </button>
            <span className={styles.pageIndicator}>
              {page + 1} / {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
