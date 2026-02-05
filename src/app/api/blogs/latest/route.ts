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

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url)
    const depth = searchParams.get('depth') || '1' // Default to depth 1 for latest blogs
    const limit = searchParams.get('limit') || '5' // Default to 5 latest blogs
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const excludeId = searchParams.get('excludeId') // To exclude current blog when showing related
    const locale = searchParams.get('locale') || 'en'

    // Build where clause - only published blogs
    const where: any = {
      status: {
        equals: 'published',
      },
      publishedAt: {
        exists: true, // Only blogs that have been published
      },
    }

    // Add category filter if provided
    if (category) {
      where.category = {
        equals: category,
      }
    }

    // Add featured filter if provided
    if (featured !== null && featured !== undefined) {
      where.featured = {
        equals: featured === 'true',
      }
    }

    // Exclude specific blog if provided
    if (excludeId) {
      where.id = {
        not_equals: excludeId,
      }
    }

    const result = await payload.find({
      collection: 'blogs',
      where,
      sort: '-publishedAt', // Sort by publishedAt in descending order (latest first)
      depth: parseInt(depth),
      limit: parseInt(limit),
      locale: locale as 'en' | 'vi' | 'all',
    })

    const response = NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
    })

    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching latest blogs:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}
