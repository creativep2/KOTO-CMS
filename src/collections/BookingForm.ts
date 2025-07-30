import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'

export const BookingForm: CollectionConfig = {
  slug: 'booking-forms',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: [
      'fullName',
      'email',
      'restaurant',
      'reservationDate',
      'reservationTime',
      'numberOfGuests',
      'status',
      'createdAt',
    ],
    group: 'Forms & Submissions',
    description: 'Restaurant reservation bookings and table management',
  },
  access: {
    read: editors, // Only editors and admins can read submissions
    create: () => true, // Public can submit forms
    update: editors, // Only editors and admins can update
    delete: editors, // Only editors and admins can delete
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the person making the reservation',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address for reservation confirmation',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number for contact regarding the reservation',
      },
    },
    {
      name: 'nationality',
      type: 'text',
      required: true,
      admin: {
        description: 'Nationality of the person making the reservation',
      },
    },
    {
      name: 'restaurant',
      type: 'select',
      required: true,
      options: [
        {
          label: 'KOTO Restaurant',
          value: 'koto-restaurant',
        },
        {
          label: 'KOTO Café',
          value: 'koto-cafe',
        },
        {
          label: 'KOTO Bar',
          value: 'koto-bar',
        },
        {
          label: 'KOTO Rooftop',
          value: 'koto-rooftop',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'Restaurant location for the reservation',
      },
    },
    {
      name: 'reservationDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date of the reservation',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'reservationTime',
      type: 'select',
      required: true,
      options: [
        {
          label: '11:00 AM',
          value: '11:00',
        },
        {
          label: '11:30 AM',
          value: '11:30',
        },
        {
          label: '12:00 PM',
          value: '12:00',
        },
        {
          label: '12:30 PM',
          value: '12:30',
        },
        {
          label: '1:00 PM',
          value: '13:00',
        },
        {
          label: '1:30 PM',
          value: '13:30',
        },
        {
          label: '2:00 PM',
          value: '14:00',
        },
        {
          label: '2:30 PM',
          value: '14:30',
        },
        {
          label: '3:00 PM',
          value: '15:00',
        },
        {
          label: '3:30 PM',
          value: '15:30',
        },
        {
          label: '4:00 PM',
          value: '16:00',
        },
        {
          label: '4:30 PM',
          value: '16:30',
        },
        {
          label: '5:00 PM',
          value: '17:00',
        },
        {
          label: '5:30 PM',
          value: '17:30',
        },
        {
          label: '6:00 PM',
          value: '18:00',
        },
        {
          label: '6:30 PM',
          value: '18:30',
        },
        {
          label: '7:00 PM',
          value: '19:00',
        },
        {
          label: '7:30 PM',
          value: '19:30',
        },
        {
          label: '8:00 PM',
          value: '20:00',
        },
        {
          label: '8:30 PM',
          value: '20:30',
        },
        {
          label: '9:00 PM',
          value: '21:00',
        },
        {
          label: '9:30 PM',
          value: '21:30',
        },
        {
          label: '10:00 PM',
          value: '22:00',
        },
      ],
      admin: {
        description: 'Preferred reservation time',
      },
    },
    {
      name: 'numberOfGuests',
      type: 'select',
      required: true,
      options: [
        {
          label: '1 Guest',
          value: '1',
        },
        {
          label: '2 Guests',
          value: '2',
        },
        {
          label: '3 Guests',
          value: '3',
        },
        {
          label: '4 Guests',
          value: '4',
        },
        {
          label: '5 Guests',
          value: '5',
        },
        {
          label: '6 Guests',
          value: '6',
        },
        {
          label: '7 Guests',
          value: '7',
        },
        {
          label: '8 Guests',
          value: '8',
        },
        {
          label: '9 Guests',
          value: '9',
        },
        {
          label: '10+ Guests',
          value: '10',
        },
      ],
      admin: {
        description: 'Number of guests for the reservation',
      },
    },
    {
      name: 'specialOccasion',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this a special occasion?',
      },
    },
    {
      name: 'specialOccasionType',
      type: 'select',
      options: [
        {
          label: 'Birthday',
          value: 'birthday',
        },
        {
          label: 'Anniversary',
          value: 'anniversary',
        },
        {
          label: 'Business Meeting',
          value: 'business-meeting',
        },
        {
          label: 'Date Night',
          value: 'date-night',
        },
        {
          label: 'Family Gathering',
          value: 'family-gathering',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'Type of special occasion (if applicable)',
        condition: (data) => data.specialOccasion === true,
      },
    },
    {
      name: 'specialRequests',
      type: 'textarea',
      admin: {
        description: 'Any special requests or dietary requirements',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Seated',
          value: 'seated',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'No Show',
          value: 'no-show',
        },
      ],
      admin: {
        description: 'Status of the reservation',
      },
    },
    {
      name: 'confirmationNumber',
      type: 'text',
      admin: {
        description: 'Reservation confirmation number',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this reservation',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
  ],
  timestamps: true,
}
