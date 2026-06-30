import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ClientesTable from './ClientesTable'

export const metadata: Metadata = {
  title: 'Clientes — Oliveira Imóveis',
}

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clientes } = await supabase
    .from('profiles')
    .select('id, full_name, email, whatsapp, pixel_id, status, created_at')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  const rows = (clientes ?? []) as Record<string, unknown>[]

  return <ClientesTable rows={rows} />
}
