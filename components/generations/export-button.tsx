"use client";

import { useState } from "react";
import { DownloadIcon, Loader2, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportAsJSON, exportAsHTML } from "@/lib/generations/export";
import type { Generation } from "@/lib/generations/neon-storage";

interface ExportButtonProps {
  generation: Generation;
  disabled?: boolean;
  onExportStart?: () => void;
  onExportComplete?: (format: "json" | "html") => void;
  onError?: (error: string) => void;
}

export function ExportButton({
  generation,
  disabled = false,
  onExportStart,
  onExportComplete,
  onError,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle export as JSON
  const handleExportAsJSON = async () => {
    setIsExporting(true);
    setError(null);

    if (onExportStart) {
      onExportStart();
    }

    try {
      await exportAsJSON(generation);
      
      if (onExportComplete) {
        onExportComplete("json");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export as JSON";
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error("Failed to export as JSON:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle export as HTML
  const handleExportAsHTML = async () => {
    setIsExporting(true);
    setError(null);

    if (onExportStart) {
      onExportStart();
    }

    try {
      await exportAsHTML(generation);
      
      if (onExportComplete) {
        onExportComplete("html");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export as HTML";
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error("Failed to export as HTML:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Export Button with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled || isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportAsJSON} disabled={isExporting}>
            <FileJson className="mr-2 h-4 w-4" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportAsHTML} disabled={isExporting}>
            <FileText className="mr-2 h-4 w-4" />
            Export as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
