import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
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
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    // Return the blog post directly (not wrapped in docs array)
    return NextResponse.json(result.docs[0])
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
