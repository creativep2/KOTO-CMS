import { NextRequest } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  const payload = await getPayloadHMR({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const localeParam = searchParams.get('locale')
  const locale = (localeParam === 'vi' || localeParam === 'en') ? localeParam : 'en'
  
  try {
    const pages = await payload.find({
      collection: 'pages',
      locale,
      depth: 1,
      pagination: false,
    })

    return Response.json({
      success: true,
      data: pages.docs,
      totalDocs: pages.totalDocs,
    })
  } catch (error: any) {
    console.error('Error fetching pages:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch pages',
        message: error.message,
      },
      { status: 500 }
    )
  }
} 