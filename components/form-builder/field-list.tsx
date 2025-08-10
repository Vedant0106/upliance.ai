"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, GripVertical } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteField, reorderFields } from "@/lib/slices/formBuilderSlice"
import { FieldEditor } from "./field-editor"

export function FieldList() {
  const dispatch = useAppDispatch()
  const fields = useAppSelector((state) => state.formBuilder.currentForm.fields)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleDeleteField = (index: number) => {
    dispatch(deleteField(index))
  }

  const handleMoveField = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < fields.length) {
      dispatch(reorderFields({ fromIndex, toIndex }))
    }
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <div>
                  <CardTitle className="text-base">{field.label}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {field.type}
                    </Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {field.isDerived && (
                      <Badge variant="outline" className="text-xs">
                        Derived
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleMoveField(index, index - 1)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleMoveField(index, index + 1)}
                  disabled={index === fields.length - 1}
                >
                  ↓
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingIndex(index)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteField(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {field.validation.length > 0 && (
            <CardContent className="pt-0">
              <div className="text-sm text-gray-600">
                <strong>Validations:</strong> {field.validation.map((v) => v.type).join(", ")}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {editingIndex !== null && (
        <FieldEditor field={fields[editingIndex]} fieldIndex={editingIndex} onClose={() => setEditingIndex(null)} />
      )}
    </div>
  )
}
