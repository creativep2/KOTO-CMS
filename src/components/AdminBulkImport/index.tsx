import React, { useState, useRef } from 'react'
import { Upload, Download, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'

interface BulkImportProps {
  collection: string
  collectionLabel: string
  onImportComplete?: (result: any) => void
}

export const AdminBulkImport: React.FC<BulkImportProps> = ({
  collection,
  collectionLabel,
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const [options, setOptions] = useState({
    updateExisting: false,
    skipErrors: true,
    dryRun: false,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      previewCSV(selectedFile)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const previewCSV = (selectedFile: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').slice(0, 6) // Show first 5 data rows + header
      const preview = lines.map(line => {
        // Detect separator (comma or semicolon)
        const hasComma = line.includes(',')
        const hasSemicolon = line.includes(';')
        const separator = hasSemicolon ? ';' : ','
        
        return line.split(separator).map(cell => cell.trim().replace(/"/g, ''))
      })
      setCsvPreview(preview)
      setShowPreview(true)
    }
    reader.readAsText(selectedFile)
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`/api/import/template/${collection}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${collection}_template.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download template:', error)
      alert('Failed to download template')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('collection', collection)
      formData.append('options', JSON.stringify(options))

      const response = await fetch('/api/import/bulk', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setImportResult(result)

      if (result.success) {
        onImportComplete?.(result)
      }
    } catch (error) {
      console.error('Import failed:', error)
      setImportResult({
        success: false,
        message: 'Import failed. Please try again.',
        errors: ['Network error occurred']
      })
    } finally {
      setIsImporting(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setImportResult(null)
    setShowPreview(false)
    setCsvPreview([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bulk-import-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="import-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
          Bulk Import - {collectionLabel}
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Import multiple records from a CSV file. Download the template first to see the required format.
        </p>
      </div>

      {/* Template Download */}
      <div className="template-section" style={{ marginBottom: '24px' }}>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Info size={20} color="#6c757d" />
            <span style={{ fontWeight: '500' }}>Get Started</span>
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            Download the CSV template to see the required column structure and field names. 
            For rich text fields, you can use simple HTML-like tags like &lt;p&gt; for paragraphs.
          </p>
          <button
            onClick={downloadTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <Download size={16} />
            Download Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="upload-section" style={{ marginBottom: '24px' }}>
        <div style={{ 
          border: '2px dashed #dee2e6', 
          borderRadius: '8px', 
          padding: '32px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          transition: 'border-color 0.2s',
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.currentTarget.style.borderColor = '#007bff'
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = '#dee2e6'
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.currentTarget.style.borderColor = '#dee2e6'
          const droppedFile = e.dataTransfer.files[0]
          if (droppedFile && droppedFile.type === 'text/csv') {
            setFile(droppedFile)
            previewCSV(droppedFile)
          }
        }}
        >
          <Upload size={48} color="#6c757d" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
            {file ? file.name : 'Drop your CSV file here or click to browse'}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            Supported format: CSV files only
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Choose File
          </button>
        </div>
      </div>

      {/* CSV Preview */}
      {showPreview && csvPreview.length > 0 && (
        <div className="preview-section" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            CSV Preview (First 5 rows)
          </h3>
          <div style={{ 
            border: '1px solid #e9ecef', 
            borderRadius: '4px', 
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  {csvPreview[0]?.map((header, index) => (
                    <th key={index} style={{ 
                      padding: '8px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #dee2e6',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvPreview.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{ 
                        padding: '8px', 
                        borderBottom: '1px solid #e9ecef',
                        fontSize: '12px'
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Options */}
      <div className="options-section" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Import Options
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={options.dryRun}
              onChange={(e) => setOptions(prev => ({ ...prev, dryRun: e.target.checked }))}
            />
            <span style={{ fontSize: '14px' }}>Dry Run (validate only, don't import)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={options.updateExisting}
              onChange={(e) => setOptions(prev => ({ ...prev, updateExisting: e.target.checked }))}
            />
            <span style={{ fontSize: '14px' }}>Update existing records (if found)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={options.skipErrors}
              onChange={(e) => setOptions(prev => ({ ...prev, skipErrors: e.target.checked }))}
            />
            <span style={{ fontSize: '14px' }}>Skip rows with errors and continue</span>
          </label>
        </div>
      </div>

      {/* Import Button */}
      <div className="import-actions" style={{ marginBottom: '24px' }}>
        <button
          onClick={handleImport}
          disabled={!file || isImporting}
          style={{
            padding: '12px 24px',
            backgroundColor: file && !isImporting ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: file && !isImporting ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginRight: '12px',
          }}
        >
          {isImporting ? (
            <>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid #ffffff40', 
                borderTop: '2px solid white', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              Importing...
            </>
          ) : (
            <>
              <Upload size={16} />
              Start Import
            </>
          )}
        </button>
        
        {file && (
          <button
            onClick={resetForm}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="results-section">
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid',
            backgroundColor: importResult.success ? '#d4edda' : '#f8d7da',
            borderColor: importResult.success ? '#c3e6cb' : '#f5c6cb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              {importResult.success ? (
                <CheckCircle size={20} color="#155724" />
              ) : (
                <XCircle size={20} color="#721c24" />
              )}
              <span style={{ 
                fontWeight: '600',
                color: importResult.success ? '#155724' : '#721c24'
              }}>
                {importResult.success ? 'Import Completed' : 'Import Failed'}
              </span>
            </div>
            
            <p style={{ 
              marginBottom: '12px',
              color: importResult.success ? '#155724' : '#721c24'
            }}>
              {importResult.message}
            </p>

            {importResult.success && (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px' }}>
                  <strong>Imported:</strong> {importResult.imported}
                </span>
                {importResult.updated > 0 && (
                  <span style={{ fontSize: '14px' }}>
                    <strong>Updated:</strong> {importResult.updated}
                  </span>
                )}
                {importResult.skipped > 0 && (
                  <span style={{ fontSize: '14px' }}>
                    <strong>Skipped:</strong> {importResult.skipped}
                  </span>
                )}
              </div>
            )}

            {importResult.errors && importResult.errors.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Errors ({importResult.errors.length}):
                </h4>
                <div style={{ 
                  maxHeight: '200px', 
                  overflow: 'auto',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  padding: '8px',
                  borderRadius: '4px'
                }}>
                  {importResult.errors.map((error: string, index: number) => (
                    <div key={index} style={{ 
                      fontSize: '12px', 
                      color: '#721c24',
                      marginBottom: '4px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(220,53,69,0.1)',
                      borderRadius: '2px'
                    }}>
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 