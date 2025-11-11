import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isBlogsEditor = (args: AccessArgs<User>) => boolean

export const blogsEditor: isBlogsEditor = ({ req: { user } }) => {
  return Boolean(user && ['admin', 'editor', 'blogs-editor'].includes(user.role as string))
}

