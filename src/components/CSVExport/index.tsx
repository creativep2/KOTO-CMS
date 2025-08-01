import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'

interface CSVExportProps {
  collection: string
  collectionLabel: string
  onExport?: (filename: string) => void
}

interface FieldMapping {
  [key: string]: string[]
}

const fieldMappings: FieldMapping = {
  'contact-forms': ['fullName', 'email', 'message', 'status', 'notes', 'createdAt', 'updatedAt'],
  'donation-forms': [
    'fullName',
    'email',
    'donationAmount',
    'paymentMethod',
    'howDidYouHearAboutUs',
    'status',
    'transactionId',
    'notes',
    'createdAt',
    'updatedAt',
  ],
  'booking-forms': [
    'fullName',
    'email',
    'phoneNumber',
    'nationality',
    'restaurant',
    'reservationDate',
    'reservationTime',
    'numberOfGuests',
    'specialOccasion',
    'specialOccasionType',
    'specialRequests',
    'status',
    'confirmationNumber',
    'notes',
    'createdAt',
    'updatedAt',
  ],
  'in-kind-support-forms': [
    'fullName',
    'email',
    'phoneNumber',
    'deliveryPreference',
    'message',
    'status',
    'itemType',
    'estimatedValue',
    'notes',
    'createdAt',
    'updatedAt',
  ],
}

const statusOptions = {
  'contact-forms': [
    { label: 'All', value: '' },
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Replied', value: 'replied' },
    { label: 'Closed', value: 'closed' },
  ],
  'donation-forms': [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Refunded', value: 'refunded' },
  ],
  'booking-forms': [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Seated', value: 'seated' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'No Show', value: 'no-show' },
  ],
  'in-kind-support-forms': [
    { label: 'All', value: '' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Arranged', value: 'arranged' },
    { label: 'Completed', value: 'completed' },
    { label: 'Declined', value: 'declined' },
  ],
}

export const CSVExport: React.FC<CSVExportProps> = ({ collection, collectionLabel, onExport }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)
  const [availableFields, setAvailableFields] = useState<string[]>([])

  useEffect(() => {
    // Set default selected fields (all fields)
    const fields = fieldMappings[collection] || []
    setAvailableFields(fields)
    setSelectedFields(fields)
  }, [collection])

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    )
  }

  const handleSelectAll = () => {
    setSelectedFields(availableFields)
  }

  const handleDeselectAll = () => {
    setSelectedFields([])
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export')
      return
    }

    setIsExporting(true)

    try {
      const filters: any = {}
      if (statusFilter) {
        filters.status = {
          equals: statusFilter,
        }
      }

      const response = await fetch('/api/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection,
          fields: selectedFields,
          filters: Object.keys(filters).length > 0 ? filters : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `${collection}_export.csv`

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      onExport?.(filename)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Export {collectionLabel} to CSV</CardTitle>
        <CardDescription>
          Select the fields you want to include in the export and apply any filters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select status filter" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions[collection as keyof typeof statusOptions]?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Field Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Select Fields to Export</Label>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
            {availableFields.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={field}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={() => handleFieldToggle(field)}
                />
                <Label htmlFor={field} className="text-sm font-normal cursor-pointer">
                  {field}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0}
            className="min-w-[120px]"
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
