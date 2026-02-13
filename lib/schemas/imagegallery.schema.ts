import { z } from 'zod';

/**
 * Image definition for ImageGallery
 */
export const ImageItemSchema = z.object({
  src: z.string(), // Image URL
  alt: z.string().optional(), // Alt text for accessibility
  width: z.number(), // Original width in pixels
  height: z.number(), // Original height in pixels
  title: z.string().optional(), // Image title
  description: z.string().optional(), // Image description
  thumbnail: z.string().optional(), // Optional thumbnail URL (if different from src)
});

export type ImageItem = z.infer<typeof ImageItemSchema>;

/**
 * ImageGallery data structure
 */
export const ImageGalleryDataSchema = z.object({
  images: z.array(ImageItemSchema), // Array of images
  title: z.string().optional(), // Gallery title
});

export type ImageGalleryData = z.infer<typeof ImageGalleryDataSchema>;

/**
 * Layout types for ImageGallery
 */
export const LayoutTypeSchema = z.enum([
  'rows',      // Justified rows (default)
  'columns',   // Columns layout
  'masonry',   // Masonry/Pinterest-style layout
]);

export type LayoutType = z.infer<typeof LayoutTypeSchema>;

/**
 * ImageGallery display options
 */
export const ImageGalleryOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(), // Gallery height
  width: z.union([z.number(), z.string()]).optional(), // Gallery width
  layout: LayoutTypeSchema.optional(), // Layout type (default: 'rows')
  columns: z.number().optional(), // Number of columns for 'columns' layout (default: 3)
  spacing: z.number().optional(), // Spacing between images in pixels (default: 10)
  targetRowHeight: z.number().optional(), // Target row height for 'rows' layout (default: 200)
  enableLightbox: z.boolean().optional(), // Enable lightbox on click (default: true)
  enableZoom: z.boolean().optional(), // Enable zoom in lightbox (default: true)
  enableCaptions: z.boolean().optional(), // Show captions in lightbox (default: true)
  enableDownload: z.boolean().optional(), // Enable download button in lightbox (default: false)
  enableFullscreen: z.boolean().optional(), // Enable fullscreen in lightbox (default: true)
  enableSlideshow: z.boolean().optional(), // Enable slideshow in lightbox (default: false)
  slideshowInterval: z.number().optional(), // Slideshow interval in ms (default: 3000)
}).optional();

export type ImageGalleryOptions = z.infer<typeof ImageGalleryOptionsSchema>;

/**
 * Complete ImageGallery props schema
 */
export const ImageGalleryPropsSchema = z.object({
  data: ImageGalleryDataSchema,
  options: ImageGalleryOptionsSchema,
});

export type ImageGalleryProps = z.infer<typeof ImageGalleryPropsSchema>;
