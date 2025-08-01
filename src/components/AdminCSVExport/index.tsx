import React from 'react'
import { useConfig } from 'payload/components/utilities'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

interface AdminCSVExportProps {
  collection: string
}

export const AdminCSVExport: React.FC<AdminCSVExportProps> = ({ collection }) => {
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const response = await fetch('/api/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection,
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

      // Show success message
      console.log(`Successfully exported: ${filename}`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">CSV Export</h2>
        <Button onClick={handleExport} disabled={isExporting} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        Export all {collection} data to CSV format. The file will be downloaded automatically.
      </p>
    </div>
  )
}
