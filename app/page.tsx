"use client";

import type { FormEvent, ComponentType } from "react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import type { FileUIPart } from "ai";
import type { StickToBottomContext } from "use-stick-to-bottom";

// ============================================================================
// Store Hooks
// ============================================================================
import { useMessages, useAppState } from "@/lib/store";

// ============================================================================
// AI Elements Components
// ============================================================================
import { GenerativeMessage } from "@/components/ai-elements/generative-message";
import { PromptInput, PromptInputTextarea, type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Canvas } from "@/components/ai-elements/canvas";

// ============================================================================
// UI Components for Bindings
// ============================================================================
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";

// ============================================================================
// Type Definitions
// ============================================================================

interface ExtendedStickToBottomContext extends StickToBottomContext {
  messages?: Array<{
    id: string;
    role: string;
    content: string;
  }>;
}

type ComponentRegistry = Record<string, ComponentType<any>>;

// ============================================================================
// Component Bindings (defined outside component to avoid re-creation)
// ============================================================================
const componentBindings: ComponentRegistry = {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,
  Spinner,
  Switch,
  Alert,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Separator,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ScrollArea,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
};

// ============================================================================
// Main Page Component
// ============================================================================
export default function Page() {
  // =====================
  // State Management
  // =====================
  const { messages, addMessage, updateMessage } = useMessages();
  const { isLoading, error, setLoading, setError } = useAppState();

  // =====================
  // Chat Functionality
  // =====================
  const handleSubmit = useCallback(async (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = message.text.trim();
    
    if (!prompt) return;

    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessageId = nanoid();
    addMessage({
      id: userMessageId,
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    });

    // Create assistant message placeholder for streaming
    const assistantMessageId = nanoid();
    addMessage({
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    });

    // Set loading state
    setLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add current user message
      apiMessages.push({
        role: "user",
        content: prompt,
      });

      // Call streaming API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to get response");
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          // Update message with streaming content
          updateMessage(assistantMessageId, {
            content: fullContent,
          });
        }
      }

      // Extract JSX from the response and add to message
      const jsxMatch = fullContent.match(/```(?:jsx|tsx)\s*\n([\s\S]*?)```/);
      console.log('[DEBUG] JSX extraction:', { matched: !!jsxMatch, fullContent: fullContent.substring(0, 200) });
      if (jsxMatch) {
        const extractedJsx = jsxMatch[1].trim();
        console.log('[DEBUG] Extracted JSX:', extractedJsx);
        updateMessage(assistantMessageId, {
          jsx: extractedJsx,
        });
      }

    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      // Update assistant message with error
      updateMessage(assistantMessageId, {
        content: `I apologize, but I encountered an error: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }, [messages, addMessage, updateMessage, setLoading, setError]);

  // =====================
  // Helper Functions
  // =====================
  const parseMessagesToNodes = useCallback(() => {
    return messages.map((msg, i: number) => ({
      id: `${i}`,
      type: "default",
      position: { x: 10, y: i * 100 },
      data: { label: msg.content },
    }));
  }, [messages]);

  // =====================
  // Render
  // =====================
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Messages Display - Conversation handles scroll behavior */}
      <Conversation className="flex-1">
        <ConversationContent className="overflow-y-auto">
          <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Welcome to Generative UI
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Ask me to create UI components for you!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <GenerativeMessage
                    key={message.id}
                    message={{
                      id: message.id,
                      role: message.role,
                      content: message.content,
                      jsx: message.jsx,
                      timestamp: message.timestamp,
                    }}
                    isStreaming={isLoading && message.role === "assistant"}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React type version mismatch with react-jsx-parser
                    components={componentBindings as any}
                  />
                ))
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Spinner />
                  <span className="text-sm">Generating response...</span>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </ConversationContent>
      </Conversation>

      {/* Prompt Input - OUTSIDE Conversation to prevent overflow issues */}
      <div className="border-t bg-background p-4 flex-shrink-0">
        <div className="mx-auto max-w-3xl">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea placeholder="What would you like to know?" />
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
