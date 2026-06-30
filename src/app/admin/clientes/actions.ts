'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

export type ClientStatus = 'contacted' | 'not_contacted'

export async function updateClientStatus(
  id: string,
  status: ClientStatus
): Promise<string | null> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)
  if (error) return error.message
  revalidatePath('/admin/clientes')
  return null
}
