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
    if (
      !body.fullName ||
      !body.email ||
      !body.phoneNumber ||
      !body.deliveryPreference ||
      !body.message
    ) {
      const response = NextResponse.json(
        {
          error:
            'Missing required fields: fullName, email, phoneNumber, deliveryPreference, and message are required',
        },
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

    // // Validate delivery preference
    // const validDeliveryPreferences = ['delivery', 'pickup', 'either']
    // if (!validDeliveryPreferences.includes(body.deliveryPreference)) {
    //   const response = NextResponse.json({ error: 'Invalid delivery preference' }, { status: 400 })
    //   return addCorsHeaders(response)
    // }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Create the in-kind support form submission with only allowed fields
    const inKindSupportForm = await payload.create({
      collection: 'in-kind-support-forms',
      data: {
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        deliveryPreference: body.deliveryPreference,
        message: body.message,
        itemType: body.itemType || '',
        estimatedValue:
          body.estimatedValue && !isNaN(parseFloat(body.estimatedValue))
            ? parseFloat(body.estimatedValue).toString() // Convert back to string for text field
            : undefined,
        status: 'new', // Default status - cannot be changed via API
      },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'In-kind support form submitted successfully',
        id: inKindSupportForm.id,
      },
      { status: 201 },
    )
    return addCorsHeaders(response)
  } catch (error) {
    console.error('In-kind support form submission error:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}

// Handle CORS preflight requests
export async function OPTIONS(_request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}
