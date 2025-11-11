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
  request: NextRequest,
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
    const locale = searchParams.get('locale') || 'en'

    // Validate locale parameter
    const validLocales = ['en', 'vi']
    if (!validLocales.includes(locale)) {
      const response = NextResponse.json({ error: 'Invalid locale. Supported locales: en, vi' }, { status: 400 })
      return addCorsHeaders(response)
    }

    const result = await payload.find({
      collection: 'job-posts',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: parseInt(depth),
      limit: 1,
      locale: locale as 'en' | 'vi',
    })

    if (result.docs.length === 0) {
      const response = NextResponse.json({ error: 'Job post not found' }, { status: 404 })
      return addCorsHeaders(response)
    }

    // Return the job post directly (not wrapped in docs array)
    const response = NextResponse.json(result.docs[0])
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching job post by slug:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}
