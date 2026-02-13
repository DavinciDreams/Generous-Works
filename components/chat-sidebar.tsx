"use client";

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { A2UIRenderer } from '@/lib/a2ui/renderer';
import type { A2UIMessage } from '@/lib/a2ui/types';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  a2uiMessage?: A2UIMessage;
  timestamp: Date;
}

interface ChatSidebarProps {
  /** Optional component type to filter AI generation (e.g., "Mermaid", "Phaser") */
  componentType?: string;
  /** Optional example prompts to show */
  examplePrompts?: string[];
  /** Optional title for the chat sidebar */
  title?: string;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
}

/**
 * Memoized Message Item Component
 */
const MessageItem = memo(({ message, isLoading }: { message: Message; isLoading: boolean }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[90%] rounded-lg px-3 py-2 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="text-xs font-medium mb-1">
          {message.role === 'user' ? 'You' : 'AI'}
        </div>
        <div className="text-sm whitespace-pre-wrap">
          {message.content || (isLoading && message.role === 'assistant' ? 'Thinking...' : '')}
        </div>

        {/* Render A2UI component if present */}
        {message.a2uiMessage && (
          <div className="mt-3 bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-bold">GENERATED</span>
            </div>
            <A2UIRenderer message={message.a2uiMessage} />

            {/* Debug: Show raw A2UI data */}
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                View JSON
              </summary>
              <pre className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded overflow-auto max-h-32 text-xs">
                {JSON.stringify(message.a2uiMessage, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

/**
 * ChatSidebar Component
 *
 * A reusable AI chat interface that can be embedded in any page.
 * Supports component type filtering for focused generation.
 */
export function ChatSidebar({
  componentType,
  examplePrompts = [],
  title = 'AI Chat',
  defaultCollapsed = false
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Extract A2UI JSON from markdown code blocks
   */
  const extractA2UIFromResponse = useCallback((text: string): A2UIMessage | null => {
    const start = text.indexOf('```');
    const end = text.indexOf('```', start + 3);

    if (start !== -1 && end !== -1) {
      let content = text.substring(start + 3, end);

      // Skip "json" if it's the first word
      if (content.startsWith('json')) {
        content = content.substring(4);
      }

      content = content.trim();

      try {
        const parsed = JSON.parse(content);
        if (parsed.surfaceUpdate) {
          return parsed as A2UIMessage;
        }
      } catch (e) {
        console.error('[ChatSidebar] Parse failed:', (e as Error).message);
      }
    }

    return null;
  }, []);

  /**
   * Send a message to the A2UI chat API
   */
  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    // Add component type hint to the message if specified
    const userInput = componentType
      ? `${input} (use ${componentType} component)`
      : input;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input, // Show original input
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare messages for API
      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userInput } // Send with component type hint
      ];

      const response = await fetch('/api/a2ui-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (!reader) {
        throw new Error('No response reader available');
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      let extractedA2UI: A2UIMessage | null = null;
      let sseBuffer = '';
      let chunkCount = 0;

      while (true) {
        chunkCount++;
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        sseBuffer += chunk;

        const sseMessages = sseBuffer.split('\n\n');
        sseBuffer = sseMessages.pop() || '';

        for (const message of sseMessages) {
          const lines = message.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6);
                if (jsonStr === '[DONE]') continue;

                const data = JSON.parse(jsonStr);
                const delta = data.choices?.[0]?.delta;
                const content = delta?.content || delta?.reasoning_content || '';

                if (content) {
                  assistantContent += content;
                }
              } catch {
                continue;
              }
            }
          }
        }

        // Try to extract A2UI periodically
        const shouldExtract = chunkCount % 10 === 0 || chunk.includes('```');
        if (shouldExtract && !extractedA2UI) {
          extractedA2UI = extractA2UIFromResponse(assistantContent);
        }

        // Update message
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content: assistantContent,
                  a2uiMessage: extractedA2UI || undefined
                }
              : m
          )
        );
      }

      // Final extraction
      if (!extractedA2UI) {
        extractedA2UI = extractA2UIFromResponse(assistantContent);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content: assistantContent,
                  a2uiMessage: extractedA2UI || undefined
                }
              : m
          )
        );
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('[ChatSidebar] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-screen bg-background border-l shadow-lg transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-12" : "w-96"
      )}
    >
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-4 -translate-x-full rounded-r-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {!isCollapsed && (
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
            {componentType && (
              <Badge variant="outline" className="text-xs">
                {componentType} focused
              </Badge>
            )}
          </div>

          {/* Messages Container */}
          <Card className="flex-1 mb-4 flex flex-col overflow-hidden">
            <CardHeader className="border-b py-2">
              <CardTitle className="text-xs font-medium">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Start generating</p>
                  {examplePrompts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {examplePrompts.slice(0, 2).map((prompt, idx) => (
                        <button
                          key={idx}
                          className="block w-full text-xs text-left p-2 rounded bg-muted hover:bg-muted/80 transition-colors"
                          onClick={() => setInput(prompt)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {messages.map((message) => (
                <MessageItem key={message.id} message={message} isLoading={isLoading} />
              ))}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5" />
                    <div className="text-xs">{error}</div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what to generate..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
