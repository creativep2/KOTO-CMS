import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthor = (args: AccessArgs<User>) => boolean

export const authors: isAuthor = ({ req: { user } }) => {
  return Boolean(user && ['admin', 'editor', 'author'].includes(user.role as string))
}
