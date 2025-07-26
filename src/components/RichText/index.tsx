import {
  DefaultNodeTypes,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/utilities/ui'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'

type NodeTypes = DefaultNodeTypes

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'blogs' ? `/blogs/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  relationship: ({ node }) => {
    const { value, relationTo } = node

    // Handle YouTube embeds
    if (relationTo === 'youtube-embeds') {
      // If value is just an ID (not populated), show a placeholder
      if (typeof value === 'number' || typeof value === 'string') {
        return (
          <div className="my-6 p-4 border border-gray-300 rounded bg-gray-50 text-center">
            <p className="text-gray-600">
              YouTube Video (ID: {value}) - Configure depth parameter to populate relationship data
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Add ?depth=1 to your API request to see the full video embed
            </p>
          </div>
        )
      }

      // If value is populated with full data
      if (value && typeof value === 'object') {
        const youtubeData = value as any
        return (
          <YouTubeEmbed
            key={youtubeData.id}
            videoId={youtubeData.videoId || ''}
            title={youtubeData.videoTitle || undefined}
            className="my-6"
          />
        )
      }
    }

    // Default relationship rendering
    const displayValue =
      typeof value === 'object' && value
        ? (value as any).title || (value as any).id || 'Related content'
        : value || 'Related content'

    return <div>Related: {displayValue}</div>
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
