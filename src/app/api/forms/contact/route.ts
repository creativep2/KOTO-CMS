import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// CORS headers helper function
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.fullName || !body.email || !body.message) {
      const response = NextResponse.json(
        { error: 'Missing required fields: fullName, email, and message are required' },
        { status: 400 },
      )
      return addCorsHeaders(response)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      const response = NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      return addCorsHeaders(response)
    }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Create the contact form submission
    const contactForm = await payload.create({
      collection: 'contact-forms',
      data: {
        fullName: body.fullName,
        email: body.email,
        message: body.message,
        status: 'new', // Default status
      },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        id: contactForm.id,
      },
      { status: 201 },
    )
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Contact form submission error:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}
