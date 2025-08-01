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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    if (!slug) {
      const response = NextResponse.json({ error: 'Slug is required' }, { status: 400 })
      return addCorsHeaders(response)
    }

    const payload = await getPayload({ config: configPromise })

    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url)
    const depth = searchParams.get('depth') || '0'

    const result = await payload.find({
      collection: 'blogs',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: parseInt(depth),
      limit: 1,
    })

    if (result.docs.length === 0) {
      const response = NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      return addCorsHeaders(response)
    }

    // Return the blog post directly (not wrapped in docs array)
    const response = NextResponse.json(result.docs[0])
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}
