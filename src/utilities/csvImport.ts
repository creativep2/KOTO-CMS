import type { CollectionConfig, Field } from 'payload'
import type { PayloadRequest } from 'payload'

export interface ImportResult {
  success: boolean
  message: string
  imported: number
  updated: number
  errors: string[]
  skipped: number
}

export interface FieldMapping {
  csvField: string
  collectionField: string
  required: boolean
  type: string
  localized?: boolean
  options?: { label: string; value: string }[]
}

export interface ImportOptions {
  updateExisting?: boolean
  skipErrors?: boolean
  dryRun?: boolean
}

// Function to convert simple HTML-like text to Lexical format
export function convertSimpleTextToLexical(simpleText: string): any {
  if (!simpleText || typeof simpleText !== 'string') {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: '',
                type: 'text',
                style: '',
                detail: 0,
                format: 2,
                version: 1
              }
            ],
            direction: 'ltr',
            textStyle: '',
            textFormat: 2
          }
        ]
      }
    }
  }

  // Split by paragraph tags
  const paragraphs = simpleText.split(/<\/?p>/).filter(p => p.trim())
  
  if (paragraphs.length === 0) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: simpleText.trim(),
                type: 'text',
                style: '',
                detail: 0,
                format: 2,
                version: 1
              }
            ],
            direction: 'ltr',
            textStyle: '',
            textFormat: 2
          }
        ]
      }
    }
  }

  const children = paragraphs.map((paragraph, index) => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        mode: 'normal',
        text: paragraph.trim(),
        type: 'text',
        style: '',
        detail: 0,
        format: 2,
        version: 1
      }
    ],
    direction: 'ltr',
    textStyle: '',
    textFormat: 2
  }))

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children
    }
  }
}

export class CSVImporter {
  private collection: CollectionConfig
  private fieldMappings: FieldMapping[] = []

  constructor(collection: CollectionConfig) {
    this.collection = collection
    this.buildFieldMappings()
  }

  private buildFieldMappings(): void {
    if (!this.collection.fields) return

    this.collection.fields.forEach((field) => {
      if (this.shouldIncludeField(field)) {
        const mapping: FieldMapping = {
          csvField: this.getCSVFieldName(field),
          collectionField: (field as any).name,
          required: (field as any).required || false,
          type: (field as any).type,
          localized: (field as any).localized || false,
        }

        // Handle select fields with options
        if ((field as any).type === 'select' && (field as any).options) {
          mapping.options = (field as any).options
        }

        this.fieldMappings.push(mapping)
      }
    })
  }

  private shouldIncludeField(field: any): boolean {
    // Skip system fields and complex types
    const skipFields = [
      'id',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
      'upload', // Skip file uploads
      'relationship', // Skip relationships for now
      'array', // Skip array fields for now
      'slug', // Skip slug fields as they are auto-generated from titles
    ]

    return !skipFields.includes(field.type) && field.name
  }

  private getCSVFieldName(field: any): string {
    // Convert field name to CSV-friendly format
    return field.name
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  public getFieldMappings(): FieldMapping[] {
    return this.fieldMappings
  }

  public getCSVTemplate(): string {
    const headers = this.fieldMappings.map(mapping => mapping.csvField)
    return headers.join(';') + '\n'
  }

  public async importFromCSV(
    csvData: string,
    options: ImportOptions = {},
    req: PayloadRequest
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      message: '',
      imported: 0,
      updated: 0,
      errors: [],
      skipped: 0,
    }

    try {
      const lines = csvData.trim().split('\n')
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row')
      }

      const headers = this.parseCSVRow(lines[0])
      const dataRows = lines.slice(1)

      // Validate headers
      const requiredFields = this.fieldMappings.filter(m => m.required)
      const missingFields = requiredFields.filter(
        field => !headers.some(header => 
          header.toLowerCase().trim() === field.csvField.toLowerCase().trim()
        )
      )

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.map(f => f.csvField).join(', ')}`)
      }

      // Process each row
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]
        if (!row.trim()) continue

        try {
          const rowData = this.parseCSVRow(row)
          const mappedData = this.mapRowToCollectionData(rowData, headers)
          
          if (options.dryRun) {
            // Just validate the data without saving
            this.validateRowData(mappedData)
            result.imported++
          } else {
            // Actually import/update the data
            const importResult = await this.processRow(mappedData, options, req)
            if (importResult.success) {
              if (importResult.updated) {
                result.updated++
              } else {
                result.imported++
              }
            } else {
              result.errors.push(`Row ${i + 2}: ${importResult.message}`)
              if (!options.skipErrors) {
                throw new Error(`Row ${i + 2}: ${importResult.message}`)
              }
            }
          }
        } catch (error) {
          const errorMsg = `Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`
          result.errors.push(errorMsg)
          if (!options.skipErrors) {
            throw error
          }
          result.skipped++
        }
      }

      result.success = true
      result.message = `Successfully processed ${result.imported + result.updated} records`
      if (result.errors.length > 0) {
        result.message += ` with ${result.errors.length} errors`
      }

    } catch (error) {
      result.message = error instanceof Error ? error.message : 'Unknown error occurred'
      result.errors.push(result.message)
    }

    return result
  }

  private parseCSVRow(row: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    // Detect separator (comma or semicolon)
    const hasComma = row.includes(',')
    const hasSemicolon = row.includes(';')
    const separator = hasSemicolon ? ';' : ','
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === separator && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  private mapRowToCollectionData(rowData: string[], headers: string[]): Record<string, any> {
    const mappedData: Record<string, any> = {}
    
    this.fieldMappings.forEach(mapping => {
      const headerIndex = headers.findIndex(header => 
        header.toLowerCase().trim() === mapping.csvField.toLowerCase().trim()
      )
      
      if (headerIndex !== -1 && headerIndex < rowData.length) {
        let value = rowData[headerIndex]?.trim()
        
        if (value !== undefined && value !== '') {
          // Convert value based on field type
          value = this.convertValueType(value, mapping)
          mappedData[mapping.collectionField] = value
        }
      }
    })
    
    return mappedData
  }

  private convertValueType(value: string, mapping: FieldMapping): any {
    switch (mapping.type) {
      case 'number':
        const num = parseFloat(value)
        return isNaN(num) ? 0 : num
      
      case 'checkbox':
        return ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
      
      case 'date':
        const date = new Date(value)
        return isNaN(date.getTime()) ? new Date() : date.toISOString()
      
      case 'select':
        // Try to find matching option value
        if (mapping.options) {
          const option = mapping.options.find(opt => 
            opt.label.toLowerCase() === value.toLowerCase() ||
            opt.value.toLowerCase() === value.toLowerCase()
          )
          return option ? option.value : value
        }
        return value
      
      case 'richText':
        // Convert simple HTML-like text to Lexical format
        return convertSimpleTextToLexical(value)
      
      default:
        return value
    }
  }

  private validateRowData(data: Record<string, any>): void {
    const requiredFields = this.fieldMappings.filter(m => m.required)
    
    for (const field of requiredFields) {
      if (!data[field.collectionField]) {
        throw new Error(`Missing required field: ${field.collectionField}`)
      }
    }
  }

  private async processRow(
    data: Record<string, any>,
    options: ImportOptions,
    req: PayloadRequest
  ): Promise<{ success: boolean; message: string; updated: boolean }> {
    try {
      // Check if record exists (for update mode)
      if (options.updateExisting) {
        // Try to find existing record by title or name
        const identifier = data.title || data.name || data.product_name
        if (identifier) {
          // This would need to be implemented based on your specific collection
          // For now, we'll just create new records
        }
      }

      // Create new record
      const response = await req.payload.create({
        collection: this.collection.slug as any,
        data,
        req,
      })

      return {
        success: true,
        message: 'Record created successfully',
        updated: false,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create record',
        updated: false,
      }
    }
  }
}

export function createImporter(collection: CollectionConfig): CSVImporter {
  return new CSVImporter(collection)
}

export function getImportableCollections(): string[] {
  // Return collections that support bulk import (exclude forms)
  return [
    'blogs',
    'job-posts',
    'hero-banners',
    'partners',
    'merchandise',
    'youtube-embeds',
    'categories',
    'media'
  ]
} 