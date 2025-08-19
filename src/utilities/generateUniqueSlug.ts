import type { Payload } from 'payload'

/**
 * Generates a unique slug from a title
 * @param title - The title to convert to a slug
 * @param collection - The collection slug to check against
 * @param payload - Payload instance for database queries
 * @param excludeId - ID to exclude from uniqueness check (for updates)
 * @returns Promise<string> - A unique slug
 */
export async function generateUniqueSlug(
  title: string,
  collection: string,
  payload: Payload,
  excludeId?: string
): Promise<string> {
  if (!title || typeof title !== 'string') {
    throw new Error('Title is required and must be a string')
  }

  // Generate base slug from title
  let baseSlug = formatSlug(title)
  
  // If base slug is empty after formatting, use a fallback
  if (!baseSlug) {
    baseSlug = 'untitled'
  }

  let slug = baseSlug
  let counter = 1

  // Keep trying until we find a unique slug
  while (true) {
    try {
      // Check if slug exists in the collection
      const existingDocs = await payload.find({
        collection: collection as any, // Type assertion to avoid TypeScript strictness
        where: {
          slug: { equals: slug },
          ...(excludeId && { id: { not_equals: excludeId } })
        },
        limit: 1
      })

      // If no existing docs found, the slug is unique
      if (existingDocs.docs.length === 0) {
        return slug
      }

      // If slug exists, try with a counter suffix
      slug = `${baseSlug}-${counter}`
      counter++

      // Prevent infinite loops (safety measure)
      if (counter > 1000) {
        throw new Error('Unable to generate unique slug after 1000 attempts')
      }
    } catch (error) {
      // If there's an error checking uniqueness, append timestamp to ensure uniqueness
      const timestamp = Date.now().toString(36)
      return `${baseSlug}-${timestamp}`
    }
  }
}

/**
 * Formats a string into a URL-friendly slug
 * @param val - The string to format
 * @returns Formatted slug
 */
function formatSlug(val: string): string {
  return val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
    .trim()
} 