"use client";

import { useState } from "react";
import { SaveIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGenerativeUIStore } from "@/lib/store";
import { AnimatedWrapper, PressScale } from "./animated-wrapper";

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (generationId: string) => void;
}

interface SaveGenerationResponse {
  success: boolean;
  generation?: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

export function SaveDialog({ isOpen, onClose, onSaveSuccess }: SaveDialogProps) {
  const store = useGenerativeUIStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    // Reset state
    setName("");
    setDescription("");
    setError(null);
  };

  // Handle save
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a name for this generation");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Prepare generation data
      const generationData = {
        name: name.trim(),
        description: description.trim() || undefined,
        messages: store.messages,
        ui_components: store.uiComponents,
        component_layouts: undefined, // Can be added later if needed
      };

      // Call API
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generationData),
      });

      const data: SaveGenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save generation");
      }

      if (data.success && data.generation) {
        // Notify parent of success
        if (onSaveSuccess) {
          onSaveSuccess(data.generation.id);
        }
        
        // Close dialog
        onClose();
      } else {
        throw new Error("Failed to save generation");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to save generation:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle key press (Enter to save)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <AnimatedWrapper animationType="fade" duration={0.15}>
          <DialogHeader>
            <DialogTitle>Save Generation</DialogTitle>
            <DialogDescription>
              Save your current generation to the cloud. You can access it later from the saved generations list.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Error Alert */}
            {error && (
              <AnimatedWrapper animationType="slide" delay={0.05}>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </AnimatedWrapper>
            )}

            {/* Name Field */}
            <AnimatedWrapper animationType="slideUp" delay={0.1}>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="My awesome generation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSaving}
                  autoFocus
                  maxLength={255}
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name for your generation
                </p>
              </div>
            </AnimatedWrapper>

            {/* Description Field */}
            <AnimatedWrapper animationType="slideUp" delay={0.15}>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description of what this generation contains..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSaving}
                  rows={3}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Add notes about this generation
                </p>
              </div>
            </AnimatedWrapper>

            {/* Info about what will be saved */}
            <AnimatedWrapper animationType="slideUp" delay={0.2}>
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium mb-1">This will save:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{store.messages.length} messages</li>
                  <li>{Object.keys(store.uiComponents).length} UI components</li>
                </ul>
              </div>
            </AnimatedWrapper>
          </div>

          <DialogFooter>
            <PressScale>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </PressScale>
            <PressScale>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Generation
                  </>
                )}
              </Button>
            </PressScale>
          </DialogFooter>
        </AnimatedWrapper>
      </DialogContent>
    </Dialog>
  );
}
