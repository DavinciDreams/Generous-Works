"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, FolderOpenIcon, Trash2Icon, RefreshCwIcon, SearchIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteDialog } from "./delete-dialog";
import { ExportButton } from "./export-button";
import type { Generation } from "@/lib/generations/neon-storage";
import { useGenerativeUIStore } from "@/lib/store";

interface SavedListProps {
  onLoadGeneration?: (generation: Generation) => void;
  className?: string;
}

interface ListGenerationsResponse {
  success: boolean;
  generations?: Generation[];
  total?: number;
  error?: string;
}

interface LoadGenerationResponse {
  success: boolean;
  generation?: Generation;
  error?: string;
}

export function SavedList({ onLoadGeneration, className }: SavedListProps) {
  const store = useGenerativeUIStore();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch generations
  const fetchGenerations = useCallback(async () => {
    try {
      setError(null);
      const url = searchQuery 
        ? `/api/generations?search=${encodeURIComponent(searchQuery)}`
        : "/api/generations";
      
      const response = await fetch(url);
      const data: ListGenerationsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load generations");
      }

      if (data.success && data.generations) {
        setGenerations(data.generations);
      } else {
        throw new Error("Failed to load generations");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to load generations:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchGenerations();
  };

  // Handle load generation
  const handleLoadGeneration = async (generationId: string) => {
    try {
      const response = await fetch(`/api/generations/${generationId}`);
      const data: LoadGenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load generation");
      }

      if (data.success && data.generation) {
        // Update store with loaded data
        if (data.generation.messages) {
          store.setMessages(data.generation.messages as any);
        }
        if (data.generation.ui_components) {
          // Clear existing and add new components
          store.clearUIComponents();
          Object.entries(data.generation.ui_components).forEach(([id, component]) => {
            store.addUIComponent(component as any);
          });
        }

        // Notify parent
        if (onLoadGeneration) {
          onLoadGeneration(data.generation);
        }
      } else {
        throw new Error("Failed to load generation");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to load generation:", err);
    }
  };

  // Handle delete click
  const handleDeleteClick = (generation: Generation) => {
    setGenerationToDelete({ id: generation.id, name: generation.name });
    setDeleteDialogOpen(true);
  };

  // Handle delete success
  const handleDeleteSuccess = () => {
    // Refresh the list
    fetchGenerations();
  };

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  // Filter generations based on search
  const filteredGenerations = generations.filter((gen) => {
    const query = searchQuery.toLowerCase();
    return (
      gen.name.toLowerCase().includes(query) ||
      (gen.description && gen.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Saved Generations</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search generations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading generations...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredGenerations.length === 0 && (
        <div className="text-center py-8">
          <FolderOpenIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "No generations found" : "No saved generations yet"}
          </p>
        </div>
      )}

      {/* Generations List */}
      {!isLoading && filteredGenerations.length > 0 && (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {filteredGenerations.map((generation) => (
              <Card key={generation.id} className="hover:bg-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{generation.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(generation.created_at)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {Object.keys(generation.ui_components).length} components
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {generation.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {generation.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleLoadGeneration(generation.id)}
                    >
                      <FolderOpenIcon className="mr-2 h-4 w-4" />
                      Load
                    </Button>
                    <ExportButton generation={generation} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(generation)}
                    >
                      <Trash2Icon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Delete Dialog */}
      {generationToDelete && (
        <DeleteDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setGenerationToDelete(null);
          }}
          generationId={generationToDelete.id}
          generationName={generationToDelete.name}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
