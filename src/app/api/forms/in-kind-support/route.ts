import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

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
      return NextResponse.json(
        {
          error:
            'Missing required fields: fullName, email, phoneNumber, deliveryPreference, and message are required',
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate delivery preference
    const validDeliveryPreferences = ['delivery', 'pickup', 'either']
    if (!validDeliveryPreferences.includes(body.deliveryPreference)) {
      return NextResponse.json({ error: 'Invalid delivery preference' }, { status: 400 })
    }

    // Create the in-kind support form submission
    const inKindSupportForm = await payload.create({
      collection: 'in-kind-support-forms',
      data: {
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        deliveryPreference: body.deliveryPreference,
        message: body.message,
        itemType: body.itemType || '',
        estimatedValue: body.estimatedValue ? parseFloat(body.estimatedValue) : undefined,
        status: 'new', // Default status
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'In-kind support form submitted successfully',
        id: inKindSupportForm.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('In-kind support form submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
