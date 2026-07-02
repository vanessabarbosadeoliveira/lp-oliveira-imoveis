export interface FormField {
  id: string
  key: string
  label: string
  field_type: 'text' | 'textarea' | 'number' | 'currency' | 'select' | 'multiselect' | 'location' | 'range'
  options: { label: string; value: string }[] | null
  placeholder: string | null
  hint: string | null
  required: boolean
  created_at: string
}

export interface FormTemplate {
  id: string
  slug: string
  title: string
  description: string | null
  llm_prompt_template: string | null
  sort_order: number
  public: boolean
  created_at: string
}
