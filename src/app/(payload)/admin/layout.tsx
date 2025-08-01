'use client'

import React from 'react'
import { FloatingExportButton } from '@/components/FloatingExportButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingExportButton />
    </>
  )
} 