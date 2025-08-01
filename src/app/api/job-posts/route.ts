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

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse query parameters from the request URL
    const { searchParams } = new URL(_request.url)
    const depth = searchParams.get('depth') || '0'
    const limit = searchParams.get('limit') || '10'
    const page = searchParams.get('page') || '1'
    const location = searchParams.get('location')
    const status = searchParams.get('status') || 'published'

    // Build where clause
    const where: any = {
      status: {
        equals: status,
      },
    }

    // Add location filter if provided
    if (location) {
      where.location = {
        contains: location,
      }
    }

    const result = await payload.find({
      collection: 'job-posts',
      where,
      sort: '-publishedAt', // Sort by publishedAt in descending order (latest first)
      depth: parseInt(depth),
      limit: parseInt(limit),
      page: parseInt(page),
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
    console.error('Error fetching job posts:', error)
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
