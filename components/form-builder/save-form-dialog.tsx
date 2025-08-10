"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SaveFormDialogProps {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export function SaveFormDialog({ open, onClose, onSave }: SaveFormDialogProps) {
  const [formName, setFormName] = useState("")

  const handleSave = () => {
    if (formName.trim()) {
      onSave(formName.trim())
      setFormName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Form</DialogTitle>
          <DialogDescription>Give your form a name to save it for later use</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              placeholder="Enter form name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim()}>
              Save Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
