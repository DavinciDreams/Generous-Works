"use client";

import { useState, useMemo, Fragment as ReactFragment } from "react";
import { DownloadIcon, ImageDownIcon, Trash2Icon, CheckSquare, Square, LayersIcon, SearchIcon, FilterIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGenerativeUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface GenerationsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ComponentItem {
  id: string;
  type: string;
  props: Record<string, unknown>;
  timestamp: number;
  selected: boolean;
}

// ============================================================================
// Generations Dashboard Component
// ============================================================================

export function GenerationsDashboard({ isOpen, onClose }: GenerationsDashboardProps) {
  const store = useGenerativeUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string | "all">("all");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"clear" | "delete" | null>(null);
  const [processing, setProcessing] = useState(false);

  // Get all components from store
  const components = useMemo(() => {
    const allComponents: ComponentItem[] = [];
    
    Object.entries(store.uiComponents).forEach(([id, component]) => {
      allComponents.push({
        id,
        type: component.type,
        props: component.props,
        timestamp: Date.now(), // Use current time since we don't have creation time
        selected: selectedComponents.has(id),
      });
    });

    return allComponents;
  }, [store.uiComponents, selectedComponents]);

  // Filter components based on search and type filter
  const filteredComponents = useMemo(() => {
    return components.filter((component) => {
      // Filter by type
      if (filterType !== "all" && component.type !== filterType) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const typeMatch = component.type.toLowerCase().includes(query);
        const propsMatch = Object.entries(component.props).some(([key, value]) => {
          const keyMatch = key.toLowerCase().includes(query);
          const valueMatch = String(value).toLowerCase().includes(query);
          return keyMatch || valueMatch;
        });
        return typeMatch || propsMatch;
      }

      return true;
    });
  }, [components, searchQuery, filterType]);

  // Get unique component types for filter
  const componentTypes = useMemo(() => {
    const types = new Set(components.map((c) => c.type));
    return Array.from(types).sort();
  }, [components]);

  // Select all components
  const selectAll = () => {
    setSelectedComponents(new Set(filteredComponents.map((c) => c.id)));
  };

  // Deselect all components
  const deselectAll = () => {
    setSelectedComponents(new Set());
  };

  // Toggle component selection
  const toggleComponent = (id: string) => {
    setSelectedComponents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Download selected components as JSON
  const handleDownloadSelected = async () => {
    setProcessing(true);
    try {
      const selectedData = filteredComponents.filter((c) => selectedComponents.has(c.id));
      
      if (selectedData.length === 0) {
        alert("Please select at least one component to download");
        return;
      }

      if (selectedData.length === 1) {
        // Download single component
        const component = store.uiComponents[selectedData[0].id];
        const data = JSON.stringify(component, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `component-${selectedData[0].id}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Download multiple components as a zip file
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        for (const item of selectedData) {
          const component = store.uiComponents[item.id];
          const data = JSON.stringify(component, null, 2);
          zip.file(`component-${item.id}.json`, data);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `components-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download components:", error);
      alert("Failed to download components. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Save selected components as images
  const handleSaveAsImages = async () => {
    setProcessing(true);
    try {
      const selectedData = filteredComponents.filter((c) => selectedComponents.has(c.id));
      
      if (selectedData.length === 0) {
        alert("Please select at least one component to save as image");
        return;
      }

      const html2canvasModule = await import("html2canvas");
      const html2canvas = (html2canvasModule as any).default || html2canvasModule;

      if (selectedData.length === 1) {
        // Save single component as image
        const element = document.getElementById(selectedData[0].id);
        if (!element) {
          console.error(`Component element ${selectedData[0].id} not found`);
          alert("Component not found in DOM. Cannot save as image.");
          return;
        }

        const canvas = await html2canvas(element, {
          backgroundColor: "#ffffff",
          scale: 2,
        });

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Failed to create image blob");
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `component-${selectedData[0].id}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, "image/png");
      } else {
        // Save multiple components as a zip file
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        for (const item of selectedData) {
          const element = document.getElementById(item.id);
          if (!element) {
            console.warn(`Component element ${item.id} not found, skipping`);
            continue;
          }

          const canvas = await html2canvas(element, {
            backgroundColor: "#ffffff",
            scale: 2,
          });

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), "image/png");
          });

          zip.file(`component-${item.id}.png`, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `components-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to save as images:", error);
      alert("Failed to save as images. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Clear selected components
  const handleClearSelected = () => {
    const selectedCount = filteredComponents.filter((c) => selectedComponents.has(c.id)).length;
    
    if (selectedCount === 0) {
      alert("Please select at least one component to clear");
      return;
    }

    setConfirmAction("clear");
    setConfirmDialogOpen(true);
  };

  // Delete selected components
  const handleDeleteSelected = () => {
    const selectedCount = filteredComponents.filter((c) => selectedComponents.has(c.id)).length;
    
    if (selectedCount === 0) {
      alert("Please select at least one component to delete");
      return;
    }

    setConfirmAction("delete");
    setConfirmDialogOpen(true);
  };

  // Confirm action
  const handleConfirmAction = async () => {
    setProcessing(true);
    try {
      if (confirmAction === "clear") {
        // Clear selected components from store
        filteredComponents.forEach((component) => {
          if (selectedComponents.has(component.id)) {
            store.removeUIComponent(component.id);
          }
        });
        setSelectedComponents(new Set());
      }
      
      if (confirmAction === "delete") {
        // Delete selected components from store
        filteredComponents.forEach((component) => {
          if (selectedComponents.has(component.id)) {
            store.removeUIComponent(component.id);
          }
        });
        setSelectedComponents(new Set());
      }
    } catch (error) {
      console.error("Failed to perform action:", error);
      alert("Failed to perform action. Please try again.");
    } finally {
      setProcessing(false);
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };

  // Get component count by type
  const componentCountByType = useMemo(() => {
    const counts: Record<string, number> = {};
    components.forEach((c) => {
      counts[c.type] = (counts[c.type] || 0) + 1;
    });
    return counts;
  }, [components]);

  // Get selected count
  const selectedCount = useMemo(() => {
    return filteredComponents.filter((c) => selectedComponents.has(c.id)).length;
  }, [filteredComponents, selectedComponents]);

  const allSelected = filteredComponents.length > 0 && selectedCount === filteredComponents.length;

  return (
    <ReactFragment>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle>Generations Dashboard</DialogTitle>
              <Badge variant="secondary">{components.length} components</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6-6 6-6" />
                <path d="m6 6 6 6 6" />
              </svg>
            </Button>
          </div>
          <DialogDescription>
            Manage, download, or clear your generated components
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter Bar */}
        <div className="flex-shrink-0 border-b p-4 gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterIcon className="h-4 w-4" />
                {filterType === "all" ? "All Types" : filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilterType("all")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {componentTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                  <div className="flex items-center justify-between w-full">
                    {type}
                    <Badge variant="outline" className="ml-2">
                      {componentCountByType[type] || 0}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Components List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <LayersIcon className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No components found</p>
              <p className="text-sm">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter"
                  : "Generate some components to see them here"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors",
                    selectedComponents.has(component.id) && "bg-accent border-accent"
                  )}
                >
                  <Checkbox
                    checked={selectedComponents.has(component.id)}
                    onCheckedChange={() => toggleComponent(component.id)}
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {component.type}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {component.type}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {Object.keys(component.props).slice(0, 3).map((key, i) => (
                          <span key={key}>
                            {key}: {String(component.props[key]).substring(0, 20)}
                            {i < 2 && ", "}
                          </span>
                        ))}
                        {Object.keys(component.props).length > 3 && "..."}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleComponent(component.id)}>
                        {selectedComponents.has(component.id) ? (
                          <>
                            <Square className="mr-2 h-4 w-4" />
                            Deselect
                          </>
                        ) : (
                          <>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Select
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          const componentData = store.uiComponents[component.id];
                          const data = JSON.stringify(componentData, null, 2);
                          const blob = new Blob([data], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `component-${component.id}-${Date.now()}.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          const element = document.getElementById(component.id);
                          if (!element) {
                            alert("Component not found in DOM");
                            return;
                          }
                          try {
                            const html2canvasModule = await import("html2canvas");
                            const html2canvas = (html2canvasModule as any).default || html2canvasModule;
                            const canvas = await html2canvas(element, {
                              backgroundColor: "#ffffff",
                              scale: 2,
                            });
                            canvas.toBlob((blob) => {
                              if (!blob) return;
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `component-${component.id}-${Date.now()}.png`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }, "image/png");
                          } catch (error) {
                            console.error("Failed to save as image:", error);
                            alert("Failed to save as image");
                          }
                        }}
                      >
                        <ImageDownIcon className="mr-2 h-4 w-4" />
                        Save as Image
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setConfirmAction("delete");
                          setSelectedComponents(new Set([component.id]));
                          setConfirmDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex-shrink-0 flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={allSelected ? deselectAll : selectAll}
            >
              {allSelected ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Select All
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedCount} of {filteredComponents.length} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSelected}
              disabled={selectedCount === 0 || processing}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download {selectedCount > 1 ? `(${selectedCount})` : ""}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveAsImages}
              disabled={selectedCount === 0 || processing}
            >
              <ImageDownIcon className="mr-2 h-4 w-4" />
              Save as Image{selectedCount > 1 ? `s (${selectedCount})` : ""}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearSelected}
              disabled={selectedCount === 0 || processing}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Clear {selectedCount > 1 ? `(${selectedCount})` : ""}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "clear" && "Clear Components?"}
              {confirmAction === "delete" && "Delete Components?"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "clear" && (
                <>
                  This will clear {selectedCount} component{selectedCount > 1 ? "s" : ""} from the canvas.
                  <br />
                  <br />
                  <strong>This action cannot be undone.</strong>
                </>
              )}
              {confirmAction === "delete" && (
                <>
                  This will permanently delete {selectedCount} component{selectedCount > 1 ? "s" : ""}.
                  <br />
                  <br />
                  <strong>This action cannot be undone.</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmAction}
              disabled={processing}
            >
              {processing ? "Processing..." : confirmAction === "clear" ? "Clear" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ReactFragment>
  );
}

GenerationsDashboard.displayName = "GenerationsDashboard";
