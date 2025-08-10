"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { loadSavedForms } from "@/lib/slices/formBuilderSlice"
import { FormsList } from "@/components/forms-list/forms-list"

export default function MyFormsPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Forms</h1>
          <p className="text-muted-foreground">View and manage your saved forms</p>
        </div>
        <FormsList />
      </div>
    </div>
  )
}
