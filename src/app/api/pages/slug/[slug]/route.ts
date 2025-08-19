import { NextRequest } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const payload = await getPayloadHMR({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const localeParam = searchParams.get('locale')
  const locale = (localeParam === 'vi' || localeParam === 'en') ? localeParam : 'en'
  
  try {
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: params.slug,
        },
      },
      locale,
      depth: 1,
      limit: 1,
    })

    if (pages.docs.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'Page not found',
          message: `No page found with slug: ${params.slug}`,
        },
        { status: 404 }
      )
    }

    const page = pages.docs[0]

    return Response.json({
      success: true,
      data: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        meta_image: page.meta_image,
        content: page.content,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Error fetching page:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch page',
        message: error.message,
      },
      { status: 500 }
    )
  }
} 