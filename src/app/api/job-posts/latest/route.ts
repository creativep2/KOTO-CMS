import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Helper function to add CORS headers
const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Handle preflight OPTIONS requests
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse query parameters from the request URL
    const { searchParams } = new URL(_request.url)
    const depth = searchParams.get('depth') || '1' // Default to depth 1 for latest job posts
    const limit = searchParams.get('limit') || '5' // Default to 5 latest job posts
    const location = searchParams.get('location')
    const excludeId = searchParams.get('excludeId') // To exclude current job post when showing related
    const locale = searchParams.get('locale') || 'en'

    // Build where clause - only published job posts
    const where: any = {
      status: {
        equals: 'published',
      },
      publishedAt: {
        exists: true, // Only job posts that have been published
      },
    }

    // Add location filter if provided
    if (location) {
      where.location = {
        contains: location,
      }
    }

    // Exclude specific job post if provided
    if (excludeId) {
      where.id = {
        not_equals: excludeId,
      }
    }

    const result = await payload.find({
      collection: 'job-posts',
      where,
      sort: '-publishedAt', // Sort by publishedAt in descending order (latest first)
      depth: parseInt(depth),
      limit: parseInt(limit),
      locale: locale as 'en' | 'vi',
    })

    const response = NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
    })

    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching latest job posts:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}
