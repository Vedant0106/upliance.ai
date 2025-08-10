import type { FormField, FormData } from "./types"

export function calculateDerivedField(field: FormField, formData: FormData, allFields: FormField[]): any {
  if (!field.isDerived || !field.derivedConfig) {
    return undefined
  }

  const { parentFields, type, formula } = field.derivedConfig

  // Get parent field values
  const parentValues = parentFields.map((fieldId) => {
    const value = formData[fieldId]
    const parentField = allFields.find((f) => f.id === fieldId)
    return { fieldId, value, field: parentField }
  })

  // Check if all required parent values are available
  const hasAllValues = parentValues.every((pv) => pv.value !== undefined && pv.value !== null && pv.value !== "")

  if (!hasAllValues) {
    return ""
  }

  switch (type) {
    case "age":
      if (parentValues.length === 1 && parentValues[0].value) {
        const birthDate = new Date(parentValues[0].value)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }

        return age >= 0 ? age : 0
      }
      return 0

    case "sum":
      return parentValues.reduce((sum, pv) => {
        const num = Number.parseFloat(pv.value) || 0
        return sum + num
      }, 0)

    case "concat":
      return parentValues
        .map((pv) => String(pv.value || ""))
        .filter((val) => val.trim() !== "")
        .join(" ")

    case "custom":
      return evaluateCustomFormula(formula, parentValues, allFields)

    default:
      return ""
  }
}

function evaluateCustomFormula(
  formula: string,
  parentValues: Array<{ fieldId: string; value: any; field?: FormField }>,
  allFields: FormField[],
): any {
  if (!formula) return ""

  try {
    let processedFormula = formula

    // Replace field references with actual values
    parentValues.forEach((pv) => {
      if (pv.field) {
        const fieldName = pv.field.label.toLowerCase().replace(/\s+/g, "_")
        const fieldValue = Number.parseFloat(pv.value) || 0

        // Replace both field ID and field name references
        processedFormula = processedFormula.replace(new RegExp(`\\b${pv.fieldId}\\b`, "g"), fieldValue.toString())
        processedFormula = processedFormula.replace(new RegExp(`\\b${fieldName}\\b`, "g"), fieldValue.toString())
      }
    })

    // Basic formula evaluation (only allow safe operations)
    const safeFormula = processedFormula.replace(/[^0-9+\-*/.() ]/g, "")

    // Use Function constructor for safe evaluation
    const result = new Function(`"use strict"; return (${safeFormula})`)()

    return isNaN(result) ? "" : result
  } catch (error) {
    console.error("Formula evaluation error:", error)
    return ""
  }
}
