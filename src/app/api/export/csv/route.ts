import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { convertToCSV, getFormFieldMappings, generateCSVFilename } from '@/utilities/csvExport'

export async function POST(request: NextRequest) {
  try {
    const { collection, fields, filters } = await request.json()

    // Validate collection
    const validCollections = [
      'contact-forms',
      'donation-forms',
      'booking-forms',
      'in-kind-support-forms',
    ]
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection specified' }, { status: 400 })
    }

    // Get field mappings for the collection
    const fieldMappings = getFormFieldMappings(collection)
    const exportFields = fields || fieldMappings

    // Build query
    const query: { limit: number; depth: number; where?: unknown } = {
      limit: 1000, // Adjust as needed
      depth: 0,
    }

    // Add filters if provided
    if (filters) {
      query.where = filters
    }

    // Initialize payload
    const payload = await getPayload({
      config: configPromise,
    })

    // Fetch data from the collection
    const result = await payload.find({
      collection,
      ...query,
    })

    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json({ error: 'No data found for export' }, { status: 404 })
    }

    // Convert to CSV
    const csvData = convertToCSV(result.docs, {
      collection,
      fields: exportFields,
      includeHeaders: true,
    })

    // Generate filename
    const filename = generateCSVFilename(collection)

    // Return CSV as downloadable file
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  const { searchParams } = new URL(_request.url)
  const collection = searchParams.get('collection')

  if (!collection) {
    return NextResponse.json({ error: 'Collection parameter is required' }, { status: 400 })
  }

  try {
    // Validate collection
    const validCollections = [
      'contact-forms',
      'donation-forms',
      'booking-forms',
      'in-kind-support-forms',
    ]
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection specified' }, { status: 400 })
    }

    // Get field mappings for the collection
    const fieldMappings = getFormFieldMappings(collection)

    return NextResponse.json({
      collection,
      availableFields: fieldMappings,
      message: 'CSV export endpoint ready',
    })
  } catch (error) {
    console.error('CSV export info error:', error)
    return NextResponse.json({ error: 'Failed to get export information' }, { status: 500 })
  }
}
