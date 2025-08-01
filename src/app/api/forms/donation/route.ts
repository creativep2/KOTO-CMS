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
      !body.donationAmount ||
      !body.paymentMethod ||
      !body.howDidYouHearAboutUs
    ) {
      const response = NextResponse.json(
        {
          error:
            'Missing required fields: fullName, email, donationAmount, paymentMethod, and howDidYouHearAboutUs are required',
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

    // Validate donation amount
    const donationAmount = parseFloat(body.donationAmount)
    if (isNaN(donationAmount) || donationAmount <= 0) {
      const response = NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 })
      return addCorsHeaders(response)
    }

    // Validate payment method
    const validPaymentMethods = ['credit-card', 'paypal', 'bank-transfer', 'check', 'cash', 'other']
    if (!validPaymentMethods.includes(body.paymentMethod)) {
      const response = NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
      return addCorsHeaders(response)
    }

    // Validate how did you hear about us
    const validSources = [
      'social-media',
      'website',
      'friend-family',
      'search-engine',
      'advertisement',
      'event',
      'other',
    ]
    if (!validSources.includes(body.howDidYouHearAboutUs)) {
      const response = NextResponse.json({ error: 'Invalid source selection' }, { status: 400 })
      return addCorsHeaders(response)
    }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Create the donation form submission with only allowed fields
    const donationForm = await payload.create({
      collection: 'donation-forms',
      data: {
        fullName: body.fullName,
        email: body.email,
        donationAmount: donationAmount.toString(), // Convert back to string for text field
        paymentMethod: body.paymentMethod,
        howDidYouHearAboutUs: body.howDidYouHearAboutUs,
        status: 'pending', // Default status - cannot be changed via API
      },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Donation form submitted successfully',
        id: donationForm.id,
      },
      { status: 201 },
    )
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Donation form submission error:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}

// Handle CORS preflight requests
export async function OPTIONS(_request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}
