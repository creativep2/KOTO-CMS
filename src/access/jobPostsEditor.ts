import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isJobPostsEditor = (args: AccessArgs<User>) => boolean

export const jobPostsEditor: isJobPostsEditor = ({ req: { user } }) => {
  return Boolean(user && ['admin', 'editor', 'job-posts-editor'].includes(user.role as string))
}

