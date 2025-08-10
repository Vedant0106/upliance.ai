"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormField } from "@/lib/types"

interface FormFieldRendererProps {
  field: FormField
  value: any
  error?: string
  onChange: (value: any) => void
}

export function FormFieldRenderer({ field, value, error, onChange }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.defaultValue as string}
            disabled={field.isDerived}
            className={error ? "border-red-500" : ""}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.defaultValue as string}
            disabled={field.isDerived}
            className={error ? "border-red-500" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.defaultValue as string}
            disabled={field.isDerived}
            className={error ? "border-red-500" : ""}
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange} disabled={field.isDerived}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup value={value || ""} onValueChange={onChange} disabled={field.isDerived}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    if (checked) {
                      onChange([...currentValues, option.value])
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option.value))
                    }
                  }}
                  disabled={field.isDerived}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={field.isDerived}
            className={error ? "border-red-500" : ""}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {field.isDerived && <span className="text-blue-500 ml-1">(Auto-calculated)</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
