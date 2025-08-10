import type { FormField, ValidationRule, FieldType } from "./types"

export function validateField(field: FormField, value: any): string | null {
  // First check if field is required (from the required toggle)
  if (field.required) {
    if (isEmpty(value)) {
      return `${field.label} is required`
    }
  }

  // For select and radio fields, check if they have a valid selection when required
  if (field.required && (field.type === "select" || field.type === "radio")) {
    if (!value || value === "") {
      return `Please select an option for ${field.label}`
    }
  }

  // For checkbox fields, check if at least one option is selected when required
  if (field.required && field.type === "checkbox") {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return `Please select at least one option for ${field.label}`
    }
  }

  // Then check other validation rules
  for (const rule of field.validation) {
    // Skip required rule here since we handled it above
    if (rule.type === "required") continue

    const error = validateRule(rule, value, field.type)
    if (error) return error
  }
  return null
}

function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string" && value.trim() === "") return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

function validateRule(rule: ValidationRule, value: any, fieldType: string): string | null {
  // Skip validation if value is empty and field is not required
  if (isEmpty(value) && rule.type !== "required") {
    return null
  }

  switch (rule.type) {
    case "required":
      if (isEmpty(value)) {
        return rule.message
      }
      break

    case "minLength":
      if (value && typeof value === "string" && value.length < (rule.value as number)) {
        return rule.message
      }
      break

    case "maxLength":
      if (value && typeof value === "string" && value.length > (rule.value as number)) {
        return rule.message
      }
      break

    case "minValue":
      if (value !== null && value !== undefined && value !== "") {
        const numValue = Number(value)
        if (!isNaN(numValue) && numValue < (rule.value as number)) {
          return rule.message
        }
      }
      break

    case "maxValue":
      if (value !== null && value !== undefined && value !== "") {
        const numValue = Number(value)
        if (!isNaN(numValue) && numValue > (rule.value as number)) {
          return rule.message
        }
      }
      break

    case "email":
      if (value && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return rule.message
        }
      }
      break

    case "password":
      if (value && typeof value === "string") {
        const errors = []

        if (value.length < 8) {
          errors.push("at least 8 characters")
        }
        if (!/[A-Z]/.test(value)) {
          errors.push("one uppercase letter")
        }
        if (!/[a-z]/.test(value)) {
          errors.push("one lowercase letter")
        }
        if (!/\d/.test(value)) {
          errors.push("one number")
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          errors.push("one special character")
        }

        if (errors.length > 0) {
          return `Password must contain ${errors.join(", ")}`
        }
      }
      break

    case "pattern":
      if (value && typeof value === "string" && rule.value) {
        try {
          const regex = new RegExp(rule.value as string)
          if (!regex.test(value)) {
            return rule.message
          }
        } catch (e) {
          console.error("Invalid regex pattern:", rule.value)
          return "Invalid pattern validation"
        }
      }
      break
  }

  return null
}

// Helper function to get available validation rules for each field type
export function getAvailableValidationRules(fieldType: FieldType): ValidationRule["type"][] {
  const baseRules: Record<FieldType, ValidationRule["type"][]> = {
    text: ["minLength", "maxLength", "email", "password", "pattern"],
    number: ["minValue", "maxValue"],
    textarea: ["minLength", "maxLength"],
    select: [], // Select validation is handled by required field
    radio: [], // Radio validation is handled by required field
    checkbox: [], // Checkbox validation is handled by required field
    date: [], // Date validation can be extended later
  }

  return baseRules[fieldType] || []
}

// Helper function to get default validation messages
export function getDefaultValidationMessage(ruleType: ValidationRule["type"], fieldLabel: string): string {
  const messages: Record<ValidationRule["type"], string> = {
    required: `${fieldLabel} is required`,
    minLength: `${fieldLabel} must be at least {value} characters long`,
    maxLength: `${fieldLabel} must not exceed {value} characters`,
    minValue: `${fieldLabel} must be at least {value}`,
    maxValue: `${fieldLabel} must not exceed {value}`,
    email: `Please enter a valid email address`,
    password: `Password must meet security requirements`,
    pattern: `${fieldLabel} format is invalid`,
  }

  return messages[ruleType] || `${fieldLabel} is invalid`
}
