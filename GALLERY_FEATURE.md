# Gallery Feature for Blog Posts

## Overview

The Gallery feature allows you to add multiple images to your blog posts with customizable layouts and interactive features. This feature is implemented as a separate field in the blog collection and provides a seamless way to display image galleries alongside your blog content.

## Features

- **Multiple Layout Options**: Grid, Masonry, and Carousel layouts
- **Customizable Columns**: 2-5 columns for grid layout
- **Image Captions**: Optional captions for each image
- **Lightbox Functionality**: Click images to view in full-screen lightbox
- **Responsive Design**: Automatically adapts to different screen sizes
- **Accessibility**: Alt text support for all images

## How to Use

### 1. Adding a Gallery to Your Blog Post

1. Open the blog post editor in the admin panel
2. Scroll down to the "Gallery" field (separate from the paragraph content)
3. Click "Add Gallery" to create a new gallery
4. Configure your gallery settings and add images

### 2. Gallery Configuration

#### Images
- **Minimum**: 1 image required
- **Maximum**: 20 images per gallery
- **Required Fields**: Image upload
- **Optional Fields**: Caption, Alt text

#### Layout Options

**Grid Layout**
- Choose from 2-5 columns
- Images are displayed in a uniform grid
- Best for showcasing multiple images of similar size

**Masonry Layout**
- Images are arranged in a Pinterest-style layout
- Automatically adjusts based on image dimensions
- Great for images of varying sizes

**Carousel Layout**
- Horizontal scrolling gallery
- Images are displayed in a row
- Perfect for mobile-friendly browsing

#### Display Options

- **Show Captions**: Toggle to display/hide image captions
- **Enable Lightbox**: Toggle to enable/disable click-to-zoom functionality

### 3. Image Management

#### Adding Images
1. Click "Add Image" in the gallery block
2. Select an image from your media library
3. Optionally add a caption and alt text
4. Repeat for additional images

#### Reordering Images
- Drag and drop images to reorder them within the gallery
- The order will be maintained in the frontend display

#### Removing Images
- Click the trash icon next to any image to remove it
- Note: You cannot remove images if you're at the minimum required count

## Frontend Implementation

### Using the Gallery Component

To display galleries in your frontend, you can use the Gallery component directly:

```tsx
import { Gallery } from '@/components/Gallery'

// Example usage in a blog post component
const BlogPost = ({ blog }) => {
  return (
    <div>
      <h1>{blog.title}</h1>
      <div>{blog.paragraph}</div>
      
      {/* Render galleries */}
      {blog.gallery && blog.gallery.map((gallery, index) => (
        <Gallery
          key={index}
          images={gallery.images}
          layout={gallery.layout}
          columns={gallery.columns}
          showCaptions={gallery.showCaptions}
          enableLightbox={gallery.enableLightbox}
        />
      ))}
    </div>
  )
}
```

### API Response Structure

When you fetch a blog post with galleries, the API will return data in this format:

```typescript
{
  id: 1,
  title: "My Blog Post",
  paragraph: { /* rich text content */ },
  gallery: [
    {
      images: [
        {
          image: {
            id: 1,
            filename: "image1.jpg",
            alt: "Description",
            url: "/media/image1.jpg"
          },
          caption: "Optional caption",
          alt: "Alt text"
        }
      ],
      layout: "grid",
      columns: "3",
      showCaptions: true,
      enableLightbox: true
    }
  ]
}
```

## Frontend Display

### Grid Layout Example
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Images displayed in responsive grid -->
</div>
```

### Masonry Layout Example
```html
<div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
  <!-- Images displayed in masonry layout -->
</div>
```

### Carousel Layout Example
```html
<div class="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
  <!-- Images displayed in horizontal scroll -->
</div>
```

## Lightbox Features

When lightbox is enabled:
- Click any image to open full-screen view
- Navigate between images using arrow keys or on-screen buttons
- Close lightbox by clicking the X button or pressing Escape
- Image counter shows current position (e.g., "3 / 8")

## Technical Implementation

### Files Created/Modified

1. **`src/collections/Blogs.ts`** - Added gallery field to blog collection
2. **`src/components/Gallery/index.tsx`** - Frontend gallery component
3. **`src/app/(payload)/custom.scss`** - Added gallery-specific styles

### Data Structure

The gallery field stores data in the following format:

```typescript
{
  gallery: [
    {
      images: [
        {
          image: { id: string, filename: string, alt?: string },
          caption?: string,
          alt?: string
        }
      ],
      layout: 'grid' | 'masonry' | 'carousel',
      columns: '2' | '3' | '4' | '5',
      showCaptions: boolean,
      enableLightbox: boolean
    }
  ]
}
```

## Best Practices

### Image Optimization
- Use appropriately sized images for web (recommended max: 1920px width)
- Optimize images for web to reduce file size
- Use descriptive alt text for accessibility

### Layout Selection
- **Grid**: Use for images of similar dimensions
- **Masonry**: Use for images of varying sizes
- **Carousel**: Use for mobile-friendly browsing or when space is limited

### Content Guidelines
- Keep captions concise and descriptive
- Use consistent image quality and style within a gallery
- Consider the story or narrative flow when ordering images

## Troubleshooting

### Common Issues

1. **Images not displaying**
   - Check that images are properly uploaded to the media library
   - Verify that the media collection is accessible

2. **Layout not working as expected**
   - Ensure you have sufficient images for the selected layout
   - Check that the layout option is compatible with your column selection

3. **Lightbox not working**
   - Verify that "Enable Lightbox" is checked in the gallery settings
   - Check browser console for JavaScript errors

### Performance Considerations

- Limit galleries to 20 images maximum for optimal performance
- Use optimized images to reduce loading times
- Consider lazy loading for large galleries

## Future Enhancements

Potential improvements for future versions:
- Image zoom functionality within lightbox
- Touch/swipe gestures for mobile
- Keyboard navigation improvements
- Custom gallery themes
- Integration with external image services
- Advanced filtering and sorting options 