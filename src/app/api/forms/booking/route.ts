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
      !body.nationality ||
      !body.restaurant ||
      !body.reservationDate ||
      !body.reservationTime ||
      !body.numberOfGuests
    ) {
      const response = NextResponse.json(
        {
          error:
            'Missing required fields: fullName, email, phoneNumber, nationality, restaurant, reservationDate, reservationTime, and numberOfGuests are required',
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

    // Validate restaurant
    const validRestaurants = ['koto-restaurant', 'koto-cafe', 'koto-bar', 'koto-rooftop', 'other']
    if (!validRestaurants.includes(body.restaurant)) {
      const response = NextResponse.json({ error: 'Invalid restaurant selection' }, { status: 400 })
      return addCorsHeaders(response)
    }

    // Validate reservation date (must be in the future)
    const reservationDate = new Date(body.reservationDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (reservationDate < today) {
      const response = NextResponse.json(
        { error: 'Reservation date must be in the future' },
        { status: 400 },
      )
      return addCorsHeaders(response)
    }

    // Validate reservation time
    const validTimes = [
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30',
      '21:00',
      '21:30',
      '22:00',
    ]
    if (!validTimes.includes(body.reservationTime)) {
      const response = NextResponse.json({ error: 'Invalid reservation time' }, { status: 400 })
      return addCorsHeaders(response)
    }

    // Validate number of guests
    const numberOfGuests = parseInt(body.numberOfGuests)
    if (isNaN(numberOfGuests) || numberOfGuests < 1 || numberOfGuests > 10) {
      const response = NextResponse.json(
        { error: 'Invalid number of guests (must be between 1 and 10)' },
        { status: 400 },
      )
      return addCorsHeaders(response)
    }

    // Validate special occasion type if special occasion is checked
    if (body.specialOccasion && body.specialOccasionType) {
      const validOccasionTypes = [
        'birthday',
        'anniversary',
        'business-meeting',
        'date-night',
        'family-gathering',
        'other',
      ]
      if (!validOccasionTypes.includes(body.specialOccasionType)) {
        const response = NextResponse.json(
          { error: 'Invalid special occasion type' },
          { status: 400 },
        )
        return addCorsHeaders(response)
      }
    }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Create the booking form submission with only allowed fields
    const bookingForm = await payload.create({
      collection: 'booking-forms',
      data: {
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        nationality: body.nationality,
        restaurant: body.restaurant,
        reservationDate: body.reservationDate,
        reservationTime: body.reservationTime,
        numberOfGuests: body.numberOfGuests,
        specialOccasion: body.specialOccasion || false,
        specialOccasionType: body.specialOccasionType || undefined,
        specialRequests: body.specialRequests || '',
        status: 'pending', // Default status - cannot be changed via API
      },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Booking form submitted successfully',
        id: bookingForm.id,
      },
      { status: 201 },
    )
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Booking form submission error:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return addCorsHeaders(response)
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}
