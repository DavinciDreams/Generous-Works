"use client";

import { useState, useRef, useEffect, useCallback, memo } from 'react';
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

/**
 * Memoized Message Item Component
 * Prevents re-rendering when other state (like input) changes
 */
const MessageItem = memo(({ message, isLoading }: { message: Message; isLoading: boolean }) => {
  return (
    <div
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
          <div className="mt-4 bg-green-100 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">A2UI COMPONENT DETECTED</span>
            </div>
            <A2UIRenderer message={message.a2uiMessage} />

            {/* Debug: Show raw A2UI data */}
            <details className="mt-4 text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Debug: View Raw A2UI JSON
              </summary>
              <pre className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded overflow-auto max-h-48">
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
   * Memoized to prevent infinite loops
   */
  const extractA2UIFromResponse = useCallback((text: string): A2UIMessage | null => {
    console.log('[A2UI Chat] Extracting A2UI from text (length:', text.length, ')');

    // Find triple backticks
    const start = text.indexOf('```');
    const end = text.indexOf('```', start + 3);

    if (start !== -1 && end !== -1) {
      // Extract everything between the backticks
      let content = text.substring(start + 3, end);

      // Skip "json" if it's the first word
      if (content.startsWith('json')) {
        content = content.substring(4);
      }

      content = content.trim();

      console.log('[A2UI Chat] Extracted content length:', content.length);

      try {
        const parsed = JSON.parse(content);
        if (parsed.surfaceUpdate) {
          console.log('[A2UI Chat] ✅ Valid A2UI found!');
          return parsed as A2UIMessage;
        }
      } catch (e) {
        console.error('[A2UI Chat] Parse failed:', (e as Error).message);
      }
    }

    console.log('[A2UI Chat] ❌ No A2UI found');
    return null;
  }, []);

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
      let chunkCount = 0;
      const MAX_CHUNKS = 1000; // Safety limit to prevent infinite loops

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

      console.log('[A2UI Chat] Starting to read stream...');
      let extractedA2UI: A2UIMessage | null = null;
      let sseBuffer = ''; // Buffer for incomplete SSE data

      while (true) {
        chunkCount++;

        if (chunkCount > MAX_CHUNKS) {
          console.error('[A2UI Chat] ⚠️ Maximum chunk limit reached, stopping stream');
          break;
        }

        const { done, value } = await reader.read();

        if (done) {
          console.log('[A2UI Chat] Stream complete. Total chunks:', chunkCount);
          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        sseBuffer += chunk;

        // Debug: Log first chunk to see format
        if (chunkCount === 1) {
          console.log('[A2UI Chat] First chunk raw:', chunk.substring(0, 200));
        }

        // Process complete SSE messages (end with \n\n)
        const messages = sseBuffer.split('\n\n');

        // Keep the last incomplete message in buffer
        sseBuffer = messages.pop() || '';

        // Parse each complete message
        for (const message of messages) {
          const lines = message.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6); // Remove "data: " prefix
                if (jsonStr === '[DONE]') continue; // Skip done marker

                const data = JSON.parse(jsonStr);
                // ZAI uses "reasoning_content", OpenAI uses "content"
                const delta = data.choices?.[0]?.delta;
                const content = delta?.content || delta?.reasoning_content || '';

                if (content) {
                  assistantContent += content;
                }
              } catch (e) {
                // Skip malformed chunks
                if (chunkCount < 5) {
                  console.error('[A2UI Chat] SSE parse error:', e, 'Line:', line.substring(0, 100));
                }
                continue;
              }
            }
          }
        }

        // Only try to extract A2UI every 10 chunks to reduce overhead
        // OR if we detect a closing code fence (indicating complete JSON block)
        const shouldExtract = chunkCount % 10 === 0 || chunk.includes('```');

        if (shouldExtract && !extractedA2UI) {
          extractedA2UI = extractA2UIFromResponse(assistantContent);

          if (extractedA2UI) {
            console.log('[A2UI Chat] ✅ A2UI message extracted successfully at chunk', chunkCount);
          }
        }

        // Update the message content in real-time
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

      // Final extraction after streaming completes (in case we missed it)
      if (!extractedA2UI) {
        console.log('[A2UI Chat] Performing final extraction...');
        console.log('[A2UI Chat] Full assistant content (first 500 chars):', assistantContent.substring(0, 500));
        console.log('[A2UI Chat] Full assistant content (last 500 chars):', assistantContent.substring(Math.max(0, assistantContent.length - 500)));
        extractedA2UI = extractA2UIFromResponse(assistantContent);

        if (extractedA2UI) {
          console.log('[A2UI Chat] ✅ A2UI message extracted in final pass!');
        } else {
          console.log('[A2UI Chat] ❌ Failed to extract A2UI from content');
        }

        // Update with final extraction result
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

      console.log('[A2UI Chat] Final content length:', assistantContent.length);
      console.log('[A2UI Chat] Final A2UI extracted:', !!extractedA2UI);

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
          <Badge variant="default" className="text-xs bg-purple-600">87 Components</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Chat with AI to generate UIs using 87 components - specialized visualizations + standard UI
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
              <p className="text-sm">Or: "Create a login form with email and password"</p>
              <p className="text-sm">Or: "Build a card with a title, description, and button"</p>
              <p className="text-sm">Or: "Design a dashboard with stats and charts"</p>
            </div>
          )}

          {messages.map((message) => (
            <MessageItem key={message.id} message={message} isLoading={isLoading} />
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
          placeholder="Ask AI to generate any UI component..."
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
            onClick={() => setInput('Create a login form with email, password, and a submit button')}
          >
            UI: Login Form
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Build a pricing card with a title, price, features list, and CTA button')}
          >
            UI: Pricing Card
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Show me a timeline of major world events from 1900 to 2000')}
          >
            Data: Timeline
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Create a map of New York City with famous landmarks')}
          >
            Data: Map
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Build a 3D scene with a sphere, cube, and torus')}
          >
            Data: 3D Scene
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => setInput('Design a dashboard with stats cards showing metrics')}
          >
            UI: Dashboard
          </Badge>
        </div>
      )}
    </div>
  );
}
