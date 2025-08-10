"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Info } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateField } from "@/lib/slices/formBuilderSlice"
import type { FormField, ValidationRule, SelectOption } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getAvailableValidationRules, getDefaultValidationMessage } from "@/lib/validation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FieldEditorProps {
  field: FormField
  fieldIndex: number
  onClose: () => void
}

export function FieldEditor({ field, fieldIndex, onClose }: FieldEditorProps) {
  const dispatch = useAppDispatch()
  const [editedField, setEditedField] = useState<FormField>(field)
  const [newOption, setNewOption] = useState("")

  const currentForm = useAppSelector((state) => state.formBuilder.currentForm)
  const availableRules = getAvailableValidationRules(editedField.type)

  const handleSave = () => {
    dispatch(updateField({ index: fieldIndex, field: editedField }))
    onClose()
  }

  const addValidationRule = (type: ValidationRule["type"]) => {
    const defaultMessage = getDefaultValidationMessage(type, editedField.label)

    const newRule: ValidationRule = {
      type,
      message: defaultMessage,
    }

    // Set default values for rules that need them
    if (type === "minLength") {
      newRule.value = 1
      newRule.message = `${editedField.label} must be at least 1 character long`
    } else if (type === "maxLength") {
      newRule.value = 100
      newRule.message = `${editedField.label} must not exceed 100 characters`
    } else if (type === "minValue") {
      newRule.value = 0
      newRule.message = `${editedField.label} must be at least 0`
    } else if (type === "maxValue") {
      newRule.value = 100
      newRule.message = `${editedField.label} must not exceed 100`
    } else if (type === "pattern") {
      newRule.value = ""
      newRule.message = `${editedField.label} format is invalid`
    }

    setEditedField({
      ...editedField,
      validation: [...editedField.validation, newRule],
    })
  }

  const removeValidationRule = (index: number) => {
    setEditedField({
      ...editedField,
      validation: editedField.validation.filter((_, i) => i !== index),
    })
  }

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    setEditedField({
      ...editedField,
      validation: editedField.validation.map((rule, i) => (i === index ? { ...rule, ...updates } : rule)),
    })
  }

  const addOption = () => {
    if (newOption.trim()) {
      const newOptionObj: SelectOption = {
        label: newOption.trim(),
        value: newOption.trim().toLowerCase().replace(/\s+/g, "_"),
      }
      setEditedField({
        ...editedField,
        options: [...(editedField.options || []), newOptionObj],
      })
      setNewOption("")
    }
  }

  const removeOption = (index: number) => {
    setEditedField({
      ...editedField,
      options: editedField.options?.filter((_, i) => i !== index),
    })
  }

  const needsOptions = editedField.type === "select" || editedField.type === "radio" || editedField.type === "checkbox"
  const hasValidationRules = availableRules.length > 0

  const getValidationRuleDescription = (ruleType: ValidationRule["type"]) => {
    const descriptions: Record<ValidationRule["type"], string> = {
      required: "Field must be filled",
      minLength: "Minimum number of characters required",
      maxLength: "Maximum number of characters allowed",
      minValue: "Minimum numeric value allowed",
      maxValue: "Maximum numeric value allowed",
      email: "Must be a valid email format (user@domain.com)",
      password: "Must contain: 8+ chars, uppercase, lowercase, number, special char",
      pattern: "Custom regex pattern validation",
    }
    return descriptions[ruleType] || ""
  }

  return (
    <TooltipProvider>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Field: {editedField.label}</DialogTitle>
            <DialogDescription>Configure field properties and validation rules</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="label">Field Label</Label>
                  <Input
                    id="label"
                    value={editedField.label}
                    onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={editedField.required}
                    onCheckedChange={(checked) => setEditedField({ ...editedField, required: checked })}
                  />
                  <Label htmlFor="required">Required field</Label>
                  {editedField.required && (
                    <Badge variant="destructive" className="text-xs ml-2">
                      Required
                    </Badge>
                  )}
                </div>

                {(editedField.type === "text" || editedField.type === "number") && (
                  <div>
                    <Label htmlFor="defaultValue">Default Value</Label>
                    <Input
                      id="defaultValue"
                      type={editedField.type}
                      value={(editedField.defaultValue as string) || ""}
                      onChange={(e) => setEditedField({ ...editedField, defaultValue: e.target.value })}
                    />
                  </div>
                )}

                {editedField.type === "textarea" && (
                  <div>
                    <Label htmlFor="defaultValue">Default Value</Label>
                    <Textarea
                      id="defaultValue"
                      value={(editedField.defaultValue as string) || ""}
                      onChange={(e) => setEditedField({ ...editedField, defaultValue: e.target.value })}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Options for Select/Radio/Checkbox */}
            {needsOptions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Options</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {editedField.type === "select" && "Users can select one option from the dropdown"}
                    {editedField.type === "radio" && "Users can select one option from the radio buttons"}
                    {editedField.type === "checkbox" && "Users can select multiple options"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add new option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addOption()}
                    />
                    <Button onClick={addOption} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editedField.options?.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span>{option.label}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeOption(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Validation Rules - Only show if field type has validation rules */}
            {hasValidationRules && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Validation Rules</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add validation rules specific to this field type. Required validation is handled by the toggle
                    above.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {availableRules.map((ruleType) => (
                      <Tooltip key={ruleType}>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addValidationRule(ruleType)}
                            disabled={editedField.validation.some((rule) => rule.type === ruleType)}
                            className="flex items-center space-x-1"
                          >
                            <span>Add {ruleType}</span>
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getValidationRuleDescription(ruleType)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {editedField.validation.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded">
                        <Badge className="mt-1">{rule.type}</Badge>

                        <div className="flex-1 space-y-2">
                          {(rule.type === "minLength" ||
                            rule.type === "maxLength" ||
                            rule.type === "minValue" ||
                            rule.type === "maxValue") && (
                            <div>
                              <Label className="text-xs">Value</Label>
                              <Input
                                type="number"
                                className="w-24"
                                value={rule.value || ""}
                                onChange={(e) =>
                                  updateValidationRule(index, { value: Number.parseInt(e.target.value) })
                                }
                              />
                            </div>
                          )}

                          {rule.type === "pattern" && (
                            <div>
                              <Label className="text-xs">Regex Pattern</Label>
                              <Input
                                placeholder="e.g., ^[A-Z]{2}[0-9]{4}$"
                                value={rule.value || ""}
                                onChange={(e) => updateValidationRule(index, { value: e.target.value })}
                              />
                            </div>
                          )}

                          <div>
                            <Label className="text-xs">Error Message</Label>
                            <Input
                              placeholder="Custom error message"
                              value={rule.message}
                              onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                            />
                          </div>
                        </div>

                        <Button size="sm" variant="ghost" onClick={() => removeValidationRule(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Derived Field Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Derived Field</CardTitle>
                  <Switch
                    checked={editedField.isDerived || false}
                    onCheckedChange={(checked) =>
                      setEditedField({
                        ...editedField,
                        isDerived: checked,
                        derivedConfig: checked
                          ? {
                              parentFields: [],
                              formula: "",
                              type: "custom",
                            }
                          : undefined,
                      })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">Auto-calculate this field's value based on other fields</p>
              </CardHeader>
              {editedField.isDerived && (
                <CardContent className="space-y-4">
                  <div>
                    <Label>Parent Fields</Label>
                    <div className="space-y-2 mt-2">
                      {currentForm.fields
                        .filter((f) => f.id !== editedField.id && !f.isDerived)
                        .map((field) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={editedField.derivedConfig?.parentFields.includes(field.id) || false}
                              onCheckedChange={(checked) => {
                                const currentParents = editedField.derivedConfig?.parentFields || []
                                const newParents = checked
                                  ? [...currentParents, field.id]
                                  : currentParents.filter((id) => id !== field.id)

                                setEditedField({
                                  ...editedField,
                                  derivedConfig: {
                                    ...editedField.derivedConfig!,
                                    parentFields: newParents,
                                  },
                                })
                              }}
                            />
                            <Label>
                              {field.label} ({field.type})
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <Label>Calculation Type</Label>
                    <Select
                      value={editedField.derivedConfig?.type || "custom"}
                      onValueChange={(value) =>
                        setEditedField({
                          ...editedField,
                          derivedConfig: {
                            ...editedField.derivedConfig!,
                            type: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="age">Age from Date of Birth</SelectItem>
                        <SelectItem value="sum">Sum of Numbers</SelectItem>
                        <SelectItem value="concat">Concatenate Text</SelectItem>
                        <SelectItem value="custom">Custom Formula</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editedField.derivedConfig?.type === "custom" && (
                    <div>
                      <Label>Custom Formula</Label>
                      <Textarea
                        placeholder="Enter formula (e.g., field1 + field2 * 0.1)"
                        value={editedField.derivedConfig?.formula || ""}
                        onChange={(e) =>
                          setEditedField({
                            ...editedField,
                            derivedConfig: {
                              ...editedField.derivedConfig!,
                              formula: e.target.value,
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use field names as variables. Available operations: +, -, *, /, ()
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
