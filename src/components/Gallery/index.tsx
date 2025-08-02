import React, { useState } from 'react'
import { getMediaUrlFromResource } from '../../utilities/getMediaUrl'
import { cn } from '../../utilities/ui'

interface GalleryImage {
  image: {
    id: string
    filename: string
    alt?: string
    width?: number
    height?: number
  }
  caption?: string
  alt?: string
}

interface GalleryProps {
  images: GalleryImage[]
  layout?: 'grid' | 'masonry' | 'carousel'
  columns?: '2' | '3' | '4' | '5'
  showCaptions?: boolean
  enableLightbox?: boolean
}

export const Gallery: React.FC<GalleryProps> = ({
  images,
  layout = 'grid',
  columns = '3',
  showCaptions = true,
  enableLightbox = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const handleImageClick = (index: number) => {
    if (enableLightbox) {
      setSelectedImage(index)
    }
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  // Handle keyboard events for lightbox
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage === null) return

      switch (event.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          event.preventDefault()
          prevImage()
          break
        case 'ArrowRight':
          event.preventDefault()
          nextImage()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const getGridColumns = () => {
    switch (columns) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case '5':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const renderImage = (image: GalleryImage, index: number) => {
    const imageUrl = getMediaUrlFromResource(image.image)
    const altText = image.alt || image.image.alt || image.caption || image.image.filename

    return (
      <div
        key={image.image.id}
        className={cn(
          'relative overflow-hidden rounded-lg',
          enableLightbox && 'cursor-pointer transition-transform hover:scale-105'
        )}
        onClick={() => handleImageClick(index)}
      >
        <img
          src={imageUrl}
          alt={altText}
          className={cn(
            'w-full h-auto object-cover',
            layout === 'masonry' ? 'h-auto' : 'aspect-square'
          )}
          loading="lazy"
        />
        {showCaptions && image.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 text-sm">
            {image.caption}
          </div>
        )}
      </div>
    )
  }

  const renderGrid = () => (
    <div className={cn('grid gap-4', getGridColumns())}>
      {images.map((image, index) => renderImage(image, index))}
    </div>
  )

  const renderMasonry = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {images.map((image, index) => (
        <div key={image.image.id} className="break-inside-avoid">
          {renderImage(image, index)}
        </div>
      ))}
    </div>
  )

  const renderCarousel = () => (
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {images.map((image, index) => (
          <div key={image.image.id} className="flex-shrink-0 w-80">
            {renderImage(image, index)}
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (layout) {
      case 'masonry':
        return renderMasonry()
      case 'carousel':
        return renderCarousel()
      default:
        return renderGrid()
    }
  }

  return (
    <div className="gallery-container">
      {renderContent()}

      {/* Lightbox */}
      {selectedImage !== null && enableLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              ×
            </button>
            
            <div className="relative">
              <img
                src={getMediaUrlFromResource(images[selectedImage].image)}
                alt={images[selectedImage].alt || images[selectedImage].image.alt || images[selectedImage].caption || images[selectedImage].image.filename}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {showCaptions && images[selectedImage].caption && (
                <div className="text-white text-center mt-4">
                  {images[selectedImage].caption}
                </div>
              )}
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={selectedImage === 0}
                  className={cn(
                    'absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300',
                    selectedImage === 0 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  disabled={selectedImage === images.length - 1}
                  className={cn(
                    'absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300',
                    selectedImage === images.length - 1 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  ›
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 