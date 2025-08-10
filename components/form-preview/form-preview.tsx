"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import type { FormData } from "@/lib/types"
import { FormFieldRenderer } from "./form-field-renderer"
import { validateField } from "@/lib/validation"
import { calculateDerivedField } from "@/lib/derivedFieldCalculator"

export function FormPreview() {
  const currentForm = useAppSelector((state) => state.formBuilder.currentForm)
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate derived fields
  useEffect(() => {
    const newFormData = { ...formData }
    let hasChanges = false

    currentForm.fields.forEach((field) => {
      if (field.isDerived && field.derivedConfig) {
        const calculatedValue = calculateDerivedField(field, formData, currentForm.fields)

        if (newFormData[field.id] !== calculatedValue) {
          newFormData[field.id] = calculatedValue
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      setFormData(newFormData)
    }
  }, [formData, currentForm.fields])

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))

    // Clear error for this field when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Validate all fields (including required fields)
    currentForm.fields.forEach((field) => {
      if (!field.isDerived) {
        const error = validateField(field, formData[field.id])
        if (error) {
          newErrors[field.id] = error
        }
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!\n\nData:\n" + JSON.stringify(formData, null, 2))
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{currentForm.name || "Form Preview"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentForm.fields.map((field) => (
            <div key={field.id} id={field.id}>
              <FormFieldRenderer
                field={field}
                value={formData[field.id]}
                error={errors[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset Form
            </Button>
            <Button type="submit">Submit Form</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
