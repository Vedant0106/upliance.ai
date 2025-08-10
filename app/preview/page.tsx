"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loadSavedForms } from "@/lib/slices/formBuilderSlice"
import { FormPreview } from "@/components/form-preview/form-preview"

export default function PreviewPage() {
  const dispatch = useAppDispatch()
  const currentForm = useAppSelector((state) => state.formBuilder.currentForm)

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Form Preview</h1>
          <p className="text-muted-foreground">Test your form as an end user would see it</p>
        </div>

        {currentForm.fields.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No form to preview</h3>
            <p className="text-muted-foreground mb-4">Create a form first to see the preview</p>
          </div>
        ) : (
          <FormPreview />
        )}
      </div>
    </div>
  )
}
