'use client'

import StepForm from '@/components/StepForm'
import { generateResearchAction } from './actions'
import type { TemplateField } from './page'

interface Props {
  responseId: string
  fields: TemplateField[]
  existingValues: Record<string, string>
}

export default function PesquisaForm({ responseId, fields, existingValues }: Props) {
  return (
    <StepForm
      fields={fields}
      existingValues={existingValues}
      action={generateResearchAction}
      responseId={responseId}
    />
  )
}
