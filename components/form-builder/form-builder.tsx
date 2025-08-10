"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save, RotateCcw, Edit } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addField, saveForm, updateExistingForm, startNewForm } from "@/lib/slices/formBuilderSlice"
import type { FormField, FieldType } from "@/lib/types"
import { FieldTypeSelector } from "./field-type-selector"
import { FieldList } from "./field-list"
import { SaveFormDialog } from "./save-form-dialog"

export function FormBuilder() {
  const dispatch = useAppDispatch()
  const { currentForm, isEditingExistingForm } = useAppSelector((state) => state.formBuilder)
  const [showFieldSelector, setShowFieldSelector] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      validation: [],
      isDerived: false,
    }
    dispatch(addField(newField))
    setShowFieldSelector(false)
  }

  const handleSaveForm = (name: string) => {
    dispatch(saveForm(name))
    setShowSaveDialog(false)
  }

  const handleUpdateForm = () => {
    dispatch(updateExistingForm())
    // Show a brief success message
    const button = document.activeElement as HTMLButtonElement
    const originalText = button?.textContent
    if (button) {
      button.textContent = "Updated!"
      button.disabled = true
      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
      }, 1500)
    }
  }

  const handleStartNewForm = () => {
    if (currentForm.fields.length > 0) {
      const confirmed = window.confirm("Are you sure you want to start a new form? Any unsaved changes will be lost.")
      if (confirmed) {
        dispatch(startNewForm())
      }
    } else {
      dispatch(startNewForm())
    }
  }

  const handleSaveAction = () => {
    if (isEditingExistingForm) {
      handleUpdateForm()
    } else {
      setShowSaveDialog(true)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form Builder Panel */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Form Fields</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={() => setShowFieldSelector(true)} size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Field</span>
              </Button>
              {currentForm.fields.length > 0 && (
                <Button
                  onClick={handleStartNewForm}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>New Form</span>
                </Button>
              )}
              <Button
                onClick={handleSaveAction}
                size="sm"
                variant="outline"
                disabled={currentForm.fields.length === 0}
                className="flex items-center space-x-2 bg-transparent"
              >
                {isEditingExistingForm ? (
                  <>
                    <Edit className="h-4 w-4" />
                    <span>Update Form</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Form</span>
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentForm.fields.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">No fields yet</h3>
                <p className="text-muted-foreground mb-4">Start building your form by adding fields</p>
                <Button onClick={() => setShowFieldSelector(true)}>Add Your First Field</Button>
              </div>
            ) : (
              <FieldList />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Preview Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {currentForm.fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Add fields to see preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentForm.fields.map((field) => (
                  <div key={field.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {field.type} field
                      {field.isDerived && " (derived)"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Field Type Selector Dialog */}
      <FieldTypeSelector
        open={showFieldSelector}
        onClose={() => setShowFieldSelector(false)}
        onSelectType={handleAddField}
      />

      {/* Save Form Dialog - Only for new forms */}
      <SaveFormDialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} onSave={handleSaveForm} />
    </div>
  )
}
