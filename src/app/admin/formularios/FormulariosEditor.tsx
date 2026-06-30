'use client'

import { useState, useMemo, useTransition } from 'react'
import Table from '@/components/simple/Table/Table'
import type { Column } from '@/components/simple/Table/Table'
import RowActions from '@/components/admin/RowActions'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import Button from '@/components/simple/Button/Button'
import FormFieldDialog from './FormFieldDialog'
import FormTemplateDialog from './FormTemplateDialog'
import {
  createFormField,
  createFormTemplate,
  updateFormField,
  deleteFormField,
  updateFormTemplate,
  deleteFormTemplate,
} from './actions'
import type { FormField, FormTemplate } from './types'
import styles from './formularios.module.css'

interface FormulariosEditorProps {
  fields: FormField[]
  templates: FormTemplate[]
  usedFieldIds: string[]
  defaultTab?: 'fields' | 'templates'
  title: string
  subtitle: string
}

export default function FormulariosEditor({
  fields,
  templates,
  usedFieldIds: usedFieldIdsArr,
  defaultTab = 'fields',
  title,
  subtitle,
}: FormulariosEditorProps) {
  const [editField, setEditField] = useState<FormField | null>(null)
  const [editTemplate, setEditTemplate] = useState<FormTemplate | null>(null)
  const [creatingField, setCreatingField] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'field' | 'template'
    id: string
    name: string
  } | null>(null)
  const [fieldDialogError, setFieldDialogError] = useState<string | null>(null)
  const [templateDialogError, setTemplateDialogError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [, startTransition] = useTransition()

  const [localFields, setLocalFields] = useState<FormField[]>(fields)
  const [localTemplates, setLocalTemplates] = useState<FormTemplate[]>(templates)

  const usedFieldIds = useMemo(() => new Set(usedFieldIdsArr), [usedFieldIdsArr])

  const fieldColumns: Column[] = [
    { key: 'key', label: 'Chave', type: 'string', sortable: true },
    { key: 'label', label: 'Rótulo', type: 'string', sortable: true },
    { key: 'field_type', label: 'Tipo', type: 'string', sortable: true },
    {
      key: 'required',
      label: 'Obrigatório',
      type: 'string',
      render: (row) => (row.required ? 'Sim' : 'Não'),
    },
    {
      key: 'actions',
      label: 'Ações',
      type: 'string',
      render: (row) => (
        <RowActions
          onEdit={() => {
            setFieldDialogError(null)
            setEditField(row as unknown as FormField)
          }}
          onDelete={() =>
            setDeleteTarget({
              type: 'field',
              id: row.id as string,
              name: row.label as string,
            })
          }
          deleteDisabled={usedFieldIds.has(row.id as string)}
          deleteTitle={
            usedFieldIds.has(row.id as string) ? 'Em uso em formulários' : undefined
          }
        />
      ),
    },
  ]

  const templateColumns: Column[] = [
    { key: 'slug', label: 'Slug', type: 'string', sortable: true },
    { key: 'title', label: 'Título', type: 'string', sortable: true },
    { key: 'sort_order', label: 'Ordem', type: 'number', sortable: true },
    {
      key: 'actions',
      label: 'Ações',
      type: 'string',
      render: (row) => (
        <RowActions
          onEdit={() => {
            setTemplateDialogError(null)
            setEditTemplate(row as unknown as FormTemplate)
          }}
          onDelete={() =>
            setDeleteTarget({
              type: 'template',
              id: row.id as string,
              name: row.title as string,
            })
          }
        />
      ),
    },
  ]

  async function handleCreateField(data: Partial<FormField>) {
    setSaving(true)
    const result = await createFormField(data as Omit<FormField, 'id' | 'created_at'>)
    setSaving(false)
    if (result.error) {
      setFieldDialogError(result.error)
      return
    }
    startTransition(() => {
      if (result.data) setLocalFields(prev => [...prev, result.data!])
      setCreatingField(false)
      setFieldDialogError(null)
    })
  }

  async function handleSaveField(data: Partial<FormField>) {
    if (!editField) return
    const id = editField.id
    setSaving(true)
    const err = await updateFormField(id, data as Omit<FormField, 'id' | 'key' | 'created_at'>)
    setSaving(false)
    if (err) {
      setFieldDialogError(err)
      return
    }
    startTransition(() => {
      setLocalFields(prev => prev.map(f => (f.id === id ? { ...f, ...data } : f)))
      setEditField(null)
      setFieldDialogError(null)
    })
  }

  async function handleCreateTemplate(data: Partial<FormTemplate>) {
    setSaving(true)
    const result = await createFormTemplate(data as Omit<FormTemplate, 'id' | 'created_at'>)
    setSaving(false)
    if (result.error) {
      setTemplateDialogError(result.error)
      return
    }
    startTransition(() => {
      if (result.data) setLocalTemplates(prev => [...prev, result.data!])
      setCreatingTemplate(false)
      setTemplateDialogError(null)
    })
  }

  async function handleSaveTemplate(data: Partial<FormTemplate>) {
    if (!editTemplate) return
    const id = editTemplate.id
    setSaving(true)
    const err = await updateFormTemplate(id, data as Omit<FormTemplate, 'id' | 'slug' | 'created_at'>)
    setSaving(false)
    if (err) {
      setTemplateDialogError(err)
      return
    }
    startTransition(() => {
      setLocalTemplates(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)))
      setEditTemplate(null)
      setTemplateDialogError(null)
    })
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    const { type, id } = deleteTarget
    setDeleting(true)
    const err =
      type === 'field'
        ? await deleteFormField(id)
        : await deleteFormTemplate(id)
    setDeleting(false)
    if (err) {
      alert(err)
      setDeleteTarget(null)
      return
    }
    startTransition(() => {
      if (type === 'field') {
        setLocalFields(prev => prev.filter(f => f.id !== id))
      } else {
        setLocalTemplates(prev => prev.filter(t => t.id !== id))
      }
      setDeleteTarget(null)
    })
  }

  const fieldRows = localFields as unknown as Record<string, unknown>[]
  const templateRows = localTemplates as unknown as Record<string, unknown>[]

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {defaultTab === 'fields' && (
          <Button
            variant="solid"
            size="sm"
            onClick={() => { setFieldDialogError(null); setCreatingField(true) }}
          >
            Novo Campo
          </Button>
        )}
        {defaultTab === 'templates' && (
          <Button
            variant="solid"
            size="sm"
            onClick={() => { setTemplateDialogError(null); setCreatingTemplate(true) }}
          >
            Novo Formulário
          </Button>
        )}
      </div>

      {defaultTab === 'fields' && (
        <Table
          columns={fieldColumns}
          rows={fieldRows}
          emptyMessage="Nenhum campo cadastrado."
        />
      )}

      {defaultTab === 'templates' && (
        <Table
          columns={templateColumns}
          rows={templateRows}
          emptyMessage="Nenhum formulário cadastrado."
        />
      )}

      <FormFieldDialog
        isOpen={editField !== null || creatingField}
        field={editField}
        onClose={() => {
          setEditField(null)
          setCreatingField(false)
          setFieldDialogError(null)
        }}
        onSave={editField ? handleSaveField : handleCreateField}
        loading={saving}
        error={fieldDialogError}
      />

      <FormTemplateDialog
        isOpen={editTemplate !== null || creatingTemplate}
        template={editTemplate}
        fieldKeys={localFields.map(f => f.key)}
        onClose={() => {
          setEditTemplate(null)
          setCreatingTemplate(false)
          setTemplateDialogError(null)
        }}
        onSave={editTemplate ? handleSaveTemplate : handleCreateTemplate}
        loading={saving}
        error={templateDialogError}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget?.type === 'template'
            ? 'Excluir formulário'
            : 'Excluir campo'
        }
        message={
          deleteTarget?.type === 'template' ? (
            <>
              Tem certeza que deseja excluir o formulário{' '}
              <strong>{deleteTarget?.name}</strong>? Todos os campos vinculados a
              ele também serão desvinculados.
            </>
          ) : (
            <>
              Tem certeza que deseja excluir o campo{' '}
              <strong>{deleteTarget?.name}</strong>?
            </>
          )
        }
        confirmLabel="Excluir"
        loading={deleting}
      />
    </div>
  )
}
