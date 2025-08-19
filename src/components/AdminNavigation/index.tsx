import React from 'react'
import { Download, Upload } from 'lucide-react'
import Link from 'next/link'

export const AdminNavigation: React.FC = () => {
  return (
    <div className="admin-navigation">
      <Link
        href="/admin/forms-export"
        className="admin-nav-link"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          textDecoration: 'none',
          color: 'inherit',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          marginRight: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <Download size={16} />
        <span>CSV Export</span>
      </Link>
      
      <Link
        href="/admin/csv"
        className="admin-nav-link"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          textDecoration: 'none',
          color: 'inherit',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <Upload size={16} />
        <span>Bulk Import</span>
      </Link>
    </div>
  )
}
