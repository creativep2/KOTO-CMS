import React, { useState } from 'react'
import { Download, Upload, Users, CreditCard, Calendar, Package, FileText, Briefcase, Image, ShoppingBag, Play, Tag } from 'lucide-react'
import { AdminBulkImport } from '../AdminBulkImport'

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

const contentCollections = [
  {
    slug: 'blogs',
    label: 'Blogs',
    icon: FileText,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  {
    slug: 'job-posts',
    label: 'Job Posts',
    icon: Briefcase,
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
  {
    slug: 'hero-banners',
    label: 'Hero Banners',
    icon: Image,
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  {
    slug: 'partners',
    label: 'Partners',
    icon: Users,
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    slug: 'merchandise',
    label: 'Merchandise',
    icon: ShoppingBag,
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  {
    slug: 'youtube-embeds',
    label: 'YouTube Embeds',
    icon: Play,
    color: '#dc2626',
    bgColor: '#fef2f2',
  },
  {
    slug: 'categories',
    label: 'Categories',
    icon: Tag,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
  },
  {
    slug: 'media',
    label: 'Media',
    icon: Image,
    color: '#059669',
    bgColor: '#ecfdf5',
  },
]

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

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

  const handleImportClick = (collection: string) => {
    setSelectedCollection(collection)
    setActiveTab('import')
  }

  const handleImportComplete = (result: any) => {
    console.log('Import completed:', result)
    // You can add additional logic here like refreshing data or showing notifications
  }

  // If import tab is active and a collection is selected, show the import component
  if (activeTab === 'import' && selectedCollection) {
    const collection = contentCollections.find(c => c.slug === selectedCollection)
    if (!collection) return null

    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            ← Back to Dashboard
          </button>
          <AdminBulkImport
            collection={selectedCollection}
            collectionLabel={collection.label}
            onImportComplete={handleImportComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Export data to CSV format and import bulk data from CSV files.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e9ecef' }}>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'export' ? '#007bff' : 'transparent',
              color: activeTab === 'export' ? 'white' : '#666',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'export' ? '600' : '400',
            }}
          >
            Export Data
          </button>
          <button
            onClick={() => setActiveTab('import')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'import' ? '#007bff' : 'transparent',
              color: activeTab === 'import' ? 'white' : '#666',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'import' ? '600' : '400',
            }}
          >
            Import Data
          </button>
        </div>
      </div>

      {activeTab === 'export' && (
        <>
          {/* Form Collections */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Forms & Submissions
            </h2>
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
          </div>

          {/* Content Collections */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Content Management
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {contentCollections.map((collection) => {
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
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
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
                          Export & Import
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleExport(collection.slug)}
                        style={{
                          flex: 1,
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
                        Export
                      </button>
                      <button
                        onClick={() => handleImportClick(collection.slug)}
                        style={{
                          flex: 1,
                          padding: '8px 16px',
                          backgroundColor: '#28a745',
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
                          e.currentTarget.style.backgroundColor = '#218838'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#28a745'
                        }}
                      >
                        <Upload size={16} />
                        Import
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === 'import' && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Upload size={64} color="#6c757d" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
            Select a Collection to Import
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Choose a collection from the Content Management section above to start importing data.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {contentCollections.map((collection) => {
              const Icon = collection.icon
              return (
                <button
                  key={collection.slug}
                  onClick={() => handleImportClick(collection.slug)}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: collection.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} style={{ color: collection.color }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {collection.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}


    </div>
  )
}
