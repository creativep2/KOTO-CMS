import type { PayloadRequest } from 'payload'

export interface CSVExportOptions {
  collection: string
  fields?: string[]
  dateFormat?: string
  includeHeaders?: boolean
}

export interface FormData {
  [key: string]: any
}

/**
 * Convert form data to CSV format
 */
export function convertToCSV(data: FormData[], options: CSVExportOptions): string {
  if (!data || data.length === 0) {
    return ''
  }

  const { fields, includeHeaders = true } = options

  // Get all unique fields from the data if not specified
  const allFields = fields || Object.keys(data[0] || {})

  // Filter out internal Payload fields
  const exportableFields = allFields.filter(
    (field) =>
      !field.startsWith('_') && field !== 'id' && field !== 'createdAt' && field !== 'updatedAt',
  )

  let csv = ''

  // Add headers
  if (includeHeaders) {
    csv += exportableFields.map((field) => `"${field}"`).join(',') + '\n'
  }

  // Add data rows
  data.forEach((row) => {
    const values = exportableFields.map((field) => {
      let value = row[field]

      // Handle different data types
      if (value === null || value === undefined) {
        return '""'
      }

      if (typeof value === 'object') {
        // Handle nested objects or arrays
        value = JSON.stringify(value)
      } else if (typeof value === 'string') {
        // Escape quotes in strings
        value = value.replace(/"/g, '""')
      }

      return `"${value}"`
    })

    csv += values.join(',') + '\n'
  })

  return csv
}

/**
 * Get field mappings for different form collections
 */
export function getFormFieldMappings(collection: string): string[] {
  const mappings: { [key: string]: string[] } = {
    'contact-forms': ['fullName', 'email', 'message', 'status', 'notes', 'createdAt', 'updatedAt'],
    'donation-forms': [
      'fullName',
      'email',
      'donationAmount',
      'paymentMethod',
      'howDidYouHearAboutUs',
      'status',
      'transactionId',
      'notes',
      'createdAt',
      'updatedAt',
    ],
    'booking-forms': [
      'fullName',
      'email',
      'phoneNumber',
      'nationality',
      'restaurant',
      'reservationDate',
      'reservationTime',
      'numberOfGuests',
      'specialOccasion',
      'specialOccasionType',
      'specialRequests',
      'status',
      'confirmationNumber',
      'notes',
      'createdAt',
      'updatedAt',
    ],
    'in-kind-support-forms': [
      'fullName',
      'email',
      'phoneNumber',
      'deliveryPreference',
      'message',
      'status',
      'itemType',
      'estimatedValue',
      'notes',
      'createdAt',
      'updatedAt',
    ],
  }

  return mappings[collection] || []
}

/**
 * Format date for CSV export
 */
export function formatDateForCSV(
  date: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * Generate filename for CSV export
 */
export function generateCSVFilename(collection: string, date?: Date): string {
  const timestamp = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  const collectionName = collection.replace('-', '_')
  return `${collectionName}_export_${timestamp}.csv`
}
