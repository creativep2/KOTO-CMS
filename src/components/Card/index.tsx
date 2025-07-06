'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Blog } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardBlogData = Pick<Blog, 'slug' | 'category' | 'meta' | 'title' | 'header_image'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardBlogData
  relationTo?: 'blogs'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, category, meta, title, header_image } = doc || {}
  const { description } = meta || {}

  const hasCategory = category && typeof category === 'string'
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`
  const displayImage = header_image

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!displayImage && <div className="">No image</div>}
        {displayImage && typeof displayImage !== 'string' && (
          <Media resource={displayImage} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {showCategories && hasCategory && <div className="uppercase text-sm mb-4">{category}</div>}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
