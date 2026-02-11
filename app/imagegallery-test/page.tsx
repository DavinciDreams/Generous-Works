"use client";

import {
  ImageGallery,
  ImageGalleryHeader,
  ImageGalleryTitle,
  ImageGalleryActions,
  ImageGalleryDownloadButton,
  ImageGalleryFullscreenButton,
  ImageGalleryGrid,
  type ImageGalleryData,
} from "@/components/ai-elements/imagegallery";

// Sample nature images (using Unsplash placeholders)
const natureGallery: ImageGalleryData = {
  title: "Nature Photography",
  images: [
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      alt: "Mountain landscape",
      title: "Mountain Peak",
      description: "A stunning mountain peak at sunrise",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      alt: "Forest trail",
      title: "Forest Path",
      description: "A peaceful trail through the woods",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      alt: "Ocean waves",
      title: "Ocean Sunset",
      description: "Golden hour at the beach",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      alt: "Northern lights",
      title: "Aurora Borealis",
      description: "Dancing lights in the night sky",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      alt: "Misty valley",
      title: "Foggy Morning",
      description: "Mist rolling through the valley",
      width: 1200,
      height: 900,
    },
    {
      src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
      alt: "Alpine lake",
      title: "Crystal Lake",
      description: "Reflection on a pristine alpine lake",
      width: 1200,
      height: 800,
    },
  ],
};

// Urban photography (portrait orientation mix)
const urbanGallery: ImageGalleryData = {
  title: "Urban Exploration",
  images: [
    {
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
      alt: "City skyline",
      title: "Downtown",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
      alt: "Street architecture",
      title: "Building Facade",
      width: 800,
      height: 1200,
    },
    {
      src: "https://images.unsplash.com/photo-1514565131-fce0801e5785",
      alt: "Night city",
      title: "Neon Nights",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
      alt: "Urban bridge",
      title: "City Bridge",
      width: 1200,
      height: 900,
    },
    {
      src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      alt: "Subway station",
      title: "Underground",
      width: 800,
      height: 1200,
    },
    {
      src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
      alt: "City reflection",
      title: "Glass Towers",
      width: 1200,
      height: 800,
    },
  ],
};

// Architecture (square format)
const architectureGallery: ImageGalleryData = {
  title: "Modern Architecture",
  images: [
    {
      src: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
      alt: "Modern building",
      title: "Contemporary Design",
      width: 1000,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      alt: "Glass facade",
      title: "Reflections",
      width: 1000,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
      alt: "Spiral staircase",
      title: "Geometric Forms",
      width: 1000,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8",
      alt: "Brutalist architecture",
      title: "Concrete Poetry",
      width: 1000,
      height: 1000,
    },
  ],
};

// Wildlife (varied sizes)
const wildlifeGallery: ImageGalleryData = {
  title: "Wildlife Moments",
  images: [
    {
      src: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7",
      alt: "Lion portrait",
      title: "King of the Savanna",
      description: "Majestic lion in golden light",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
      alt: "Elephant family",
      title: "Family Bond",
      description: "Elephants walking together",
      width: 1200,
      height: 900,
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      alt: "Hummingbird",
      title: "In Flight",
      description: "Hummingbird feeding on flower",
      width: 900,
      height: 1200,
    },
    {
      src: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e",
      alt: "Butterfly",
      title: "Delicate Wings",
      description: "Butterfly on a flower",
      width: 1200,
      height: 800,
    },
    {
      src: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131",
      alt: "Deer in forest",
      title: "Forest Dweller",
      description: "Young deer in morning mist",
      width: 1200,
      height: 1200,
    },
  ],
};

export default function ImageGalleryTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">ImageGallery Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Responsive image galleries with lightbox, zoom, and multiple layout options
        </p>
      </div>

      {/* Nature Gallery - Rows Layout (Default) */}
      <ImageGallery
        data={natureGallery}
        options={{
          height: 600,
          layout: "rows",
          targetRowHeight: 200,
          enableLightbox: true,
          enableZoom: true,
          enableCaptions: true,
          enableFullscreen: true,
        }}
      >
        <ImageGalleryHeader>
          <ImageGalleryTitle />
          <ImageGalleryActions>
            <ImageGalleryDownloadButton />
            <ImageGalleryFullscreenButton />
          </ImageGalleryActions>
        </ImageGalleryHeader>
        <ImageGalleryGrid />
      </ImageGallery>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urban Gallery - Columns Layout */}
        <ImageGallery
          data={urbanGallery}
          options={{
            height: 500,
            layout: "columns",
            columns: 2,
            spacing: 8,
            enableLightbox: true,
            enableZoom: true,
          }}
        >
          <ImageGalleryHeader>
            <ImageGalleryTitle />
            <ImageGalleryActions>
              <ImageGalleryDownloadButton />
              <ImageGalleryFullscreenButton />
            </ImageGalleryActions>
          </ImageGalleryHeader>
          <ImageGalleryGrid />
        </ImageGallery>

        {/* Architecture Gallery - Masonry Layout */}
        <ImageGallery
          data={architectureGallery}
          options={{
            height: 500,
            layout: "masonry",
            columns: 2,
            spacing: 8,
            enableLightbox: true,
            enableZoom: true,
          }}
        >
          <ImageGalleryHeader>
            <ImageGalleryTitle />
            <ImageGalleryActions>
              <ImageGalleryDownloadButton />
              <ImageGalleryFullscreenButton />
            </ImageGalleryActions>
          </ImageGalleryHeader>
          <ImageGalleryGrid />
        </ImageGallery>
      </div>

      {/* Wildlife Gallery - With All Features */}
      <ImageGallery
        data={wildlifeGallery}
        options={{
          height: 500,
          layout: "rows",
          targetRowHeight: 180,
          spacing: 12,
          enableLightbox: true,
          enableZoom: true,
          enableCaptions: true,
          enableDownload: true,
          enableFullscreen: true,
          enableSlideshow: true,
          slideshowInterval: 3000,
        }}
      >
        <ImageGalleryHeader>
          <ImageGalleryTitle />
          <ImageGalleryActions>
            <ImageGalleryDownloadButton />
            <ImageGalleryFullscreenButton />
          </ImageGalleryActions>
        </ImageGalleryHeader>
        <ImageGalleryGrid />
      </ImageGallery>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">ImageGallery Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Multiple Layouts:</strong> Rows (justified), Columns (grid), Masonry (Pinterest-style)</li>
          <li><strong>Lightbox:</strong> Click any image to view in fullscreen lightbox</li>
          <li><strong>Zoom:</strong> Zoom in/out with mouse wheel or pinch gestures</li>
          <li><strong>Captions:</strong> Display image titles and descriptions in lightbox</li>
          <li><strong>Navigation:</strong> Arrow keys, click arrows, or swipe to navigate</li>
          <li><strong>Download:</strong> Download individual images or entire galleries</li>
          <li><strong>Fullscreen:</strong> Fullscreen mode for immersive viewing</li>
          <li><strong>Slideshow:</strong> Automatic slideshow with configurable interval</li>
          <li><strong>Responsive:</strong> Adapts to any screen size and orientation</li>
          <li><strong>Keyboard Support:</strong> Arrow keys, Escape, Enter for navigation</li>
          <li><strong>Touch Gestures:</strong> Swipe, pinch-to-zoom on mobile</li>
          <li><strong>Accessible:</strong> Proper ARIA labels and keyboard navigation</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Perfect for portfolios, product showcases, photo albums, and any image-heavy applications
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by <strong>react-photo-album</strong> and <strong>yet-another-react-lightbox</strong>
        </p>
      </div>
    </div>
  );
}
