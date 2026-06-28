'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveLeadAction(data: {
  nome: string
  email: string
  whatsapp: string
  negocio: string
  expansao: string
}): Promise<void> {
  const supabase = await createClient()
  await supabase.from('leads').insert(data)
}
