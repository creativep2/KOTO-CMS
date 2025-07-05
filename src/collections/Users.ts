import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user, // Only logged-in users can read users
    create: ({ req: { user } }) => !!user, // Only logged-in users can create users
    update: ({ req: { user } }) => !!user, // Only logged-in users can update users
    delete: ({ req: { user } }) => !!user, // Only logged-in users can delete users
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'First name of the user',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'Last name of the user',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Author',
          value: 'author',
        },
      ],
      admin: {
        description: 'Role of the user in the CMS',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short biography of the user',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture of the user',
      },
    },
  ],
  timestamps: true,
} 