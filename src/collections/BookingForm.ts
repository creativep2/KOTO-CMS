import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { admins } from '../access/admins'
import { formUpdateAccess } from '../access/formUpdateAccess'
import { restrictFieldUpdates } from '../hooks/formFieldAccess'

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
    update: formUpdateAccess, // All authenticated users can update (but only status field due to readOnly constraints)
    delete: editors, // Only editors and admins can delete
  },
  hooks: {
    beforeChange: [restrictFieldUpdates],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the person making the reservation',
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address for reservation confirmation',
        readOnly: true,
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number for contact regarding the reservation',
        readOnly: true,
      },
    },
    {
      name: 'nationality',
      type: 'text',
      required: true,
      admin: {
        description: 'Nationality of the person making the reservation',
        readOnly: true,
      },
    },
    {
      name: 'restaurant',
      type: 'text',
      required: true,
      admin: {
        description: 'Restaurant location for the reservation',
        readOnly: true,
      },
    },
    {
      name: 'reservationDate',
      type: 'text',
      required: true,
      admin: {
        description: 'Date of the reservation',
        readOnly: true,
      },
    },
    {
      name: 'reservationTime',
      type: 'text',
      required: true,
      admin: {
        description: 'Preferred reservation time',
        readOnly: true,
      },
    },
    {
      name: 'numberOfGuests',
      type: 'text',
      required: true,
      admin: {
        description: 'Number of guests for the reservation',
        readOnly: true,
      },
    },
    {
      name: 'specialOccasion',
      type: 'text',
      defaultValue: false,
      admin: {
        description: 'Is this a special occasion?',
        readOnly: true,
      },
    },
    {
      name: 'specialOccasionType',
      type: 'text',
      admin: {
        description: 'Type of special occasion (if applicable)',
        readOnly: true,
      },
    },
    {
      name: 'specialRequests',
      type: 'text',
      admin: {
        description: 'Any special requests or dietary requirements',
        readOnly: true,
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
        // Status field is editable by all authenticated users
      },
    },
    {
      name: 'confirmationNumber',
      type: 'text',
      admin: {
        description: 'Reservation confirmation number',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes about this reservation',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
