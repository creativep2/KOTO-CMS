import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { admins } from '../../access/admins'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    group: 'System & Users',
    description: 'User accounts and authentication',
  },
  access: {
    admin: authenticated,
    create: admins,
    delete: admins,
    read: admins,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        id: { equals: user?.id },
      }
    },
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        {
          label: 'Super Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Blogs Editor',
          value: 'blogs-editor',
        },
        {
          label: 'Job Post Editor',
          value: 'job-posts-editor',
        },
        {
          label: 'Author',
          value: 'author',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      admin: {
        description: 'User role determines what actions they can perform',
      },
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the user account is active',
      },
    },
  ],
  timestamps: true,
}
