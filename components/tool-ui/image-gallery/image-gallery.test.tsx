import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageGallery } from './image-gallery';
import type { ImageGalleryProps, ImageGalleryItem } from './schema';

// Mock the adapter
vi.mock('./_adapter', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock the gallery grid
vi.mock('./gallery-grid', () => ({
  GalleryGrid: ({ onImageClick }: any) => (
    <div data-testid="gallery-grid">
      <button
        data-testid="image-1"
        onClick={() => onImageClick?.('img-1')}
      >
        Image 1
      </button>
      <button
        data-testid="image-2"
        onClick={() => onImageClick?.('img-2')}
      >
        Image 2
      </button>
    </div>
  ),
}));

// Mock the lightbox
vi.mock('./gallery-lightbox', () => ({
  GalleryLightbox: () => <div data-testid="gallery-lightbox">Lightbox</div>,
}));

// Mock the context
vi.mock('./context', () => ({
  ImageGalleryProvider: ({ children }: any) => (
    <div data-testid="gallery-provider">{children}</div>
  ),
  useImageGallery: () => ({
    images: mockImages,
    activeIndex: null,
    openLightbox: vi.fn(),
    closeLightbox: vi.fn(),
    registerImage: vi.fn(),
    lightboxContentRef: { current: null },
    setDialogRef: vi.fn(),
  }),
}));

const mockImages: ImageGalleryItem[] = [
  {
    id: 'img-1',
    src: 'https://example.com/image1.jpg',
    alt: 'First image',
    width: 800,
    height: 600,
    title: 'Image 1',
    caption: 'A beautiful landscape',
  },
  {
    id: 'img-2',
    src: 'https://example.com/image2.jpg',
    alt: 'Second image',
    width: 1200,
    height: 900,
    title: 'Image 2',
    caption: 'A stunning sunset',
  },
  {
    id: 'img-3',
    src: 'https://example.com/image3.jpg',
    alt: 'Third image',
    width: 1000,
    height: 750,
  },
];

const mockGalleryData: ImageGalleryProps = {
  id: 'gallery-1',
  images: mockImages,
  title: 'My Photo Gallery',
  description: 'A collection of beautiful photos',
};

describe('ImageGallery', () => {
  describe('Rendering', () => {
    it('renders image gallery', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByTestId('gallery-provider')).toBeInTheDocument();
    });

    it('renders gallery grid', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    it('renders lightbox', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByTestId('gallery-lightbox')).toBeInTheDocument();
    });

    it('sets data-slot attribute', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const article = container.querySelector('[data-slot="image-gallery"]');
      expect(article).toBeInTheDocument();
    });

    it('sets data-tool-ui-id attribute', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const article = container.querySelector('[data-tool-ui-id="gallery-1"]');
      expect(article).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ImageGallery {...mockGalleryData} className="custom-gallery" />
      );
      expect(container.firstChild).toHaveClass('custom-gallery');
    });

    it('renders as article element', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('Header', () => {
    it('renders title when provided', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByText('My Photo Gallery')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByText('A collection of beautiful photos')).toBeInTheDocument();
    });

    it('does not render header when title and description absent', () => {
      const dataWithoutHeader = {
        ...mockGalleryData,
        title: undefined,
        description: undefined,
      };
      const { container } = render(<ImageGallery {...dataWithoutHeader} />);
      expect(screen.queryByText('My Photo Gallery')).not.toBeInTheDocument();
      // Header div should not be present
      expect(container.querySelector('.border-b')).not.toBeInTheDocument();
    });

    it('renders title without description', () => {
      const dataWithTitleOnly = {
        ...mockGalleryData,
        description: undefined,
      };
      render(<ImageGallery {...dataWithTitleOnly} />);
      expect(screen.getByText('My Photo Gallery')).toBeInTheDocument();
    });

    it('renders description without title', () => {
      const dataWithDescriptionOnly = {
        ...mockGalleryData,
        title: undefined,
      };
      render(<ImageGallery {...dataWithDescriptionOnly} />);
      expect(screen.getByText('A collection of beautiful photos')).toBeInTheDocument();
    });
  });

  describe('Image Click Handling', () => {
    it('calls onImageClick when image is clicked', async () => {
      const user = userEvent.setup();
      const onImageClick = vi.fn();
      render(<ImageGallery {...mockGalleryData} onImageClick={onImageClick} />);

      const image = screen.getByTestId('image-1');
      await user.click(image);

      expect(onImageClick).toHaveBeenCalledWith('img-1', mockImages[0]);
    });

    it('calls onImageClick with correct image data', async () => {
      const user = userEvent.setup();
      const onImageClick = vi.fn();
      render(<ImageGallery {...mockGalleryData} onImageClick={onImageClick} />);

      const image2 = screen.getByTestId('image-2');
      await user.click(image2);

      expect(onImageClick).toHaveBeenCalledWith('img-2', mockImages[1]);
    });

    it('does not error when onImageClick not provided', async () => {
      const user = userEvent.setup();
      render(<ImageGallery {...mockGalleryData} />);

      const image = screen.getByTestId('image-1');
      await user.click(image);

      // Should not throw error
      expect(image).toBeInTheDocument();
    });

    it('does not call onImageClick for non-existent image id', async () => {
      const user = userEvent.setup();
      const onImageClick = vi.fn();

      // The mock gallery-grid fires onImageClick with the id 'img-1' and 'img-2'
      // Render with images that don't contain those ids to test the guard
      const noMatchData = {
        ...mockGalleryData,
        images: [{ id: 'other-id', src: 'https://example.com/other.jpg', alt: 'Other', width: 800, height: 600 }],
      };
      render(<ImageGallery {...noMatchData} onImageClick={onImageClick} />);

      // Click image-1 which fires onImageClick('img-1'), but 'img-1' is not in images
      const image = screen.getByTestId('image-1');
      await user.click(image);

      expect(onImageClick).not.toHaveBeenCalled();
    });
  });

  describe('Images Prop', () => {
    it('handles single image', () => {
      const singleImageData = {
        ...mockGalleryData,
        images: [mockImages[0]],
      };
      render(<ImageGallery {...singleImageData} />);
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    it('handles multiple images', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    it('handles images with minimal data', () => {
      const minimalImage: ImageGalleryItem = {
        id: 'img-min',
        src: 'https://example.com/min.jpg',
        alt: 'Minimal image',
        width: 640,
        height: 480,
      };
      const minimalData = {
        ...mockGalleryData,
        images: [minimalImage],
      };
      render(<ImageGallery {...minimalData} />);
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    it('handles images with all optional fields', () => {
      const fullImage: ImageGalleryItem = {
        id: 'img-full',
        src: 'https://example.com/full.jpg',
        alt: 'Full image',
        width: 1920,
        height: 1080,
        title: 'Full Title',
        caption: 'Full Caption',
        source: {
          label: 'Photographer Name',
          url: 'https://example.com/photographer',
        },
      };
      const fullData = {
        ...mockGalleryData,
        images: [fullImage],
      };
      render(<ImageGallery {...fullData} />);
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
  });

  describe('Context Integration', () => {
    it('wraps content in ImageGalleryProvider', () => {
      render(<ImageGallery {...mockGalleryData} />);
      expect(screen.getByTestId('gallery-provider')).toBeInTheDocument();
    });

    it('passes images to provider', () => {
      render(<ImageGallery {...mockGalleryData} />);
      // Provider should be rendering its children
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
  });

  describe('Container Structure', () => {
    it('applies container query classes on inner div', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const innerDiv = container.querySelector('article > div');
      expect(innerDiv).toHaveClass('@container');
    });

    it('applies min and max width constraints', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const article = container.querySelector('article');
      expect(article).toHaveClass('min-w-80', 'max-w-lg');
    });

    it('applies border and shadow styling', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const innerDiv = container.querySelector('.border');
      expect(innerDiv).toHaveClass('border-border', 'shadow-xs');
    });

    it('applies rounded corners', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const innerDiv = container.querySelector('.rounded-xl');
      expect(innerDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic article element', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('renders heading with proper hierarchy', () => {
      render(<ImageGallery {...mockGalleryData} />);
      const heading = screen.getByText('My Photo Gallery');
      expect(heading.tagName).toBe('H3');
    });

    it('associates description with title', () => {
      render(<ImageGallery {...mockGalleryData} />);
      const title = screen.getByText('My Photo Gallery');
      const description = screen.getByText('A collection of beautiful photos');
      // Both should be present and properly structured
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('applies padding to grid container', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const gridContainer = container.querySelector('.p-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('applies flex layout', () => {
      const { container } = render(<ImageGallery {...mockGalleryData} />);
      const flexContainer = container.querySelector('.flex-col');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long titles', () => {
      const longTitleData = {
        ...mockGalleryData,
        title: 'A'.repeat(200),
      };
      render(<ImageGallery {...longTitleData} />);
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });

    it('handles very long descriptions', () => {
      const longDescData = {
        ...mockGalleryData,
        description: 'B'.repeat(500),
      };
      render(<ImageGallery {...longDescData} />);
      expect(screen.getByText('B'.repeat(500))).toBeInTheDocument();
    });

    it('handles images with special characters in URLs', () => {
      const specialImage: ImageGalleryItem = {
        id: 'special',
        src: 'https://example.com/image%20with%20spaces.jpg?param=value&other=123',
        alt: 'Special image',
        width: 800,
        height: 600,
      };
      const specialData = {
        ...mockGalleryData,
        images: [specialImage],
      };
      render(<ImageGallery {...specialData} />);
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
  });
});
