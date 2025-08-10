"use client"

import { Button } from "@/components/ui/button"
import { Plus, Eye, List, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { startNewForm } from "@/lib/slices/formBuilderSlice"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isEditingExistingForm, currentForm } = useAppSelector((state) => state.formBuilder)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/preview", label: "Preview", icon: Eye },
    { href: "/myforms", label: "My Forms", icon: List },
  ]

  const handleCreateClick = () => {
    // Only start a new form if we're editing an existing saved form
    // OR if we're not currently on the create page with an active form
    if (isEditingExistingForm || (pathname !== "/create" && currentForm.fields.length === 0)) {
      dispatch(startNewForm())
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Form Builder
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.href === "/create" ? handleCreateClick : undefined}
                >
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
