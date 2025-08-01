'use client'

import React, { useState } from 'react'
import { CSVExport } from '@/components/CSVExport'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download, FileText, Users, CreditCard, Calendar, Package } from 'lucide-react'

const formCollections = [
  {
    slug: 'contact-forms',
    label: 'Contact Forms',
    description: 'Export contact form submissions',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    slug: 'donation-forms',
    label: 'Donation Forms',
    description: 'Export donation form submissions',
    icon: CreditCard,
    color: 'text-green-600',
  },
  {
    slug: 'booking-forms',
    label: 'Booking Forms',
    description: 'Export restaurant booking submissions',
    icon: Calendar,
    color: 'text-purple-600',
  },
  {
    slug: 'in-kind-support-forms',
    label: 'In-Kind Support Forms',
    description: 'Export in-kind support offers',
    icon: Package,
    color: 'text-orange-600',
  },
]

export default function CSVExportPage() {
  const [activeTab, setActiveTab] = useState('contact-forms')
  const [lastExport, setLastExport] = useState<string | null>(null)

  const handleExport = (filename: string) => {
    setLastExport(filename)
    // You could add a toast notification here
    console.log(`Exported: ${filename}`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Download className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">CSV Export</h1>
          <p className="text-gray-600">Export form submissions to CSV format</p>
        </div>
      </div>

      {lastExport && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-700">
              <FileText className="h-4 w-4" />
              <span>Successfully exported: {lastExport}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {formCollections.map((collection) => {
            const Icon = collection.icon
            return (
              <TabsTrigger
                key={collection.slug}
                value={collection.slug}
                className="flex items-center space-x-2"
              >
                <Icon className={`h-4 w-4 ${collection.color}`} />
                <span className="hidden sm:inline">{collection.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {formCollections.map((collection) => (
          <TabsContent key={collection.slug} value={collection.slug} className="mt-6">
            <CSVExport
              collection={collection.slug}
              collectionLabel={collection.label}
              onExport={handleExport}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Export Instructions</CardTitle>
          <CardDescription>How to use the CSV export feature</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Select Collection</h4>
              <p className="text-sm text-gray-600">
                Choose the form collection you want to export from the tabs above.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Filter Data</h4>
              <p className="text-sm text-gray-600">
                Optionally filter by status to export only specific submissions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Select Fields</h4>
              <p className="text-sm text-gray-600">
                Choose which fields to include in the export. All fields are selected by default.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">4. Export</h4>
              <p className="text-sm text-gray-600">
                Click the export button to download the CSV file with your selected data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
