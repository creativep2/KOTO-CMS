import type { CollectionAfterReadHook } from 'payload'

export const populateYouTubeEmbeds: CollectionAfterReadHook = async ({ doc, req }) => {
  // Check if this is a request that wants populated YouTube embeds
  const shouldPopulate =
    req.query?.populate === 'true' ||
    req.query?.depth === '1' ||
    req.query?.depth === 1 ||
    // Only populate for API calls that specifically request it
    req.headers.get('accept')?.includes('application/json')

  if (!shouldPopulate) {
    return doc // Don't populate by default
  }

  // Auto-populate YouTube embeds in rich text fields
  const richTextFields = ['paragraph', 'description'] // Add any rich text field names here

  for (const fieldName of richTextFields) {
    if (doc[fieldName]?.root?.children) {
      const updatedChildren = await Promise.all(
        doc[fieldName].root.children.map(async (child: Record<string, unknown>) => {
          if (child.type === 'relationship' && child.relationTo === 'youtube-embeds') {
            if (typeof child.value === 'number' || typeof child.value === 'string') {
              try {
                // Fetch the YouTube embed data
                const youtubeEmbed = await req.payload.findByID({
                  collection: 'youtube-embeds',
                  id: child.value,
                })
                child.value = youtubeEmbed
              } catch (error) {
                console.error('Failed to populate YouTube embed:', error)
              }
            }
          }
          return child
        }),
      )
      doc[fieldName].root.children = updatedChildren
    }
  }

  return doc
}
