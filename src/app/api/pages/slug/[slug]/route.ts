import { NextRequest } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { transformPageData } from '@/utilities/transformTableData'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const payload = await getPayloadHMR({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const localeParam = searchParams.get('locale')
  const locale = (localeParam === 'vi' || localeParam === 'en') ? localeParam : 'en'
  const raw = searchParams.get('raw') === 'true'
  
  try {
    const { slug } = await params
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
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
          message: `No page found with slug: ${slug}`,
        },
        { status: 404 }
      )
    }

    const page = pages.docs[0]

    // Transform the table data to be more user-friendly (unless raw is requested)
    const transformedPage = transformPageData(page, raw)

    return Response.json({
      success: true,
      data: {
        id: transformedPage.id,
        title: transformedPage.title,
        slug: transformedPage.slug,
        meta_title: transformedPage.meta_title,
        meta_description: transformedPage.meta_description,
        meta_image: transformedPage.meta_image,
        content: transformedPage.content,
        createdAt: transformedPage.createdAt,
        updatedAt: transformedPage.updatedAt,
      },
    })
  } catch (error: unknown) {
    console.error('Error fetching page:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch page',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
} 