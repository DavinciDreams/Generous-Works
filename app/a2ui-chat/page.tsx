"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { A2UIRenderer } from '@/lib/a2ui/renderer';
import type { A2UIMessage } from '@/lib/a2ui/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  a2uiMessage?: A2UIMessage;
  timestamp: Date;
}

export default function A2UIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Extract A2UI JSON from markdown code blocks
   */
  function extractA2UIFromResponse(text: string): A2UIMessage | null {
    // Look for JSON code blocks
    const jsonBlockRegex = /```json\s*([\s\S]*?)```/g;
    const matches = Array.from(text.matchAll(jsonBlockRegex));

    for (const match of matches) {
      try {
        const jsonStr = match[1].trim();
        const parsed = JSON.parse(jsonStr);

        // Check if it's a valid A2UI message (has surfaceUpdate)
        if (parsed.surfaceUpdate && parsed.surfaceUpdate.components) {
          return parsed as A2UIMessage;
        }
      } catch (e) {
        // Not valid JSON, continue searching
        continue;
      }
    }

    return null;
  }

  /**
   * Send a message to the A2UI chat API
   */
  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare messages for API
      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: input }
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

      // Create assistant message that we'll update
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk
        const chunk = decoder.decode(value);

        // Parse Server-Sent Events format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Text chunk from Vercel AI SDK
            const text = line.slice(2).trim();
            if (text) {
              try {
                const parsed = JSON.parse(text);
                if (parsed) {
                  assistantContent += parsed;
                }
              } catch {
                assistantContent += text;
              }
            }
          }
        }

        // Update the message content
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content: assistantContent,
                  a2uiMessage: extractA2UIFromResponse(assistantContent) || undefined
                }
              : m
          )
        );
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('[A2UI Chat] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handle Enter key to send message
   */
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h1 className="text-4xl font-bold">A2UI Chat</h1>
          <Badge variant="outline" className="text-xs">Phase 3</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Chat with AI to generate interactive Timeline, Maps, and 3D Scene components
        </p>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 mb-4 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-sm font-medium">Conversation</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm mt-2">Try: "Show me a timeline of space exploration"</p>
              <p className="text-sm">Or: "Create a map of Paris with markers"</p>
              <p className="text-sm">Or: "Build a 3D scene with colorful shapes"</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content || (isLoading && message.role === 'assistant' ? 'Thinking...' : '')}
                </div>

                {/* Render A2UI component if present */}
                {message.a2uiMessage && (
                  <div className="mt-4 bg-background rounded-lg p-4">
                    <A2UIRenderer message={message.a2uiMessage} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Error Display */}
          {error && (
            <div className="flex justify-center">
              <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 flex items-start gap-2 max-w-[80%]">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Error</div>
                  <div>{error}</div>
                </div>
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
          placeholder="Ask AI to generate a Timeline, Map, or 3D Scene..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Show me a timeline of major world events from 1900 to 2000')}
          >
            Timeline: World Events
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Create a map of New York City with famous landmarks')}
          >
            Map: NYC Landmarks
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Build a 3D scene with a sphere, cube, and torus')}
          >
            3D: Multiple Shapes
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Show me the history of computing from 1940 to 2020')}
          >
            Timeline: Computing History
          </Badge>
        </div>
      )}
    </div>
  );
}
