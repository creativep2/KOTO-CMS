import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}

/**
 * Gets the best available URL from a media resource, prioritizing sizes over the main URL
 * @param resource The media resource object
 * @param sizeName The size name to look for (e.g., 'small', 'medium', 'thumbnail')
 * @param cacheTag Optional cache tag to append to the URL
 * @returns The best available URL with proper formatting
 */
export const getMediaUrlFromResource = (
  resource: any,
  sizeName?: string,
  cacheTag?: string | null,
): string => {
  if (!resource) return ''

  // If a specific size is requested and exists, use it
  if (sizeName && resource.sizes?.[sizeName]?.url) {
    const sizeUrl = resource.sizes[sizeName].url
    // Check if the size URL is already a full URL
    if (sizeUrl.startsWith('http://') || sizeUrl.startsWith('https://')) {
      return getMediaUrl(sizeUrl, cacheTag)
    }
    // If the size URL is a local path, fall back to the main URL
    // This handles the case where existing media records have local paths in sizes
  }

  // Fallback to the main URL
  if (resource.url) {
    return getMediaUrl(resource.url, cacheTag)
  }

  return ''
}
