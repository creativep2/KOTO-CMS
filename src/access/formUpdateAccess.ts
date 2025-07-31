import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type FormUpdateAccess = (args: AccessArgs<User>) => boolean

export const formUpdateAccess: FormUpdateAccess = ({ req: { user } }) => {
  // Allow all authenticated users to update (they can only update status field due to readOnly constraints)
  return Boolean(user)
}

// Custom access control for field-level updates
export const adminOnlyFieldUpdate = ({ req: { user } }: AccessArgs<User>) => {
  return Boolean(user?.role === 'admin')
}

// Access control that allows admins to update all fields, others only status
export const formFieldUpdateAccess = ({ req: { user } }: AccessArgs<User>) => {
  // Admins can update all fields
  if (user?.role === 'admin') {
    return true
  }

  // Other authenticated users can only update status field
  return Boolean(user)
}
