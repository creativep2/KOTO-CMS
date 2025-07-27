import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const Merchandise: CollectionConfig = {
  slug: 'merchandise',
  admin: {
    useAsTitle: 'product_name',
    defaultColumns: ['product_name', 'organization_name', 'price', 'updatedAt'],
  },
  access: {
    read: anyone, // Public read access for frontend
    create: authenticated, // Only authenticated users can create
    update: authenticated, // Only authenticated users can update
    delete: authenticated, // Only authenticated users can delete
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
    },
    {
      name: 'product_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên sản phẩm',
      },
      label: 'Tên sản phẩm',
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
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Mô tả chi tiết sản phẩm (tùy chọn)',
        rows: 4,
      },
      label: 'Mô tả sản phẩm',
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
    },
  ],
  timestamps: true,
}
