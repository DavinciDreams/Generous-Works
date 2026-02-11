"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DownloadIcon,
  ImagesIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

// React Photo Album for grid layouts
import PhotoAlbum from "react-photo-album";

// Yet Another React Lightbox for image viewing
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

// Import schemas
import type {
  ImageGalleryData,
  ImageGalleryOptions,
  ImageItem,
  LayoutType,
} from "@/lib/schemas/imagegallery.schema";

// --- Types ---

export type ImageGalleryProps = ComponentProps<"div"> & {
  data: ImageGalleryData;
  options?: ImageGalleryOptions;
  onImageClick?: (image: ImageItem, index: number) => void;
};

interface ImageGalleryContextValue {
  data: ImageGalleryData;
  options: ImageGalleryOptions;
  lightboxIndex: number;
  setLightboxIndex: (index: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const ImageGalleryContext = createContext<ImageGalleryContextValue | null>(null);

export const useImageGallery = () => {
  const context = useContext(ImageGalleryContext);
  if (!context) {
    throw new Error("ImageGallery components must be used within ImageGallery");
  }
  return context;
};

// --- ImageGallery Root Component ---

export const ImageGallery = memo(
  forwardRef<HTMLDivElement, ImageGalleryProps>(
    ({ data, options = {}, onImageClick, className, children, ...props }, ref) => {
      const [lightboxIndex, setLightboxIndex] = useState(-1);
      const [isFullscreen, setIsFullscreen] = useState(false);

      const value: ImageGalleryContextValue = {
        data,
        options,
        lightboxIndex,
        setLightboxIndex,
        isFullscreen,
        setIsFullscreen,
      };

      return (
        <ImageGalleryContext.Provider value={value}>
          <div
            ref={ref}
            className={cn(
              "imagegallery-container flex flex-col rounded-lg border bg-card",
              isFullscreen && "fixed inset-0 z-50 m-0 rounded-none",
              className
            )}
            style={{
              width: options.width || "100%",
              height: options.height || "auto",
            }}
            {...props}
          >
            {children}
          </div>
        </ImageGalleryContext.Provider>
      );
    }
  )
);

ImageGallery.displayName = "ImageGallery";

// --- ImageGallery Header ---

export type ImageGalleryHeaderProps = HTMLAttributes<HTMLDivElement>;

export const ImageGalleryHeader = memo(
  forwardRef<HTMLDivElement, ImageGalleryHeaderProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-b p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

ImageGalleryHeader.displayName = "ImageGalleryHeader";

// --- ImageGallery Title ---

export type ImageGalleryTitleProps = HTMLAttributes<HTMLDivElement>;

export const ImageGalleryTitle = memo(
  forwardRef<HTMLDivElement, ImageGalleryTitleProps>(
    ({ className, children, ...props }, ref) => {
      const { data } = useImageGallery();

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          <ImagesIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">
            {children || data.title || "Image Gallery"}
          </h3>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
            {data.images.length} {data.images.length === 1 ? 'image' : 'images'}
          </span>
        </div>
      );
    }
  )
);

ImageGalleryTitle.displayName = "ImageGalleryTitle";

// --- ImageGallery Actions ---

export type ImageGalleryActionsProps = HTMLAttributes<HTMLDivElement>;

export const ImageGalleryActions = memo(
  forwardRef<HTMLDivElement, ImageGalleryActionsProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

ImageGalleryActions.displayName = "ImageGalleryActions";

// --- ImageGallery Download Button ---

export const ImageGalleryDownloadButton = memo(() => {
  const { data } = useImageGallery();

  const handleDownload = useCallback(() => {
    // For single image, download directly
    if (data.images.length === 1) {
      const image = data.images[0];
      const link = document.createElement("a");
      link.href = image.src;
      link.download = image.title || image.alt || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For multiple images, download first image (in real app, could create zip)
      // Note: Creating a zip would require additional library like JSZip
      console.info("Download all images as zip - feature requires JSZip library");
      const image = data.images[0];
      const link = document.createElement("a");
      link.href = image.src;
      link.download = image.title || image.alt || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [data.images]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      aria-label="Download images"
    >
      <DownloadIcon className="h-4 w-4" />
    </Button>
  );
});

ImageGalleryDownloadButton.displayName = "ImageGalleryDownloadButton";

// --- ImageGallery Fullscreen Button ---

export const ImageGalleryFullscreenButton = memo(() => {
  const { isFullscreen, setIsFullscreen } = useImageGallery();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsFullscreen(!isFullscreen)}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

ImageGalleryFullscreenButton.displayName = "ImageGalleryFullscreenButton";

// --- ImageGallery Grid ---

export type ImageGalleryGridProps = HTMLAttributes<HTMLDivElement>;

export const ImageGalleryGrid = memo(
  forwardRef<HTMLDivElement, ImageGalleryGridProps>(
    ({ className, ...props }, ref) => {
      const { data, options, lightboxIndex, setLightboxIndex } = useImageGallery();

      // Convert images to react-photo-album format
      const photos = data.images.map((img) => ({
        src: img.src,
        width: img.width,
        height: img.height,
        alt: img.alt,
        title: img.title,
      }));

      // Convert images to lightbox slides format
      const slides = data.images.map((img) => ({
        src: img.src,
        alt: img.alt,
        title: img.title,
        description: img.description,
        download: img.src, // Enable download for this image
      }));

      const handleClick = useCallback(
        ({ index }: { index: number }) => {
          if (options?.enableLightbox !== false) {
            setLightboxIndex(index);
          }
        },
        [options?.enableLightbox, setLightboxIndex]
      );

      // Determine which plugins to enable
      const plugins = [];
      if (options?.enableZoom !== false) plugins.push(Zoom);
      if (options?.enableCaptions !== false) plugins.push(Captions);
      if (options?.enableDownload) plugins.push(Download);
      if (options?.enableFullscreen !== false) plugins.push(Fullscreen);
      if (options?.enableSlideshow) plugins.push(Slideshow);

      return (
        <div
          ref={ref}
          className={cn("imagegallery-grid flex-1 overflow-auto p-4", className)}
          {...props}
        >
          <PhotoAlbum
            photos={photos}
            layout={options?.layout || "rows"}
            targetRowHeight={options?.targetRowHeight || 200}
            columns={options?.columns || 3}
            spacing={options?.spacing || 10}
            onClick={handleClick}
          />

          {options?.enableLightbox !== false && (
            <Lightbox
              open={lightboxIndex >= 0}
              close={() => setLightboxIndex(-1)}
              index={lightboxIndex}
              slides={slides}
              plugins={plugins}
              slideshow={{
                autoplay: options?.enableSlideshow || false,
                delay: options?.slideshowInterval || 3000,
              }}
            />
          )}
        </div>
      );
    }
  )
);

ImageGalleryGrid.displayName = "ImageGalleryGrid";

// --- Exports ---

export type {
  ImageGalleryData,
  ImageGalleryOptions,
  ImageItem,
  LayoutType,
} from "@/lib/schemas/imagegallery.schema";
