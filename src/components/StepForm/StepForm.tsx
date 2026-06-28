'use client'

import { useState, useActionState, useId } from 'react'
import { TextField, TextArea, Button } from '@/components/simple'
import styles from './StepForm.module.css'

export interface StepFormField {
  id: string
  label: string
  field_type: string
  placeholder?: string | null
  hint?: string | null
  required?: boolean
  options?: Array<{ label: string; value: string }> | null
}

interface Props {
  fields: StepFormField[]
  existingValues: Record<string, string>
  action: (prevState: string | null, formData: FormData) => Promise<string | null>
  responseId: string
  submitLabel?: string
  submittingLabel?: string
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: StepFormField
  value: string
  onChange: (v: string) => void
}) {
  const shared = {
    name: `field_${field.id}`,
    required: field.required,
    placeholder: field.placeholder ?? undefined,
  }

  if (field.field_type === 'textarea') {
    return (
      <div className="form-field">
        <TextArea
          label={field.label}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          {...shared}
        />
        {field.hint && <span className={styles.hint}>{field.hint}</span>}
      </div>
    )
  }

  if (field.field_type === 'number') {
    return (
      <TextField
        label={field.label}
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(e.target.value)}
        hint={field.hint ?? undefined}
        {...shared}
      />
    )
  }

  if (field.field_type === 'currency') {
    return (
      <TextField
        label={field.label}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^\d.,]/g, ''))}
        hint={field.hint ?? 'Valor em R$, ex: 15000'}
        {...shared}
      />
    )
  }

  return (
    <TextField
      label={field.label}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      hint={field.hint ?? undefined}
      {...shared}
    />
  )
}

export default function StepForm({
  fields,
  existingValues,
  action,
  responseId,
  submitLabel = 'Gerar análise',
  submittingLabel = 'Gerando análise…',
}: Props) {
  const formId = useId()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.id, existingValues[f.id] ?? '']))
  )
  const [error, formAction, isPending] = useActionState(action, null)

  const current = fields[step]
  const total = fields.length
  const isFirst = step === 0
  const isLast = step === total - 1
  const progressPct = total > 1 ? (step / (total - 1)) * 100 : 100

  return (
    <div className={styles.container}>
      {/* Timeline */}
      <div className={styles.timelineWrapper}>
        <div className={styles.timeline} aria-hidden="true">
          <div className={styles.track}>
            <div className={styles.progress} style={{ width: `${progressPct}%` }} />
          </div>
          {fields.map((f, i) => (
            <button
              key={f.id}
              type="button"
              className={[
                styles.dot,
                i < step ? styles.dotDone : '',
                i === step ? styles.dotActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setStep(i)}
              tabIndex={-1}
            />
          ))}
        </div>
        <p className={styles.stepCount}>
          {step + 1} <span>de</span> {total}
        </p>
      </div>

      {/* Form contains only inputs — no buttons — to prevent accidental submission */}
      <form id={formId} action={formAction} className={styles.form}>
        <input type="hidden" name="response_id" value={responseId} />

        {fields.map(f =>
          f.id !== current.id ? (
            <input key={f.id} type="hidden" name={`field_${f.id}`} value={values[f.id] ?? ''} />
          ) : null
        )}

        <div className={styles.question}>
          <FieldInput
            field={current}
            value={values[current.id] ?? ''}
            onChange={v => setValues(prev => ({ ...prev, [current.id]: v }))}
          />
        </div>

      </form>

      {/* Navigation lives outside the form so type="button" buttons can never
          accidentally submit. The submit button uses form={formId} to associate. */}
      <div className={styles.navGroup}>
        <div className={styles.nav}>
          {!isFirst && (
            <Button type="button" variant="outline" size="md" onClick={() => setStep(s => s - 1)} disabled={isPending}>
              Anterior
            </Button>
          )}
          {isLast ? (
            <Button key="submit" type="submit" form={formId} size="lg" disabled={isPending}>
              {isPending && <span className={styles.spinner} aria-hidden="true" />}
              {isPending ? submittingLabel : submitLabel}
            </Button>
          ) : (
            <Button key="next" type="button" size="md" onClick={() => setStep(s => s + 1)} disabled={isPending}>
              Próxima
            </Button>
          )}
        </div>
        {isLast && isPending && (
          <p className={styles.submitNote} role="status" aria-live="polite">
            Isso pode levar alguns instantes. Não feche a página.
          </p>
        )}
        {isLast && error && !isPending && (
          <p className={styles.submitError}>{error}</p>
        )}
      </div>
    </div>
  )
}
