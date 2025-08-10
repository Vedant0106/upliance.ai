"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowRight, Zap, Shield, Layers } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Dynamic Form Builder
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Build Forms
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-300">That Adapt</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create intelligent forms with derived fields, real-time validation, and seamless user experiences. No
              coding required.
            </p>

            <div className="flex justify-center">
              <Link href="/create">
                <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features that make form building effortless and intelligent
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Builder</CardTitle>
                <CardDescription className="text-base">
                  Drag, drop, and configure with our intuitive interface
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/create">
                  <Button variant="ghost" className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                    Create Form
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Derived Fields</CardTitle>
                <CardDescription className="text-base">Auto-calculated fields that update in real-time</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/preview">
                  <Button variant="ghost" className="group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                    See Preview
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Advanced Validation</CardTitle>
                <CardDescription className="text-base">Comprehensive rules with custom error messages</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/myforms">
                  <Button variant="ghost" className="group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                    My Forms
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">7</div>
              <div className="text-gray-600 dark:text-gray-300">Field Types</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">∞</div>
              <div className="text-gray-600 dark:text-gray-300">Possibilities</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-gray-600 dark:text-gray-300">Backend Required</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">TypeScript</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already building amazing forms
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-8 py-4 h-auto">
              Create Your First Form
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
