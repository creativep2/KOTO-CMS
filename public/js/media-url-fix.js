/**
 * Utility function to get the correct media URL from a media resource
 * This handles both the main URL and sizes URLs, ensuring they use the correct storage URLs
 * @param {Object} mediaResource - The media resource object from the API
 * @param {string} sizeName - Optional size name (e.g., 'small', 'medium', 'thumbnail')
 * @returns {string} The correct media URL
 */
function getCorrectMediaUrl(mediaResource, sizeName = null) {
  if (!mediaResource) return ''

  // If a specific size is requested and exists, use it
  if (
    sizeName &&
    mediaResource.sizes &&
    mediaResource.sizes[sizeName] &&
    mediaResource.sizes[sizeName].url
  ) {
    const sizeUrl = mediaResource.sizes[sizeName].url
    // Check if it's already a full URL
    if (sizeUrl.startsWith('http://') || sizeUrl.startsWith('https://')) {
      return sizeUrl
    }
    // If it's a local path, fall back to the main URL
    // This handles the case where existing media records have local paths in sizes
  }

  // Fallback to the main URL
  if (mediaResource.url) {
    // Check if it's already a full URL
    if (mediaResource.url.startsWith('http://') || mediaResource.url.startsWith('https://')) {
      return mediaResource.url
    }
  }

  // If we still don't have a valid URL, return empty string
  return ''
}

// Make it available globally for use in HTML files
window.getCorrectMediaUrl = getCorrectMediaUrl
