"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  generationId: string;
  generationName: string;
  onDeleteSuccess?: () => void;
}

interface DeleteGenerationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  generationId,
  generationName,
  onDeleteSuccess,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Call API
      const response = await fetch(`/api/generations/${generationId}`, {
        method: "DELETE",
      });

      const data: DeleteGenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete generation");
      }

      if (data.success) {
        // Notify parent of success
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
        
        // Close dialog
        onClose();
      } else {
        throw new Error("Failed to delete generation");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to delete generation:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Generation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this generation? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generation Info */}
          <div className="rounded-md bg-muted p-4">
            <p className="font-medium mb-1">You are about to delete:</p>
            <p className="text-lg font-semibold">{generationName}</p>
            <p className="text-sm text-muted-foreground mt-1">ID: {generationId}</p>
          </div>

          {/* Warning */}
          <Alert className="mt-4 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              This action is permanent and cannot be undone. All data associated with this generation will be lost.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Generation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
