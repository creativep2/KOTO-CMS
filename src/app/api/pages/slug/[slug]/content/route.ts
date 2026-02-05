import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Helper function to add CORS headers
const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Handle preflight OPTIONS requests
export async function OPTIONS(_request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params
    if (!slug) {
      return addCorsHeaders(
        NextResponse.json({ error: 'Slug is required' }, { status: 400 }),
      )
    }

    const payload = await getPayload({ config: configPromise })

    const { searchParams } = new URL(_request.url)
    const status = searchParams.get('status') || 'published'
    const locale = searchParams.get('locale') || 'en'

    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        status: { equals: status },
      },
      depth: 0,
      limit: 1,
      locale: locale as 'en' | 'vi',
    })

    const page = result.docs[0]
    if (!page) {
      return addCorsHeaders(
        NextResponse.json({ error: 'Page not found' }, { status: 404 }),
      )
    }

    // Return only the content value (may be object, array, or primitive)
    const content = 'content' in page ? page.content : undefined

    return addCorsHeaders(NextResponse.json(content ?? null))
  } catch (error) {
    console.error('Error fetching page content:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
    return addCorsHeaders(response)
  }
}
