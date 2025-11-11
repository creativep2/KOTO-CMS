import type { CollectionConfig } from 'payload'
import { blogsEditor } from '../access/blogsEditor'

export const Merchandise: CollectionConfig = {
  slug: 'merchandise',
  admin: {
    useAsTitle: 'product_name',
    defaultColumns: ['product_name', 'organization_name', 'price', 'updatedAt'],
    group: 'E-commerce',
    description: 'Merchandise and product catalog',
  },
  access: {
    read: ({ req: { user } }) => {
      // Public read access for frontend API, but restrict admin UI access
      if (!user) return true // Public API access
      // Only admins, editors, and blogs-editors can see in admin UI
      return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor'
    },
    create: blogsEditor, // Only admins, editors, and blogs-editors can create
    update: blogsEditor, // Only admins, editors, and blogs-editors can update
    delete: blogsEditor, // Only admins, editors, and blogs-editors can delete
  },
  fields: [
    {
      name: 'organization_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên tổ chức (để grouping vào đúng nhóm trên trang)',
      },
      label: 'Tên tổ chức',
      localized: true,
    },
    {
      name: 'product_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên sản phẩm',
      },
      label: 'Tên sản phẩm',
      localized: true,
    },
    {
      name: 'product_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hình ảnh sản phẩm',
      },
      label: 'Hình sản phẩm',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Giá sản phẩm (VND)',
        step: 1000, // Increment by 1000 VND
      },
      label: 'Giá sản phẩm',
      min: 0,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Mô tả chi tiết sản phẩm (tùy chọn)',
        rows: 4,
      },
      label: 'Mô tả sản phẩm',
      localized: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        {
          label: 'Có sẵn',
          value: 'available',
        },
        {
          label: 'Hết hàng',
          value: 'out_of_stock',
        },
        {
          label: 'Ngừng bán',
          value: 'discontinued',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Trạng thái sản phẩm',
      },
      label: 'Trạng thái',
      localized: true,
    },
  ],
  timestamps: true,
}
