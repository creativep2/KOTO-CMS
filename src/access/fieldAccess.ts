import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

// Field-level access control for form fields
export const fieldAccess = {
  // Only admins can edit non-status fields
  nonStatusFields: ({ req: { user } }: AccessArgs<User>) => {
    return Boolean(user?.role === 'admin')
  },

  // All authenticated users can edit status field
  statusField: ({ req: { user } }: AccessArgs<User>) => {
    return Boolean(user)
  },
}

// Function to check if user is admin for field-level access
export const isAdmin = ({ user }: { user: any }) => {
  return user?.role === 'admin'
}

// Function to check if user is authenticated for field-level access
export const isAuthenticated = ({ user }: { user: any }) => {
  return Boolean(user)
}
