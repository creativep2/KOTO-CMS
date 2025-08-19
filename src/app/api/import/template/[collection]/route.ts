import { NextRequest, NextResponse } from 'next/server'
import { createImporter, type FieldMapping } from '@/utilities/csvImport'
import { Blogs } from '@/collections/Blogs'
import { JobPosts } from '@/collections/JobPosts'
import { HeroBanner } from '@/collections/HeroBanner'
import { Partners } from '@/collections/Partners'
import { Merchandise } from '@/collections/Merchandise'
import { YouTubeEmbeds } from '@/collections/YouTubeEmbeds'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'

// Collection mapping
const collections = {
  'blogs': Blogs,
  'job-posts': JobPosts,
  'hero-banners': HeroBanner,
  'partners': Partners,
  'merchandise': Merchandise,
  'youtube-embeds': YouTubeEmbeds,
  'categories': Categories,
  'media': Media,
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params
    
    // Get collection config
    const collectionConfig = collections[collection as keyof typeof collections]
    if (!collectionConfig) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Create importer to get field mappings
    const importer = createImporter(collectionConfig)
    const fieldMappings = importer.getFieldMappings()
    
    // Generate CSV template
    const headers = fieldMappings.map(mapping => mapping.csvField)
    const csvContent = headers.join(';') + '\n'
    
    // Add example row with field descriptions
    const exampleRow = fieldMappings.map(mapping => {
      if (mapping.required) {
        if (mapping.type === 'richText') {
          return `[Required: Use <p> tags for paragraphs]`
        }
        if (mapping.type === 'select') {
          return getSelectFieldDescription(mapping, collection)
        }
        return `[Required: ${mapping.type}]`
      }
      if (mapping.type === 'richText') {
        return `[Optional: Use <p> tags for paragraphs]`
      }
      if (mapping.type === 'select') {
        return getSelectFieldDescription(mapping, collection)
      }
      return `[Optional: ${mapping.type}]`
    })
    const csvWithExample = csvContent + exampleRow.join(';') + '\n'
    
    // Create response with CSV content
    const response = new NextResponse(csvWithExample)
    response.headers.set('Content-Type', 'text/csv')
    response.headers.set('Content-Disposition', `attachment; filename="${collection}_template.csv"`)
    
    return response
    
  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}

function getSelectFieldDescription(mapping: FieldMapping, collection: string): string {
  const fieldName = mapping.collectionField
  
  switch (collection) {
    case 'blogs':
      if (fieldName === 'status') {
        return '[Required: draft, review, published, or archived]'
      }
      if (fieldName === 'category') {
        return '[Required: taste-the-story, jimmys-letters, jimmys-bio, behind-the-bar, her-turn, or koto-foundation]'
      }
      break
    case 'job-posts':
      if (fieldName === 'status') {
        return '[Required: draft or published]'
      }
      break
    case 'partners':
      if (fieldName === 'status') {
        return '[Required: active or inactive]'
      }
      if (fieldName === 'category') {
        return '[Required: strategic, key, education, or tourism-hospitality]'
      }
      break
    case 'merchandise':
      if (fieldName === 'status') {
        return '[Required: available, out_of_stock, or discontinued]'
      }
      break
    case 'hero-banners':
      if (fieldName === 'status') {
        return '[Required: active, inactive, or draft]'
      }
      break
  }
  
  return `[Required: ${mapping.type}]`
} 