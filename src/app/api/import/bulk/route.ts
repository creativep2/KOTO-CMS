import { NextRequest, NextResponse } from 'next/server'
import { createImporter, convertSimpleTextToLexical } from '@/utilities/csvImport'
import { getImportableCollections } from '@/utilities/csvImport'
import { generateUniqueSlug } from '@/utilities/generateUniqueSlug'
import { Blogs } from '@/collections/Blogs'
import { JobPosts } from '@/collections/JobPosts'
import { HeroBanner } from '@/collections/HeroBanner'
import { Partners } from '@/collections/Partners'
import { Merchandise } from '@/collections/Merchandise'
import { YouTubeEmbeds } from '@/collections/YouTubeEmbeds'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const collection = formData.get('collection') as string
    const optionsStr = formData.get('options') as string
    
    if (!file || !collection) {
      return NextResponse.json(
        { success: false, message: 'File and collection are required' },
        { status: 400 }
      )
    }

    // Validate collection
    if (!getImportableCollections().includes(collection)) {
      return NextResponse.json(
        { success: false, message: 'Invalid collection specified' },
        { status: 400 }
      )
    }

    // Parse options
    const options = optionsStr ? JSON.parse(optionsStr) : {}
    
    // Read CSV file
    const csvText = await file.text()
    
    // Get collection config
    const collectionConfig = collections[collection as keyof typeof collections]
    if (!collectionConfig) {
      return NextResponse.json(
        { success: false, message: 'Collection not found' },
        { status: 404 }
      )
    }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })
    
    // Create importer
    const importer = createImporter(collectionConfig)
    
    // Process the CSV data manually since we can't use the importer directly
    const result = await processCSVImport(csvText, collection, payload, options)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Import failed', 
        errors: [error instanceof Error ? error.message : 'Unknown error']
      },
      { status: 500 }
    )
  }
}

async function processCSVImport(
  csvText: string, 
  collection: string, 
  payload: any, 
  options: any
) {
  const result = {
    success: false,
    message: '',
    imported: 0,
    updated: 0,
    errors: [] as string[],
    skipped: 0,
  }

  try {
    // Parse CSV
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row')
    }

    const headers = parseCSVRow(lines[0])
    const dataRows = lines.slice(1)

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      if (!row.trim()) continue

      try {
        const rowData = parseCSVRow(row)
        const mappedData = mapRowToData(rowData, headers, collection)
        
        if (options.dryRun) {
          // Just validate the data without saving
          validateRowData(mappedData, collection)
          result.imported++
        } else {
          // Actually import the data
          const importResult = await createRecord(collection, mappedData, payload)
          if (importResult.success) {
            result.imported++
          } else {
            result.errors.push(`Row ${i + 2}: ${importResult.message}`)
            if (!options.skipErrors) {
              throw new Error(`Row ${i + 2}: ${importResult.message}`)
            }
          }
        }
      } catch (error) {
        const errorMsg = `Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(errorMsg)
        if (!options.skipErrors) {
          throw error
        }
        result.skipped++
      }
    }

    result.success = true
    result.message = `Successfully processed ${result.imported + result.updated} records`
    if (result.errors.length > 0) {
      result.message += ` with ${result.errors.length} errors`
    }

  } catch (error) {
    result.message = error instanceof Error ? error.message : 'Unknown error occurred'
    result.errors.push(result.message)
  }

  return result
}

function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  // Detect separator (comma or semicolon)
  const hasComma = row.includes(',')
  const hasSemicolon = row.includes(';')
  const separator = hasSemicolon ? ';' : ','
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === separator && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

function mapRowToData(rowData: string[], headers: string[], collection: string): Record<string, any> {
  const mappedData: Record<string, any> = {}
  
  // Map headers to data based on collection
  headers.forEach((header, index) => {
    if (index < rowData.length) {
      let value = rowData[index]?.trim()
      
      if (value !== undefined && value !== '') {
        // Convert value based on field type
        value = convertValueType(value, header, collection)
        
        // Map CSV headers to actual field names
        const fieldName = mapHeaderToFieldName(header, collection)
        if (fieldName) {
          mappedData[fieldName] = value
        }
      }
    }
  })
  
  return mappedData
}

function mapHeaderToFieldName(header: string, collection: string): string | null {
  const lowerHeader = header.toLowerCase().trim()
  
  // Common field mappings
  const fieldMappings: Record<string, Record<string, string>> = {
    'blogs': {
      'title': 'title',
      'category': 'category',
      'status': 'status',
      'upload date': 'upload_date',
      'publishedat': 'publishedAt',
      'meta description': 'meta_description',
      'meta title': 'meta_title',
      'featured': 'featured',
      'tags': 'tags',
      'paragraph': 'paragraph',
      'content': 'paragraph',
      // Note: header_image and slug are excluded as we don't handle image uploads and auto-generate slugs
    },
    'job-posts': {
      'title': 'title',
      'location': 'location',
      'summary': 'summary',
      'description': 'description',
      'publishedat': 'publishedAt',
      'status': 'status',
      'header image': 'header_image',
      // Note: slug is auto-generated from title
    },
    'partners': {
      'name': 'name',
      'website': 'website',
      'description': 'description',
      'status': 'status',
      'category': 'category',
      'featured': 'featured',
      // Note: slug is auto-generated from name
    },
    'merchandise': {
      'organization name': 'organization_name',
      'product name': 'product_name',
      'price': 'price',
      'description': 'description',
      'status': 'status',
    },
    'hero-banners': {
      'title': 'title',
      'tagline': 'tagline',
      'description': 'description',
      'button': 'button',
      'button link': 'buttonLink',
      'status': 'status',
      'featured': 'featured',
      'order': 'order',
    },
    'youtube-embeds': {
      'video id': 'video_id',
      'title': 'title',
      'description': 'description',
    },
    'categories': {
      'name': 'name',
      'description': 'description',
      // Note: slug is auto-generated from name
    },
  }
  
  const collectionMappings = fieldMappings[collection]
  if (!collectionMappings) return null
  
  // Find the best match for the header
  for (const [key, value] of Object.entries(collectionMappings)) {
    if (lowerHeader === key || lowerHeader.includes(key) || key.includes(lowerHeader)) {
      return value
    }
  }
  
  // If no exact match, try to find a partial match
  for (const [key, value] of Object.entries(collectionMappings)) {
    if (lowerHeader.includes(key) || key.includes(lowerHeader)) {
      return value
    }
  }
  
  return null
}

function convertValueType(value: string, header: string, collection: string): any {
  const lowerHeader = header.toLowerCase()
  
  // Handle specific field types
  if (lowerHeader.includes('date') || lowerHeader.includes('published') || lowerHeader.includes('upload')) {
    const date = new Date(value)
    return isNaN(date.getTime()) ? new Date() : date.toISOString()
  }
  
  if (lowerHeader.includes('featured')) {
    return ['true', '1', 'yes', 'on', 'active', 'published'].includes(value.toLowerCase())
  }
  
  if (lowerHeader.includes('price') || lowerHeader.includes('order')) {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }
  
  // Handle rich text fields
  if (lowerHeader.includes('paragraph') || lowerHeader.includes('content') || lowerHeader.includes('description') || lowerHeader.includes('summary')) {
    return convertSimpleTextToLexical(value)
  }
  
  // Handle status fields - ensure they are valid enum values
  if (lowerHeader.includes('status')) {
    return validateStatusValue(value, collection)
  }
  
  // Handle category fields - ensure they are valid enum values
  if (lowerHeader.includes('category')) {
    return validateCategoryValue(value, collection)
  }
  
  return value
}

function validateStatusValue(value: string, collection: string): string {
  const lowerValue = value.toLowerCase().trim()
  
  // Collection-specific status validations
  switch (collection) {
    case 'blogs':
      const validBlogStatuses = ['draft', 'review', 'published', 'archived']
      if (validBlogStatuses.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['draft', 'drafts'].includes(lowerValue)) return 'draft'
      if (['review', 'in review', 'in-review'].includes(lowerValue)) return 'review'
      if (['published', 'publish', 'live'].includes(lowerValue)) return 'published'
      if (['archived', 'archive'].includes(lowerValue)) return 'archived'
      // Default to draft if invalid
      console.warn(`Invalid blog status: "${value}", defaulting to "draft"`)
      return 'draft'
      
    case 'job-posts':
      const validJobStatuses = ['draft', 'published']
      if (validJobStatuses.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['draft', 'drafts'].includes(lowerValue)) return 'draft'
      if (['published', 'publish', 'live', 'active'].includes(lowerValue)) return 'published'
      // Default to draft if invalid
      console.warn(`Invalid job status: "${value}", defaulting to "draft"`)
      return 'draft'
      
    case 'partners':
      const validPartnerStatuses = ['active', 'inactive']
      if (validPartnerStatuses.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['active', 'act', 'live', 'enabled'].includes(lowerValue)) return 'active'
      if (['inactive', 'inact', 'disabled', 'off'].includes(lowerValue)) return 'inactive'
      // Default to active if invalid
      console.warn(`Invalid partner status: "${value}", defaulting to "active"`)
      return 'active'
      
    case 'merchandise':
      const validMerchandiseStatuses = ['available', 'out_of_stock', 'discontinued']
      if (validMerchandiseStatuses.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['available', 'avail', 'in stock', 'instock'].includes(lowerValue)) return 'available'
      if (['out_of_stock', 'out of stock', 'outofstock', 'oos'].includes(lowerValue)) return 'out_of_stock'
      if (['discontinued', 'disc', 'discon'].includes(lowerValue)) return 'discontinued'
      // Default to available if invalid
      console.warn(`Invalid merchandise status: "${value}", defaulting to "available"`)
      return 'available'
      
    case 'hero-banners':
      const validBannerStatuses = ['active', 'inactive', 'draft']
      if (validBannerStatuses.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['active', 'act', 'live', 'enabled'].includes(lowerValue)) return 'active'
      if (['inactive', 'inact', 'disabled', 'off'].includes(lowerValue)) return 'inactive'
      if (['draft', 'drafts'].includes(lowerValue)) return 'draft'
      // Default to active if invalid
      console.warn(`Invalid banner status: "${value}", defaulting to "active"`)
      return 'active'
      
    default:
      return value
  }
}

function validateCategoryValue(value: string, collection: string): string {
  const lowerValue = value.toLowerCase().trim()
  
  // Collection-specific category validations
  switch (collection) {
    case 'blogs':
      const validBlogCategories = [
        'taste-the-story',
        'jimmys-letters', 
        'jimmys-bio',
        'behind-the-bar',
        'her-turn',
        'koto-foundation'
      ]
      if (validBlogCategories.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['taste the story', 'taste-the-story', 'tastethestory'].includes(lowerValue)) return 'taste-the-story'
      if (['jimmys letters', 'jimmys-letters', 'jimmysletters'].includes(lowerValue)) return 'jimmys-letters'
      if (['jimmys bio', 'jimmys-bio', 'jimmysbio'].includes(lowerValue)) return 'jimmys-bio'
      if (['behind the bar', 'behind-the-bar', 'behindthebar'].includes(lowerValue)) return 'behind-the-bar'
      if (['her turn', 'her-turn', 'herturn'].includes(lowerValue)) return 'her-turn'
      if (['koto foundation', 'koto-foundation', 'kotofoundation'].includes(lowerValue)) return 'koto-foundation'
      // Default to taste-the-story if invalid
      console.warn(`Invalid blog category: "${value}", defaulting to "taste-the-story"`)
      return 'taste-the-story'
      
    case 'partners':
      const validPartnerCategories = [
        'strategic',
        'key',
        'education',
        'tourism-hospitality'
      ]
      if (validPartnerCategories.includes(lowerValue)) {
        return lowerValue
      }
      // Try to map common variations
      if (['strategic', 'strategy', 'strategic partners'].includes(lowerValue)) return 'strategic'
      if (['key', 'key partners', 'main'].includes(lowerValue)) return 'key'
      if (['education', 'edu', 'educational'].includes(lowerValue)) return 'education'
      if (['tourism-hospitality', 'tourism', 'hospitality', 'tourism hospitality'].includes(lowerValue)) return 'tourism-hospitality'
      // Default to strategic if invalid
      console.warn(`Invalid partner category: "${value}", defaulting to "strategic"`)
      return 'strategic'
      
    default:
      return value
  }
}

function validateRowData(data: Record<string, any>, collection: string): void {
  // Basic validation - ensure we have some data
  if (Object.keys(data).length === 0) {
    throw new Error('No valid data found in row')
  }
  
  // Collection-specific validation
  switch (collection) {
    case 'blogs':
      if (!data.title) {
        throw new Error('Blog title is required')
      }
      if (!data.category) {
        throw new Error('Blog category is required')
      }
      if (!data.status) {
        throw new Error('Blog status is required')
      }
      if (!data.paragraph) {
        throw new Error('Blog content (paragraph) is required')
      }
      // Note: header_image is not required for CSV imports
      break
    case 'job-posts':
      if (!data.title) {
        throw new Error('Job title is required')
      }
      if (!data.location) {
        throw new Error('Job location is required')
      }
      if (!data.summary) {
        throw new Error('Job summary is required')
      }
      break
    case 'partners':
      if (!data.name) {
        throw new Error('Partner name is required')
      }
      break
    case 'merchandise':
      if (!data.product_name) {
        throw new Error('Product name is required')
      }
      if (!data.organization_name) {
        throw new Error('Organization name is required')
      }
      if (!data.price) {
        throw new Error('Product price is required')
      }
      break
    case 'hero-banners':
      if (!data.title) {
        throw new Error('Banner title is required')
      }
      break
    case 'youtube-embeds':
      if (!data.video_id) {
        throw new Error('Video ID is required')
      }
      break
    case 'categories':
      if (!data.name) {
        throw new Error('Category name is required')
      }
      break
  }
}

async function createRecord(collection: string, data: Record<string, any>, payload: any) {
  try {
    // Handle array fields
    const cleanData = { ...data }
    if (cleanData.tags && typeof cleanData.tags === 'string') {
      cleanData.tags = cleanData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    }
    
    // Handle image fields - set to undefined for CSV imports
    if (collection === 'blogs') {
      cleanData.header_image = undefined
    }
    if (collection === 'job-posts') {
      cleanData.header_image = undefined
    }
    if (collection === 'partners') {
      cleanData.logo = undefined
    }
    if (collection === 'merchandise') {
      cleanData.product_image = undefined
    }
    if (collection === 'hero-banners') {
      cleanData.image = undefined
    }
    
    // Auto-generate unique slug from title/name
    try {
      if (collection === 'blogs' && cleanData.title) {
        cleanData.slug = await generateUniqueSlug(cleanData.title, collection, payload)
      } else if (collection === 'job-posts' && cleanData.title) {
        cleanData.slug = await generateUniqueSlug(cleanData.title, collection, payload)
      } else if (collection === 'partners' && cleanData.name) {
        cleanData.slug = await generateUniqueSlug(cleanData.name, collection, payload)
      } else if (collection === 'categories' && cleanData.name) {
        cleanData.slug = await generateUniqueSlug(cleanData.name, collection, payload)
      }
    } catch (slugError) {
      console.warn(`Failed to generate slug for ${collection}:`, slugError)
      // Continue without slug if generation fails
    }
    
    // Create the record
    const response = await payload.create({
      collection,
      data: cleanData,
    })

    return {
      success: true,
      message: 'Record created successfully',
      updated: false,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create record',
      updated: false,
    }
  }
}

 