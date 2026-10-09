"use client";

import { forwardRef, useState } from "react";
import type { ComponentProps } from "react";
import { DownloadIcon, ImageDownIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGenerativeUIStore } from "@/lib/store";

// ============================================================================
// Component Actions Types
// ============================================================================

export interface ComponentActionsProps {
  componentId: string;
  onDownload?: () => void;
  onSaveAsImage?: () => void;
  onClear?: () => void;
  className?: string;
}

// ============================================================================
// Download Button
// ============================================================================

export const ComponentDownloadButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & { onDownload?: () => void }
>(({ className, onDownload, ...props }, ref) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (onDownload) {
      setDownloading(true);
      try {
        await onDownload();
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleDownload}
      disabled={downloading}
      aria-label="Download component"
      {...props}
    >
      {downloading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <DownloadIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

ComponentDownloadButton.displayName = "ComponentDownloadButton";

// ============================================================================
// Save as Image Button
// ============================================================================

export const ComponentSaveImageButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & { onSaveAsImage?: () => void }
>(({ className, onSaveAsImage, ...props }, ref) => {
  const [saving, setSaving] = useState(false);

  const handleSaveAsImage = async () => {
    if (onSaveAsImage) {
      setSaving(true);
      try {
        await onSaveAsImage();
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleSaveAsImage}
      disabled={saving}
      aria-label="Save as image"
      {...props}
    >
      {saving ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <ImageDownIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

ComponentSaveImageButton.displayName = "ComponentSaveImageButton";

// ============================================================================
// Clear Component Button
// ============================================================================

export const ComponentClearButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & { onClear?: () => void }
>(({ className, onClear, ...props }, ref) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    try {
      if (onClear) {
        await onClear();
      }
    } finally {
      setClearing(false);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8 text-destructive hover:text-destructive", className)}
        onClick={() => setConfirmDialogOpen(true)}
        disabled={clearing}
        aria-label="Clear component"
        {...props}
      >
        {clearing ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
        ) : (
          <Trash2Icon className="h-4 w-4" />
        )}
      </Button>

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-2">Clear Component?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will remove this component from the canvas. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={clearing}
              >
                {clearing ? "Clearing..." : "Clear"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ComponentClearButton.displayName = "ComponentClearButton";

// ============================================================================
// Component Actions Dropdown
// ============================================================================

export const ComponentActionsDropdown = forwardRef<
  HTMLButtonElement,
  ComponentActionsProps
>(({ componentId, onDownload, onSaveAsImage, onClear, className, ...props }, ref) => {
  const store = useGenerativeUIStore();

  const handleDownload = async () => {
    // Get component from store
    const component = store.uiComponents[componentId];
    if (!component) {
      console.error(`Component ${componentId} not found`);
      return;
    }

    // Download as JSON
    const data = JSON.stringify(component, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `component-${componentId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onDownload) {
      onDownload();
    }
  };

  const handleSaveAsImage = async () => {
    // Try to find the component element in DOM
    const element = document.getElementById(componentId);
    if (!element) {
      console.error(`Component element ${componentId} not found in DOM`);
      return;
    }

    try {
      // Dynamically import html2canvas
      const html2canvasModule = await import("html2canvas") as typeof import("html2canvas");
      const html2canvas = (html2canvasModule as any).default || html2canvasModule;
      
      // Create canvas from element
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher resolution
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to create image blob");
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `component-${componentId}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (onSaveAsImage) {
          onSaveAsImage();
        }
      });
    } catch (error) {
      console.error("Failed to save as image:", error);
      alert("Failed to save as image. Please try again.");
    }
  };

  const handleClear = async () => {
    // Remove component from store
    store.removeUIComponent(componentId);
    
    if (onClear) {
      onClear();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", className)}
          aria-label="Component actions"
          {...props}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleDownload}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Download</span>
            <span className="text-xs text-muted-foreground">Save as JSON</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSaveAsImage}>
          <ImageDownIcon className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Save as Image</span>
            <span className="text-xs text-muted-foreground">Export as PNG</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClear} className="text-destructive">
          <Trash2Icon className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Clear</span>
            <span className="text-xs text-muted-foreground">Remove component</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ComponentActionsDropdown.displayName = "ComponentActionsDropdown";

// ============================================================================
// Export Helper Functions
// ============================================================================

/**
 * Download a component as JSON file
 */
export async function downloadComponent(componentId: string): Promise<void> {
  const response = await fetch(`/api/components/${componentId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch component");
  }
  
  const component = await response.json();
  const data = JSON.stringify(component, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `component-${componentId}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Save a component element as an image
 */
export async function saveComponentAsImage(
  elementId: string,
  options?: {
    backgroundColor?: string;
    scale?: number;
    format?: "png" | "jpeg" | "webp";
  }
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element ${elementId} not found`);
  }

  const html2canvasModule = await import("html2canvas") as typeof import("html2canvas");
  const html2canvas = (html2canvasModule as any).default || html2canvasModule;
  
  const canvas = await html2canvas(element, {
    backgroundColor: options?.backgroundColor || "#ffffff",
    scale: options?.scale || 2,
  });

  const format = options?.format || "png";
  const mimeType = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create image blob"));
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `component-${elementId}-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, mimeType);
  });
}

/**
 * Clear a component from the store
 */
export async function clearComponent(componentId: string): Promise<void> {
  const store = useGenerativeUIStore.getState();
  store.removeUIComponent(componentId);
}
