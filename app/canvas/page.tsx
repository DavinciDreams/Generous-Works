"use client";

import { useState, useCallback, useMemo } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { GenerativeMessage } from "@/components/ai-elements/generative-message";
import { PromptInput } from "@/components/ai-elements/prompt-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { MessageSquareIcon, ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

// Local type matching GenerativeMessage expectations
interface GenerativeMessageData {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  jsx?: string;
  timestamp?: number;
  uiComponents?: Array<{
    id: string;
    jsx: string;
    componentName: string;
    state?: Record<string, unknown>;
  }>;
}

export default function CanvasPage() {
  const [messages, setMessages] = useState<GenerativeMessageData[]>(() => [
    {
      id: "1",
      role: "assistant",
      content: "Welcome to the Canvas! This is an infinite canvas where you can visualize and organize your ideas. Use the chat panel to interact with AI and get suggestions for your canvas.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [chatOpen, setChatOpen] = useState(true);

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: GenerativeMessageData = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: GenerativeMessageData = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I received your message: "${input}". How can I help you with your canvas?`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const componentBindings = useMemo(
    () => ({
      Button,
      Card,
      CardHeader,
      CardContent,
      CardTitle,
    }),
    []
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Main Canvas Area */}
      <div className={cn("flex-1 transition-all duration-300", chatOpen ? "mr-96" : "")}>
        <div className="h-full w-full">
          <Canvas>
            {/* Canvas content can be added here - nodes, edges, etc. */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Infinite Canvas</h1>
                <p className="text-lg">Pan, zoom, and organize your ideas</p>
                <p className="text-sm">Use the chat panel to interact with AI</p>
              </div>
            </div>
          </Canvas>
        </div>
      </div>

      {/* Chat Panel */}
      <Collapsible open={chatOpen} onOpenChange={setChatOpen}>
        <div className={cn("fixed right-0 top-0 h-full w-96 border-l bg-card transition-all duration-300", !chatOpen && "w-0")}>
          <CollapsibleContent className="h-full">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5" />
                  <h2 className="font-semibold">AI Chat</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setChatOpen(false)}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <Conversation className="flex-1">
                <ConversationContent>
                  {messages.map((message) => (
                    <GenerativeMessage
                      key={message.id}
                      message={message}
                      components={componentBindings}
                    />
                  ))}
                  {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </ConversationContent>
              </Conversation>

              {/* Input */}
              <div className="border-t p-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="mt-2 w-full"
                >
                  Send Message
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Toggle Button (when chat is closed) */}
      {!chatOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChatOpen(true)}
          className="fixed right-4 top-4 z-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <MessageSquareIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
