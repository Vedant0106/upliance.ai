"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Calendar, FileText, Plus, Clock } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loadForm, startNewForm } from "@/lib/slices/formBuilderSlice"
import { useRouter } from "next/navigation"

export function FormsList() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const savedForms = useAppSelector((state) => state.formBuilder.savedForms)

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId))
    router.push("/preview")
  }

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId))
    router.push("/create")
  }

  const handleCreateNewForm = () => {
    dispatch(startNewForm())
    router.push("/create")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (savedForms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground mb-4">
          <FileText className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-2">No saved forms</h3>
        <p className="text-muted-foreground mb-4">Create your first form to get started</p>
        <Button onClick={handleCreateNewForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Forms ({savedForms.length})</h2>
        <Button onClick={handleCreateNewForm}>
          <Plus className="mr-2 h-4 w-4" />
          New Form
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedForms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{form.name}</CardTitle>
                  <div className="space-y-1 mt-2">
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {formatDate(form.createdAt)}
                    </CardDescription>
                    {form.updatedAt && (
                      <CardDescription className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated: {formatDate(form.updatedAt)}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">
                  {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <strong>Field Types:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.from(new Set(form.fields.map((f) => f.type))).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handlePreviewForm(form.id)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => handleEditForm(form.id)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
