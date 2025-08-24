import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { REST_POST, REST_PUT, REST_DELETE } from '@payloadcms/next/routes'

// Helper function to add CORS headers
const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Handle preflight OPTIONS requests
export async function OPTIONS(_request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

// GET method for fetching hero banners with custom filtering and ordering
export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse query parameters from the request URL
    const { searchParams } = new URL(_request.url)
    const depth = searchParams.get('depth') || '0'
    const limit = searchParams.get('limit') || '10'
    const page = searchParams.get('page') || '1'
    const status = searchParams.get('status') || 'active'
    const featured = searchParams.get('featured')
    const locale = searchParams.get('locale') || 'en'
    const sortBy = searchParams.get('sortBy') || 'order' // Default sort by order field
    const sortOrder = searchParams.get('sortOrder') || 'asc' // Default ascending order

    // Build where clause
    const where: any = {
      status: {
        equals: status,
      },
    }

    // Add featured filter if provided
    if (featured !== null && featured !== undefined) {
      where.featured = {
        equals: featured === 'true',
      }
    }

    // Build sort configuration
    let sort: string
    if (sortBy === 'order') {
      sort = sortOrder === 'desc' ? '-order' : 'order'
    } else if (sortBy === 'createdAt') {
      sort = sortOrder === 'desc' ? '-createdAt' : 'createdAt'
    } else if (sortBy === 'updatedAt') {
      sort = sortOrder === 'desc' ? '-updatedAt' : 'updatedAt'
    } else {
      // Default to order field if invalid sortBy
      sort = sortOrder === 'desc' ? '-order' : 'order'
    }

    const result = await payload.find({
      collection: 'hero-banners',
      where,
      sort,
      depth: parseInt(depth),
      limit: parseInt(limit),
      page: parseInt(page),
      locale: locale as 'en' | 'vi' | 'all',
    })

    const response = NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    })

    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching hero banners:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}

// POST method - delegate to Payload's built-in API
export const POST = REST_POST(configPromise)

// PUT method - delegate to Payload's built-in API
export const PUT = REST_PUT(configPromise)

// DELETE method - delegate to Payload's built-in API
export const DELETE = REST_DELETE(configPromise) 