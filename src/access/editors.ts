import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isEditor = (args: AccessArgs<User>) => boolean

export const editors: isEditor = ({ req: { user } }) => {
  return Boolean(user && ['admin', 'editor'].includes(user.role as string))
}
