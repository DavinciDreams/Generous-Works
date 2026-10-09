"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2Icon, LayoutGridIcon, RotateCcwIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useGenerativeUIStore } from "@/lib/store";

// ============================================================================
// Toast Notification Types
// ============================================================================

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error";
  timestamp: number;
}

// ============================================================================
// Clear Actions Component
// ============================================================================

export function ClearActions() {
  const store = useGenerativeUIStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"messages" | "components" | "all" | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // ============================================================================
  // Toast Notification Functions
  // ============================================================================

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // ============================================================================
  // Clear Actions
  // ============================================================================

  const handleClearMessages = useCallback(() => {
    try {
      store.clearMessages();
      showToast("Chat cleared successfully", "success");
    } catch (error) {
      showToast("Failed to clear chat", "error");
      console.error("Error clearing messages:", error);
    }
    setDialogOpen(false);
    setActionType(null);
  }, [store, showToast]);

  const handleClearComponents = useCallback(() => {
    try {
      store.clearUIComponents();
      showToast("Components cleared successfully", "success");
    } catch (error) {
      showToast("Failed to clear components", "error");
      console.error("Error clearing components:", error);
    }
    setDialogOpen(false);
    setActionType(null);
  }, [store, showToast]);

  const handleResetAll = useCallback(() => {
    try {
      store.reset();
      showToast("All data reset successfully", "success");
    } catch (error) {
      showToast("Failed to reset all data", "error");
      console.error("Error resetting store:", error);
    }
    setDialogOpen(false);
    setActionType(null);
  }, [store, showToast]);

  const openDialog = useCallback((type: "messages" | "components" | "all") => {
    setActionType(type);
    setDialogOpen(true);
  }, []);

  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd + Shift + C/M/U
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case "c":
            event.preventDefault();
            openDialog("messages");
            break;
          case "m":
            event.preventDefault();
            openDialog("components");
            break;
          case "u":
            event.preventDefault();
            openDialog("all");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openDialog]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      {/* Dropdown Menu for Clear Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear options"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => openDialog("messages")}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>Clear Chat</span>
              <span className="text-xs text-muted-foreground">Ctrl+Shift+C</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("components")}>
            <LayoutGridIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>Clear Components</span>
              <span className="text-xs text-muted-foreground">Ctrl+Shift+M</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openDialog("all")} className="text-destructive">
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>Reset All</span>
              <span className="text-xs text-muted-foreground">Ctrl+Shift+U</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "messages" && "Clear Chat?"}
              {actionType === "components" && "Clear Components?"}
              {actionType === "all" && "Reset All Data?"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "messages" && (
                <>
                  This will remove all messages from your conversation history.
                  <br />
                  <br />
                  <strong>This action cannot be undone.</strong>
                </>
              )}
              {actionType === "components" && (
                <>
                  This will remove all generated UI components from the canvas.
                  <br />
                  <br />
                  <strong>This action cannot be undone.</strong>
                </>
              )}
              {actionType === "all" && (
                <>
                  This will reset all data including messages, components, and cached responses.
                  <br />
                  <br />
                  <strong>This action cannot be undone.</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (actionType === "messages") handleClearMessages();
                else if (actionType === "components") handleClearComponents();
                else if (actionType === "all") handleResetAll();
              }}
              variant={actionType === "all" ? "destructive" : "default"}
            >
              {actionType === "messages" && "Clear Chat"}
              {actionType === "components" && "Clear Components"}
              {actionType === "all" && "Reset All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 duration-300 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
            role="alert"
            aria-live="polite"
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:opacity-80 transition-opacity"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
