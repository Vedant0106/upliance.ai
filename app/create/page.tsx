"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loadSavedForms } from "@/lib/slices/formBuilderSlice"
import { FormBuilder } from "@/components/form-builder/form-builder"

export default function CreatePage() {
  const dispatch = useAppDispatch()
  const { isEditingExistingForm, currentForm } = useAppSelector((state) => state.formBuilder)

  useEffect(() => {
    dispatch(loadSavedForms())
    // Don't clear the form automatically - let navigation handle it
  }, [dispatch])

  const getLastUpdated = () => {
    if (currentForm.updatedAt) {
      return new Date(currentForm.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{isEditingExistingForm ? "Edit Form" : "Form Builder"}</h1>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {isEditingExistingForm
                    ? `Editing: ${currentForm.name || "Untitled Form"}`
                    : "Create and customize your dynamic forms"}
                </p>
                {isEditingExistingForm && getLastUpdated() && (
                  <p className="text-sm text-muted-foreground">Last updated: {getLastUpdated()}</p>
                )}
              </div>
            </div>
            {currentForm.fields.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {currentForm.fields.length} field{currentForm.fields.length !== 1 ? "s" : ""} added
                </div>
                {isEditingExistingForm && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Changes will update the existing form
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <FormBuilder />
      </div>
    </div>
  )
}
