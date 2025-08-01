import type { CollectionConfig } from 'payload'

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
    read: ({ req: { user } }) => {
      // Allow editors, authors, and admins to read
      return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'author'
    },
    create: () => true, // Public can submit forms
    update: ({ req: { user } }) => {
      // Allow editors, authors, and admins to update (but hook will restrict what they can edit)
      return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'author'
    },
    delete: ({ req: { user } }) => {
      // Only editors and admins can delete
      return user?.role === 'admin' || user?.role === 'editor'
    },
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
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      admin: {
        description: 'Email address for reservation confirmation',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number for contact regarding the reservation',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'nationality',
      type: 'text',
      required: true,
      admin: {
        description: 'Nationality of the person making the reservation',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'restaurant',
      type: 'text',
      required: true,
      admin: {
        description: 'Restaurant location for the reservation',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'reservationDate',
      type: 'text',
      required: true,
      admin: {
        description: 'Date of the reservation',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'reservationTime',
      type: 'text',
      required: true,
      admin: {
        description: 'Preferred reservation time',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'numberOfGuests',
      type: 'text',
      required: true,
      admin: {
        description: 'Number of guests for the reservation',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'specialOccasion',
      type: 'text',
      defaultValue: false,
      admin: {
        description: 'Is this a special occasion?',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'specialOccasionType',
      type: 'text',
      admin: {
        description: 'Type of special occasion (if applicable)',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'specialRequests',
      type: 'text',
      admin: {
        description: 'Any special requests or dietary requirements',
        readOnly: true, // Read-only for all users - only admin can edit via hook
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
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes about this reservation',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
  ],
  timestamps: true,
}
