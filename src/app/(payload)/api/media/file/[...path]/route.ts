import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await params
    const filename = pathSegments.join('/')

    // Validate filename to prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/') || !filename) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Try to get media record from database first (optional - for future enhancements)
    let mediaRecord = null
    try {
      const payload = await getPayload({ config: configPromise })
      const mediaQuery = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: filename,
          },
        },
        limit: 1,
      })
      mediaRecord = mediaQuery.docs[0]
    } catch (dbError) {
      // Continue without database lookup if it fails
      console.warn('Could not fetch media record from database:', dbError)
    }

    // Check if media is public (if we have a record)
    if (mediaRecord && mediaRecord.isPublic === false) {
      return NextResponse.json({ error: 'Media not publicly accessible' }, { status: 403 })
    }

    const filePath = path.join(process.cwd(), 'public', 'media', filename)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Get file stats for better headers
    const stats = await fs.stat(filePath)

    // Read the file
    const fileBuffer = await fs.readFile(filePath)

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    const contentType = getContentType(ext)

    // Set appropriate headers
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': stats.size.toString(),
    }

    // Add ETag for caching
    const etag = `"${stats.size}-${stats.mtime.getTime()}"`
    headers['ETag'] = etag

    // Check if client has cached version
    const ifNoneMatch = request.headers.get('if-none-match')
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 })
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, { headers })
  } catch (error) {
    console.error('Error serving media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getContentType(ext: string): string {
  const contentTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.json': 'application/json',
  }

  return contentTypes[ext] || 'application/octet-stream'
}
