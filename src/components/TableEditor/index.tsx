'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TableData {
  headers: string[]
  rows: string[]
}

interface TableEditorProps {
  path: string
  label?: string
  description?: string
  value?: TableData
  onChange?: (value: TableData) => void
}

const TableEditor: React.FC<TableEditorProps> = ({ 
  path, 
  label, 
  description, 
  value = { headers: [], rows: [] }, 
  onChange 
}) => {
  const [localValue, setLocalValue] = useState<TableData>(value)
  const [csvInput, setCsvInput] = useState('')
  const [showCsvImport, setShowCsvImport] = useState(false)

  // Sync local value with prop value when it changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const setValue = useCallback((newValue: TableData) => {
    setLocalValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }, [onChange])

  const parseCSV = useCallback((csvText: string): TableData => {
    const lines = csvText.trim().split('\n')
    if (lines.length === 0) return { headers: [], rows: [] }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'))
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1')).join('|')
    )

    return { headers, rows }
  }, [])

  const handleCsvImport = useCallback(() => {
    if (csvInput.trim()) {
      const parsed = parseCSV(csvInput)
      setValue(parsed)
      setCsvInput('')
      setShowCsvImport(false)
    }
  }, [csvInput, parseCSV, setValue])

  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const parsed = parseCSV(text)
        setValue(parsed)
      }
      reader.readAsText(file)
    }
  }, [parseCSV, setValue])

  const updateHeader = useCallback((index: number, newValue: string) => {
    const newHeaders = [...localValue.headers]
    newHeaders[index] = newValue
    setValue({ ...localValue, headers: newHeaders })
  }, [localValue, setValue])

  const updateCell = useCallback((rowIndex: number, colIndex: number, newValue: string) => {
    const newRows = [...localValue.rows]
    if (!newRows[rowIndex]) {
      newRows[rowIndex] = new Array(localValue.headers.length).fill('').join('|')
    }
    const rowData = newRows[rowIndex].split('|')
    rowData[colIndex] = newValue
    newRows[rowIndex] = rowData.join('|')
    setValue({ ...localValue, rows: newRows })
  }, [localValue, setValue])

  const addRow = useCallback(() => {
    const newRow = new Array(localValue.headers.length).fill('').join('|')
    setValue({ ...localValue, rows: [...localValue.rows, newRow] })
  }, [localValue, setValue])

  const addColumn = useCallback(() => {
    const newHeaders = [...localValue.headers, `Column ${localValue.headers.length + 1}`]
    const newRows = localValue.rows.map(row => row + '|')
    setValue({ headers: newHeaders, rows: newRows })
  }, [localValue, setValue])

  const removeRow = useCallback((index: number) => {
    const newRows = localValue.rows.filter((_, i) => i !== index)
    setValue({ ...localValue, rows: newRows })
  }, [localValue, setValue])

  const removeColumn = useCallback((index: number) => {
    const newHeaders = localValue.headers.filter((_, i) => i !== index)
    const newRows = localValue.rows.map(row => {
      const rowData = row.split('|')
      rowData.splice(index, 1)
      return rowData.join('|')
    })
    setValue({ headers: newHeaders, rows: newRows })
  }, [localValue, setValue])

  const exportToCSV = useCallback(() => {
    const csvContent = [
      localValue.headers.join(','),
      ...localValue.rows.map(row => row.split('|').join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    return url
  }, [localValue])

  return (
    <div className="table-editor">
      <div className="flex justify-between items-center mb-4">
        <div>
          {label && <Label className="text-sm font-medium">{label}</Label>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCsvImport(!showCsvImport)}
          >
            Import CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const url = exportToCSV()
              const a = document.createElement('a')
              a.href = url
              a.download = 'table-data.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
            disabled={localValue.headers.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {showCsvImport && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <Label className="text-sm font-medium mb-2 block">Import from CSV</Label>
          <div className="space-y-2">
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="Paste CSV content here..."
              className="w-full h-32 p-2 border rounded resize-none"
            />
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={handleCsvImport}>
                Import Text
              </Button>
              <div>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileImport}
                  className="hidden"
                  id="csv-file-input"
                />
                <Button type="button" size="sm" variant="outline" asChild>
                  <label htmlFor="csv-file-input">Import File</label>
                </Button>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowCsvImport(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {localValue.headers.map((header, index) => (
                  <th key={index} className="p-2 text-left border-r border-gray-200 min-w-32">
                    <div className="flex items-center gap-1">
                      <Input
                        value={header}
                        onChange={(e) => updateHeader(index, e.target.value)}
                        className="h-8 text-sm font-medium"
                        placeholder={`Column ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeColumn(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </th>
                ))}
                <th className="p-2 w-12">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addColumn}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {localValue.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-200">
                  {localValue.headers.map((_, colIndex) => (
                    <td key={colIndex} className="p-2 border-r border-gray-200">
                      <Input
                        value={row.split('|')[colIndex] || ''}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className="h-8 text-sm"
                        placeholder=""
                      />
                    </td>
                  ))}
                  <td className="p-2 w-12">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRow(rowIndex)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-2 bg-gray-50 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={localValue.headers.length === 0}
          >
            Add Row
          </Button>
        </div>
      </div>

      {localValue.headers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No table data. Click "Add Column" to start or import CSV data.</p>
        </div>
      )}
    </div>
  )
}

export default TableEditor 