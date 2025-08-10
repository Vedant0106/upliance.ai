"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { FieldType } from "@/lib/types"
import { Type, Hash, FileText, ChevronDown, Circle, CheckSquare, Calendar } from "lucide-react"

interface FieldTypeSelectorProps {
  open: boolean
  onClose: () => void
  onSelectType: (type: FieldType) => void
}

const fieldTypes: Array<{
  type: FieldType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    type: "text",
    label: "Text",
    description: "Single line text input",
    icon: Type,
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric input field",
    icon: Hash,
  },
  {
    type: "textarea",
    label: "Textarea",
    description: "Multi-line text input",
    icon: FileText,
  },
  {
    type: "select",
    label: "Select",
    description: "Dropdown selection",
    icon: ChevronDown,
  },
  {
    type: "radio",
    label: "Radio",
    description: "Single choice from options",
    icon: Circle,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Multiple choice selection",
    icon: CheckSquare,
  },
  {
    type: "date",
    label: "Date",
    description: "Date picker input",
    icon: Calendar,
  },
]

export function FieldTypeSelector({ open, onClose, onSelectType }: FieldTypeSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Field Type</DialogTitle>
          <DialogDescription>Choose the type of field you want to add to your form</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {fieldTypes.map((fieldType) => {
            const Icon = fieldType.icon
            return (
              <Button
                key={fieldType.type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent"
                onClick={() => onSelectType(fieldType.type)}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{fieldType.label}</span>
                </div>
                <p className="text-sm text-gray-600 text-left">{fieldType.description}</p>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
