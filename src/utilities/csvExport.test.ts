import { convertToCSV, getFormFieldMappings, generateCSVFilename } from './csvExport'

describe('CSV Export Utilities', () => {
  describe('convertToCSV', () => {
    it('should convert data to CSV format', () => {
      const data = [
        { fullName: 'John Doe', email: 'john@example.com', status: 'new' },
        { fullName: 'Jane Smith', email: 'jane@example.com', status: 'replied' },
      ]

      const csv = convertToCSV(data, { collection: 'contact-forms' })

      expect(csv).toContain('fullName,email,status')
      expect(csv).toContain('"John Doe","john@example.com","new"')
      expect(csv).toContain('"Jane Smith","jane@example.com","replied"')
    })

    it('should handle empty data', () => {
      const csv = convertToCSV([], { collection: 'contact-forms' })
      expect(csv).toBe('')
    })

    it('should escape quotes in strings', () => {
      const data = [{ message: 'Hello "world"' }]
      const csv = convertToCSV(data, { collection: 'contact-forms' })
      expect(csv).toContain('"Hello ""world"""')
    })
  })

  describe('getFormFieldMappings', () => {
    it('should return correct fields for contact forms', () => {
      const fields = getFormFieldMappings('contact-forms')
      expect(fields).toContain('fullName')
      expect(fields).toContain('email')
      expect(fields).toContain('message')
      expect(fields).toContain('status')
    })

    it('should return correct fields for donation forms', () => {
      const fields = getFormFieldMappings('donation-forms')
      expect(fields).toContain('donationAmount')
      expect(fields).toContain('paymentMethod')
      expect(fields).toContain('transactionId')
    })

    it('should return empty array for unknown collection', () => {
      const fields = getFormFieldMappings('unknown-collection')
      expect(fields).toEqual([])
    })
  })

  describe('generateCSVFilename', () => {
    it('should generate filename with collection name and date', () => {
      const filename = generateCSVFilename('contact-forms')
      expect(filename).toMatch(/contact_forms_export_\d{4}-\d{2}-\d{2}\.csv/)
    })

    it('should handle custom date', () => {
      const date = new Date('2024-01-15')
      const filename = generateCSVFilename('donation-forms', date)
      expect(filename).toBe('donation_forms_export_2024-01-15.csv')
    })
  })
})
