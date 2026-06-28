'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Title, Text, Table } from '@/components/simple'
import type { Column } from '@/components/simple'
import styles from './clientes.module.css'

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const COLUMNS: Column[] = [
  {
    key: 'full_name',
    label: 'Perfil',
    type: 'string',
    sortable: true,
    render: (row) => (
      <Link href={`/admin/clientes/${row.id}`} className={styles.profileCell}>
        <span className={styles.profileCellIcon}><ProfileIcon /></span>
        <span>{String(row.full_name ?? '—')}</span>
      </Link>
    ),
  },
  { key: 'email',      label: 'E-mail',        type: 'email',  sortable: true  },
  { key: 'whatsapp',   label: 'WhatsApp',      type: 'phone',  sortable: false },
  { key: 'pixel_id',   label: 'Pixel ID',      type: 'string', sortable: false },
  {
    key: 'created_at',
    label: 'Cadastrado em',
    type: 'date',
    sortable: true,
    render: (row) =>
      row.created_at
        ? new Date(row.created_at as string).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
        : '—',
  },
]

interface ClientesTableProps {
  rows: Record<string, unknown>[]
}

export default function ClientesTable({ rows }: ClientesTableProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(row => {
      const name  = String(row.full_name ?? '').toLowerCase()
      const phone = String(row.whatsapp  ?? '').toLowerCase()
      const email = String(row.email     ?? '').toLowerCase()
      const pixel = String(row.pixel_id  ?? '').toLowerCase()
      return name.includes(q) || phone.includes(q) || email.includes(q) || pixel.includes(q)
    })
  }, [rows, query])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Title as="h1" variant="section">Clientes</Title>
          <Text variant="muted">
            {filtered.length} cadastrado{filtered.length !== 1 ? 's' : ''}
            {query && rows.length !== filtered.length && ` de ${rows.length}`}
          </Text>
        </div>
        <input
          className={styles.search}
          type="search"
          placeholder="Buscar por nome, telefone, e-mail ou pixel ID…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Buscar clientes"
        />
      </div>
      <Table
        columns={COLUMNS}
        rows={filtered}
        pageSize={15}
        emptyMessage={query ? 'Nenhum cliente encontrado para essa busca.' : 'Nenhum cliente cadastrado ainda.'}
      />
    </div>
  )
}
