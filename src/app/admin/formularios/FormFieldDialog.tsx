'use client'

import { useEffect, useState } from 'react'
import Popup from '@/components/popup/Popup/Popup'
import TextField from '@/components/simple/TextField/TextField'
import TextArea from '@/components/simple/TextArea/TextArea'
import Dropdown from '@/components/simple/Dropdown/Dropdown'
import Checkbox from '@/components/simple/Checkbox/Checkbox'
import Button from '@/components/simple/Button/Button'
import type { FormField } from './types'
import styles from './formularios.module.css'

const FIELD_TYPE_OPTIONS = [
  { label: 'Texto', value: 'text' },
  { label: 'Área de texto', value: 'textarea' },
  { label: 'Número', value: 'number' },
  { label: 'Moeda', value: 'currency' },
  { label: 'Seleção', value: 'select' },
  { label: 'Múltipla seleção', value: 'multiselect' },
  { label: 'Localização', value: 'location' },
  { label: 'Intervalo', value: 'range' },
]

interface FormFieldDialogProps {
  isOpen: boolean
  field: FormField | null
  onClose: () => void
  onSave: (data: Partial<FormField>) => Promise<void>
  loading: boolean
  error: string | null
}

export default function FormFieldDialog({
  isOpen,
  field,
  onClose,
  onSave,
  loading,
  error,
}: FormFieldDialogProps) {
  const [fieldKey, setFieldKey] = useState('')
  const [label, setLabel] = useState('')
  const [fieldType, setFieldType] = useState<FormField['field_type']>('text')
  const [placeholder, setPlaceholder] = useState('')
  const [hint, setHint] = useState('')
  const [required, setRequired] = useState(true)
  const [optionsJson, setOptionsJson] = useState('')

  useEffect(() => {
    if (!isOpen) return
    if (field) {
      setFieldKey(field.key)
      setLabel(field.label)
      setFieldType(field.field_type)
      setPlaceholder(field.placeholder ?? '')
      setHint(field.hint ?? '')
      setRequired(field.required)
      setOptionsJson(field.options ? JSON.stringify(field.options, null, 2) : '')
    } else {
      setFieldKey('')
      setLabel('')
      setFieldType('text')
      setPlaceholder('')
      setHint('')
      setRequired(true)
      setOptionsJson('')
    }
  }, [field, isOpen])

  const showOptions = fieldType === 'select' || fieldType === 'multiselect'
  const isCreating = isOpen && field === null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let parsedOptions: { label: string; value: string }[] | null = null
    if (showOptions && optionsJson.trim()) {
      try {
        parsedOptions = JSON.parse(optionsJson)
      } catch {
        return
      }
    }
    await onSave({
      ...(isCreating && { key: fieldKey }),
      label,
      field_type: fieldType,
      placeholder: placeholder || null,
      hint: hint || null,
      required,
      options: showOptions ? parsedOptions : null,
    })
  }

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={isCreating ? 'Novo Campo' : 'Editar Campo'}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.dialogForm}>
          {isCreating ? (
            <TextField
              label="Chave"
              value={fieldKey}
              onChange={e => setFieldKey(e.target.value)}
              required
            />
          ) : (
            <TextField
              label="Chave (somente leitura)"
              value={field?.key ?? ''}
              readOnly
              disabled
              className={styles.readOnly}
            />
          )}
          <TextField
            label="Rótulo"
            value={label}
            onChange={e => setLabel(e.target.value)}
            required
          />
          <Dropdown
            label="Tipo"
            options={FIELD_TYPE_OPTIONS}
            value={fieldType}
            onChange={v => setFieldType(v as FormField['field_type'])}
            required
          />
          <TextField
            label="Placeholder"
            value={placeholder}
            onChange={e => setPlaceholder(e.target.value)}
          />
          <TextField
            label="Dica"
            value={hint}
            onChange={e => setHint(e.target.value)}
          />
          <Checkbox
            label="Obrigatório"
            checked={required}
            onChange={e => setRequired(e.target.checked)}
          />
          {showOptions && (
            <div>
              <TextArea
                label="Opções (JSON)"
                value={optionsJson}
                onChange={e => setOptionsJson(e.target.value)}
                rows={5}
              />
              <span className={styles.hint}>
                Formato: {`[{"label":"Texto","value":"valor"}]`}
              </span>
            </div>
          )}
          {error && (
            <p className={styles.dialogError}>{error}</p>
          )}
        </div>
        <div className={styles.dialogFooter}>
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="solid" size="sm" disabled={loading}>
            {loading ? 'Salvando…' : isCreating ? 'Criar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Popup>
  )
}
