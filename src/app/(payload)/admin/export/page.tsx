'use client'

import React, { useState } from 'react'
import { Download, Users, CreditCard, Calendar, Package, FileText } from 'lucide-react'

const formCollections = [
  {
    slug: 'contact-forms',
    label: 'Contact Forms',
    description: 'Export contact form submissions',
    icon: Users,
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  {
    slug: 'donation-forms',
    label: 'Donation Forms',
    description: 'Export donation form submissions',
    icon: CreditCard,
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    slug: 'booking-forms',
    label: 'Booking Forms',
    description: 'Export restaurant booking submissions',
    icon: Calendar,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  {
    slug: 'in-kind-support-forms',
    label: 'In-Kind Support Forms',
    description: 'Export in-kind support offers',
    icon: Package,
    color: '#f97316',
    bgColor: '#fff7ed',
  },
]

export default function ExportPage() {
  const [exporting, setExporting] = useState<string | null>(null)
  const [lastExport, setLastExport] = useState<string | null>(null)

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

      setLastExport(`${label} - ${new Date().toLocaleTimeString()}`)
      console.log(`Successfully exported: ${filename}`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <FileText size={24} style={{ color: '#3b82f6' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>CSV Export Center</h1>
        </div>
        <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>
          Export your form submissions to CSV format for analysis and reporting.
        </p>
      </div>

      {/* Last Export Status */}
      {lastExport && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '6px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#065f46' }}>✅ Last export: {lastExport}</span>
        </div>
      )}

      {/* Export Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {formCollections.map((collection) => {
          const Icon = collection.icon
          const isExporting = exporting === collection.slug

          return (
            <div
              key={collection.slug}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                }
              }}
              onClick={() => !isExporting && handleExport(collection.slug, collection.label)}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: collection.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  <Icon size={24} style={{ color: collection.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                    {collection.label}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                    {collection.description}
                  </p>
                </div>
              </div>

              <button
                disabled={isExporting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: isExporting ? '#9ca3af' : collection.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.backgroundColor = collection.color
                  }
                }}
              >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExport('contact-forms', 'Contact Forms')}
            disabled={exporting === 'contact-forms'}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: exporting === 'contact-forms' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: exporting === 'contact-forms' ? 0.6 : 1,
            }}
          >
            Contact Forms
          </button>
          <button
            onClick={() => handleExport('donation-forms', 'Donation Forms')}
            disabled={exporting === 'donation-forms'}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: exporting === 'donation-forms' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: exporting === 'donation-forms' ? 0.6 : 1,
            }}
          >
            Donation Forms
          </button>
          <button
            onClick={() => handleExport('booking-forms', 'Booking Forms')}
            disabled={exporting === 'booking-forms'}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: exporting === 'booking-forms' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: exporting === 'booking-forms' ? 0.6 : 1,
            }}
          >
            Booking Forms
          </button>
          <button
            onClick={() => handleExport('in-kind-support-forms', 'In-Kind Support')}
            disabled={exporting === 'in-kind-support-forms'}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: exporting === 'in-kind-support-forms' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: exporting === 'in-kind-support-forms' ? 0.6 : 1,
            }}
          >
            In-Kind Support
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#92400e' }}>
          📋 Export Instructions
        </h3>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#92400e' }}>
          <li>Click on any collection card above to export all submissions to CSV</li>
          <li>Use the Quick Actions for faster access to specific collections</li>
          <li>CSV files will be automatically downloaded to your device</li>
          <li>Each export includes all available fields for the selected collection</li>
          <li>Files are named with the collection name and current date</li>
        </ul>
      </div>
    </div>
  )
}
