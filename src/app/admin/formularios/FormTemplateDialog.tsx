'use client'

import { useEffect, useRef, useState } from 'react'
import Popup from '@/components/popup/Popup/Popup'
import TextField from '@/components/simple/TextField/TextField'
import TextArea from '@/components/simple/TextArea/TextArea'
import Checkbox from '@/components/simple/Checkbox/Checkbox'
import Button from '@/components/simple/Button/Button'
import type { FormTemplate } from './types'
import styles from './formularios.module.css'

interface FormTemplateDialogProps {
  isOpen: boolean
  template: FormTemplate | null
  fieldKeys: string[]
  onClose: () => void
  onSave: (data: Partial<FormTemplate>) => Promise<void>
  loading: boolean
  error: string | null
}

export default function FormTemplateDialog({
  isOpen,
  template,
  fieldKeys,
  onClose,
  onSave,
  loading,
  error,
}: FormTemplateDialogProps) {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [llmPromptTemplate, setLlmPromptTemplate] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isPublic, setIsPublic] = useState(false)

  const promptRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isOpen) return
    if (template) {
      setSlug(template.slug)
      setTitle(template.title)
      setDescription(template.description ?? '')
      setLlmPromptTemplate(template.llm_prompt_template ?? '')
      setSortOrder(template.sort_order)
      setIsPublic(template.public)
    } else {
      setSlug('')
      setTitle('')
      setDescription('')
      setLlmPromptTemplate('')
      setSortOrder(0)
      setIsPublic(false)
    }
  }, [template, isOpen])

  const isCreating = isOpen && template === null

  function insertKey(key: string) {
    const el = promptRef.current
    const token = `{{${key}}}`
    if (!el) {
      setLlmPromptTemplate(prev => prev + token)
      return
    }
    const start = el.selectionStart ?? llmPromptTemplate.length
    const end = el.selectionEnd ?? llmPromptTemplate.length
    const newValue = llmPromptTemplate.slice(0, start) + token + llmPromptTemplate.slice(end)
    setLlmPromptTemplate(newValue)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + token.length
      el.focus()
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSave({
      ...(isCreating && { slug }),
      title,
      description: description || null,
      llm_prompt_template: llmPromptTemplate || null,
      sort_order: sortOrder,
      public: isPublic,
    })
  }

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={isCreating ? 'Novo Formulário' : 'Editar Formulário'}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.dialogForm}>
          {isCreating ? (
            <TextField
              label="Slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
          ) : (
            <TextField
              label="Slug (somente leitura)"
              value={template?.slug ?? ''}
              readOnly
              disabled
              className={styles.readOnly}
            />
          )}
          <TextField
            label="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <TextArea
            label="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
          {fieldKeys.length > 0 && (
            <div className={styles.fieldKeys}>
              <span className={styles.fieldKeysLabel}>Campos disponíveis</span>
              <div className={styles.fieldKeyChips}>
                {fieldKeys.map(key => (
                  <button
                    key={key}
                    type="button"
                    className={styles.fieldKeyChip}
                    onClick={() => insertKey(key)}
                    title={`Inserir {{${key}}}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          )}
          <TextArea
            ref={promptRef}
            label="Prompt do LLM"
            value={llmPromptTemplate}
            onChange={e => setLlmPromptTemplate(e.target.value)}
            rows={10}
          />
          <TextField
            label="Ordem"
            type="number"
            value={String(sortOrder)}
            onChange={e => setSortOrder(Number(e.target.value))}
          />
          <Checkbox
            id="template-public"
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
            label="Visível no portal do cliente"
          />
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
