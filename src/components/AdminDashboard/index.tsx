import React from 'react'
import { Download, Users, CreditCard, Calendar, Package } from 'lucide-react'

const formCollections = [
  {
    slug: 'contact-forms',
    label: 'Contact Forms',
    icon: Users,
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  {
    slug: 'donation-forms',
    label: 'Donation Forms',
    icon: CreditCard,
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    slug: 'booking-forms',
    label: 'Booking Forms',
    icon: Calendar,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  {
    slug: 'in-kind-support-forms',
    label: 'In-Kind Support Forms',
    icon: Package,
    color: '#f97316',
    bgColor: '#fff7ed',
  },
]

export const AdminDashboard: React.FC = () => {
  const handleExport = async (collection: string) => {
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
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          CSV Export Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Export form submissions to CSV format for analysis and reporting.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {formCollections.map((collection) => {
          const Icon = collection.icon
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
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => handleExport(collection.slug)}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: collection.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                  }}
                >
                  <Icon size={20} style={{ color: collection.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>
                    {collection.label}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                    Export to CSV
                  </p>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0056b3'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#007bff'
                }}
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Quick Export Options
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExport('contact-forms')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Contact Forms
          </button>
          <button
            onClick={() => handleExport('donation-forms')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Donation Forms
          </button>
          <button
            onClick={() => handleExport('booking-forms')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Booking Forms
          </button>
          <button
            onClick={() => handleExport('in-kind-support-forms')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            In-Kind Support
          </button>
        </div>
      </div>
    </div>
  )
}
