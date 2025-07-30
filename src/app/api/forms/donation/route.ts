import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

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
      return NextResponse.json(
        {
          error:
            'Missing required fields: fullName, email, donationAmount, paymentMethod, and howDidYouHearAboutUs are required',
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate donation amount
    const donationAmount = parseFloat(body.donationAmount)
    if (isNaN(donationAmount) || donationAmount <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 })
    }

    // Validate payment method
    const validPaymentMethods = ['credit-card', 'paypal', 'bank-transfer', 'check', 'cash', 'other']
    if (!validPaymentMethods.includes(body.paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
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
      return NextResponse.json({ error: 'Invalid source selection' }, { status: 400 })
    }

    // Create the donation form submission
    const donationForm = await payload.create({
      collection: 'donation-forms',
      data: {
        fullName: body.fullName,
        email: body.email,
        donationAmount: donationAmount,
        paymentMethod: body.paymentMethod,
        howDidYouHearAboutUs: body.howDidYouHearAboutUs,
        status: 'pending', // Default status
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Donation form submitted successfully',
        id: donationForm.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Donation form submission error:', error)
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
