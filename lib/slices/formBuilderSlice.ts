import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { FormSchema, FormField } from "@/lib/types"

interface FormBuilderState {
  currentForm: FormSchema
  savedForms: FormSchema[]
  isEditingExistingForm: boolean // Track if we're editing an existing saved form
}

const initialState: FormBuilderState = {
  currentForm: {
    id: "",
    name: "",
    fields: [],
    createdAt: new Date().toISOString(),
  },
  savedForms: [],
  isEditingExistingForm: false,
}

const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.fields.push(action.payload)
    },
    updateField: (state, action: PayloadAction<{ index: number; field: FormField }>) => {
      state.currentForm.fields[action.payload.index] = action.payload.field
    },
    deleteField: (state, action: PayloadAction<number>) => {
      state.currentForm.fields.splice(action.payload, 1)
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.currentForm.fields.splice(fromIndex, 1)
      state.currentForm.fields.splice(toIndex, 0, removed)
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.isEditingExistingForm && state.currentForm.id) {
        // Update existing form
        const formIndex = state.savedForms.findIndex((f) => f.id === state.currentForm.id)
        if (formIndex !== -1) {
          state.savedForms[formIndex] = {
            ...state.currentForm,
            name: action.payload,
            updatedAt: new Date().toISOString(),
          }
        }
      } else {
        // Create new form
        const formToSave = {
          ...state.currentForm,
          id: Date.now().toString(),
          name: action.payload,
          createdAt: new Date().toISOString(),
        }
        state.savedForms.push(formToSave)
        state.currentForm = formToSave
        state.isEditingExistingForm = true
      }
      // Save to localStorage
      localStorage.setItem("formBuilder_savedForms", JSON.stringify(state.savedForms))
    },
    updateExistingForm: (state) => {
      // Update existing form without changing name
      if (state.isEditingExistingForm && state.currentForm.id) {
        const formIndex = state.savedForms.findIndex((f) => f.id === state.currentForm.id)
        if (formIndex !== -1) {
          state.savedForms[formIndex] = {
            ...state.currentForm,
            updatedAt: new Date().toISOString(),
          }
          // Save to localStorage
          localStorage.setItem("formBuilder_savedForms", JSON.stringify(state.savedForms))
        }
      }
    },
    loadSavedForms: (state) => {
      const saved = localStorage.getItem("formBuilder_savedForms")
      if (saved) {
        state.savedForms = JSON.parse(saved)
      }
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find((f) => f.id === action.payload)
      if (form) {
        state.currentForm = { ...form }
        state.isEditingExistingForm = true
      }
    },
    startNewForm: (state) => {
      state.currentForm = {
        id: "",
        name: "",
        fields: [],
        createdAt: new Date().toISOString(),
      }
      state.isEditingExistingForm = false
    },
    clearCurrentForm: (state) => {
      state.currentForm = {
        id: "",
        name: "",
        fields: [],
        createdAt: new Date().toISOString(),
      }
      state.isEditingExistingForm = false
    },
  },
})

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  updateExistingForm,
  loadSavedForms,
  loadForm,
  startNewForm,
  clearCurrentForm,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
