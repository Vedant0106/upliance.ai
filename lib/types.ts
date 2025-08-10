export type FieldType = "text" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date"

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "email" | "password" | "minValue" | "maxValue" | "pattern"
  value?: string | number
  message: string
}

export interface SelectOption {
  label: string
  value: string
}

export interface DerivedField {
  parentFields: string[]
  formula: string
  type: "age" | "sum" | "concat" | "custom"
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  required: boolean
  defaultValue?: string | number | boolean | string[]
  validation: ValidationRule[]
  options?: SelectOption[] // for select and radio
  isDerived?: boolean
  derivedConfig?: DerivedField
}

export interface FormSchema {
  id: string
  name: string
  fields: FormField[]
  createdAt: string
  updatedAt?: string
}

export interface FormData {
  [fieldId: string]: any
}
