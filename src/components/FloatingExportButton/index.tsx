import React, { useState } from 'react'
import { Download, X } from 'lucide-react'

export const FloatingExportButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)

  const collections = [
    { slug: 'contact-forms', label: 'Contact Forms', color: '#3b82f6' },
    { slug: 'donation-forms', label: 'Donation Forms', color: '#10b981' },
    { slug: 'booking-forms', label: 'Booking Forms', color: '#8b5cf6' },
    { slug: 'in-kind-support-forms', label: 'In-Kind Support', color: '#f97316' },
  ]

  const handleExport = async (collection: string, label: string) => {
    setExporting(collection)
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

      console.log(`Successfully exported: ${filename}`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* Main Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          fontSize: '24px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {isExpanded ? <X size={24} /> : <Download size={24} />}
      </button>

      {/* Expanded Menu */}
      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '12px',
            minWidth: '200px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <h4
              style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}
            >
              Export to CSV
            </h4>
          </div>

          {collections.map((collection) => (
            <button
              key={collection.slug}
              onClick={() => handleExport(collection.slug, collection.label)}
              disabled={exporting === collection.slug}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: exporting === collection.slug ? '#9ca3af' : collection.color,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: exporting === collection.slug ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '4px',
                textAlign: 'left',
                transition: 'background-color 0.2s',
                opacity: exporting === collection.slug ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!exporting) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8'
                }
              }}
              onMouseLeave={(e) => {
                if (!exporting) {
                  e.currentTarget.style.backgroundColor = collection.color
                }
              }}
            >
              {exporting === collection.slug ? 'Exporting...' : collection.label}
            </button>
          ))}

          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
            <a
              href="/admin/export"
              style={{
                display: 'block',
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#218838'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745'
              }}
            >
              📊 Export Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
