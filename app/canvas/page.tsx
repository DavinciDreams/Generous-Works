"use client";

import type { FormEvent, ComponentType } from "react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { StickToBottomContext } from "use-stick-to-bottom";
import Link from "next/link";

import { useMessages, useAppState, useGenerativeUIStore } from "@/lib/store";
import { cn } from '@/lib/utils';

import { parseMessageContent } from "@/components/ai-elements/generative-message";
import { getBlockLabel, HybridRenderer } from "@/components/ai-elements/hybrid-renderer";
import { PromptInput, PromptInputTextarea, type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ArtifactShelf } from "@/components/ai-elements/artifact-shelf";
import { GalaxySurfaceLibrary } from '@/components/galaxy-surface-library';
import {
  ArtifactCanvas,
  getCanvasArtifactId,
  type CanvasArtifactItem,
} from '@/components/artifact-canvas';
import { DockedChat, splitMessageBlocks } from '@/components/docked-chat';
import {
  consumeA2UIJsonl,
  createA2UIJsonlAccumulator,
  toFinalA2UIMessages,
  toRenderableA2UIMessages,
} from '@/lib/a2ui/jsonl-stream';
import type { A2UIMessage } from '@/lib/a2ui/types';
import {
  assessA2UIVisualCompletion,
  getA2UIRenderFormat,
  getCompleteA2UIVisualRetryPrompt,
  isVisualRequest,
} from '@/lib/a2ui/visual-completion';

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
import {
  CodeEditor,
  CodeEditorHeader,
  CodeEditorTitle,
  CodeEditorActions,
  CodeEditorCopyButton,
  CodeEditorDownloadButton,
  CodeEditorFullscreenButton,
  CodeEditorContent,
} from "@/components/ai-elements/codeeditor";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ExtendedStickToBottomContext extends StickToBottomContext {
  messages?: Array<{ id: string; role: string; content: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentRegistry = Record<string, ComponentType<any>>;

const componentBindings: ComponentRegistry = {
  Button, Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription,
  Input, Textarea, Badge, Avatar, AvatarImage, AvatarFallback,
  Progress, Spinner, Switch, Alert, AlertTitle, AlertDescription,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Separator,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  ScrollArea,
  Tooltip, TooltipTrigger, TooltipContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  Popover, PopoverTrigger, PopoverContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty,
  ButtonGroup, InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea,
  CodeEditor, CodeEditorHeader, CodeEditorTitle, CodeEditorActions,
  CodeEditorCopyButton, CodeEditorDownloadButton, CodeEditorFullscreenButton, CodeEditorContent,
};

const navGroups = [
  { label: "Pages", links: [{ href: "/a2ui-chat", name: "A2UI Chat" }, { href: "/showcase", name: "Showcase" }, { href: "/canvas", name: "Canvas" }, { href: "/docs", name: "Docs" }] },
  { label: "Development", links: [{ href: "/codeeditor-test", name: "Code Editor" }, { href: "/jsonviewer-test", name: "JSON Viewer" }, { href: "/mermaid-test", name: "Mermaid" }, { href: "/node-editor-test", name: "Node Editor" }, { href: "/markdown-test", name: "Markdown" }] },
  { label: "Multimedia", links: [{ href: "/toolui-test", name: "Images & Video" }, { href: "/imagegallery-test", name: "Image Gallery" }, { href: "/svg-preview-test", name: "SVG Preview" }, { href: "/remotion-test", name: "Remotion" }] },
  { label: "3D & Games", links: [{ href: "/threescene-test", name: "Three.js" }, { href: "/phaser-test", name: "Phaser" }, { href: "/model-viewer-test", name: "Model Viewer" }, { href: "/vrm-test", name: "VRM" }] },
  { label: "Productivity", links: [{ href: "/wysiwyg-test", name: "WYSIWYG" }, { href: "/calendar-test", name: "Calendar" }, { href: "/knowledge-graph-test", name: "Knowledge Graph" }, { href: "/datatable-test", name: "DataTable" }, { href: "/latex-test", name: "LaTeX" }] },
  { label: "Maps", links: [{ href: "/maps-test", name: "Maps" }, { href: "/geospatial-test", name: "Geospatial" }] },
  { label: "Charts", links: [{ href: "/charts-test", name: "Charts" }, { href: "/timeline-test", name: "Timeline" }] },
  { label: "Social", links: [{ href: "/toolui-test", name: "Social Media Posts" }] },
  { label: "Forms", links: [{ href: "/forms-showcase", name: "Forms Showcase" }] },
];

const STREAM_RENDER_INTERVAL_MS = 80;
const MAX_VISUAL_ATTEMPTS = 2;

interface StreamedChatAttempt {
  a2ui?: A2UIMessage[];
  content: string;
  rejectedEvents: number;
}

function getCompleteA2UISurfaces(content: string): A2UIMessage[] {
  return parseMessageContent(content).flatMap((block) =>
    block.type === 'a2ui' ? [block.spec] : [],
  );
}

export default function Page() {
  const { messages, addMessage, updateMessage } = useMessages();
  const { isLoading, error, setLoading, setError } = useAppState();
  const savedChats = useGenerativeUIStore((state) => state.savedChats);
  const fetchChats = useGenerativeUIStore((state) => state.fetchChats);
  const saveCurrentChat = useGenerativeUIStore((state) => state.saveCurrentChat);
  const loadChat = useGenerativeUIStore((state) => state.loadChat);
  const deleteChat = useGenerativeUIStore((state) => state.deleteChat);
  const [navOpen, setNavOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [galaxyBrainStatus, setGalaxyBrainStatus] = useState<'checking' | 'connected' | 'unlinked' | 'unconfigured' | 'error'>('checking');
  const [galaxySurfaceWritesConfigured, setGalaxySurfaceWritesConfigured] = useState(false);
  const [galaxyAccessAllowed, setGalaxyAccessAllowed] = useState(false);
  const [galaxyConnectUrl, setGalaxyConnectUrl] = useState('/api/galaxy-brain/connect/start');
  const [useGalaxyBrain, setUseGalaxyBrain] = useState(false);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  useEffect(() => {
    let active = true;

    fetch('/api/galaxy-brain/status', { cache: 'no-store' })
      .then(async (response) => {
        const status = await response.json() as {
          configured?: boolean;
          connected?: boolean;
          surfaceWritesConfigured?: boolean;
          accessAllowed?: boolean;
          connectUrl?: string;
        };
        if (!active) return;
        setGalaxySurfaceWritesConfigured(Boolean(status.surfaceWritesConfigured));
        setGalaxyAccessAllowed(Boolean(status.accessAllowed));
        if (typeof status.connectUrl === 'string') setGalaxyConnectUrl(status.connectUrl);
        if (!status.accessAllowed) setGalaxyBrainStatus('unlinked');
        else if (status.connected) setGalaxyBrainStatus('connected');
        else if (!status.configured) setGalaxyBrainStatus('unconfigured');
        else setGalaxyBrainStatus('error');
      })
      .catch(() => {
        if (active) setGalaxyBrainStatus('error');
      });

    return () => { active = false; };
  }, []);

  const handleSubmit = useCallback(async (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = message.text.trim();
    if (!prompt) return;

    setError(null);

    const userMessageId = nanoid();
    addMessage({ id: userMessageId, role: "user", content: prompt, timestamp: Date.now() });

    const assistantMessageId = nanoid();
    addMessage({ id: assistantMessageId, role: "assistant", content: "", timestamp: Date.now() });

    setLoading(true);

    let lastRenderableA2UI: A2UIMessage[] | undefined;

    try {
      const conversationMessages = messages
        .map((msg) => ({ role: msg.role, content: msg.modelContent ?? msg.content }))
        .filter((msg) => typeof msg.content === 'string' && msg.content.trim().length > 0);
      const visualRequest = isVisualRequest(prompt);
      const attemptCount = visualRequest ? MAX_VISUAL_ATTEMPTS : 1;
      const renderFormat = getA2UIRenderFormat(prompt);

      const streamAttempt = async (attemptPrompt: string): Promise<StreamedChatAttempt> => {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...conversationMessages, { role: "user", content: attemptPrompt }],
            stream: true,
            useGalaxyBrain,
            ...(renderFormat ? { renderFormat } : {}),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || "Failed to get response");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('The response stream was unavailable');
        }

        const decoder = new TextDecoder();
        let fullContent = "";
        let lastRenderedAt = 0;
        let structuredStream = createA2UIJsonlAccumulator();
        let lastAcceptedEventCount = 0;
        const responseFormat = response.headers.get('X-Generous-Render-Format')
          ?? (response.headers.get('Content-Type')?.includes('application/x-ndjson')
            ? 'a2ui-jsonl'
            : null);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          if (responseFormat === 'a2ui-jsonl') {
            structuredStream = consumeA2UIJsonl(structuredStream, chunk);
            if (structuredStream.acceptedEvents !== lastAcceptedEventCount) {
              const a2ui = toRenderableA2UIMessages(structuredStream);
              if (a2ui.length > 0) {
                lastRenderableA2UI = a2ui;
                updateMessage(assistantMessageId, { content: '', a2ui });
              }
              lastAcceptedEventCount = structuredStream.acceptedEvents;
            }
            continue;
          }

          const now = performance.now();
          if (now - lastRenderedAt >= STREAM_RENDER_INTERVAL_MS) {
            updateMessage(assistantMessageId, { content: fullContent });
            lastRenderedAt = now;
          }
        }

        const finalChunk = decoder.decode();
        fullContent += finalChunk;

        if (responseFormat !== 'a2ui-jsonl') {
          return { content: fullContent, rejectedEvents: 0 };
        }

        structuredStream = consumeA2UIJsonl(structuredStream, finalChunk, { flush: true });
        const a2ui = toFinalA2UIMessages(structuredStream);
        if (a2ui.length > 0) {
          lastRenderableA2UI = a2ui;
          return {
            a2ui,
            content: fullContent,
            rejectedEvents: structuredStream.errors.length,
          };
        }

        if (fullContent.trim()) {
          // Providers can occasionally ignore the requested wire format. Keep
          // the text available, but let visual completion decide whether it is
          // sufficient for the user's request.
          return {
            content: fullContent,
            rejectedEvents: structuredStream.errors.length,
          };
        }

        throw new Error('The model returned an empty response');
      };

      for (let attempt = 0; attempt < attemptCount; attempt += 1) {
        const attemptPrompt = attempt === 0
          ? prompt
          : getCompleteA2UIVisualRetryPrompt(prompt);
        const result = await streamAttempt(attemptPrompt);
        const completedSurfaces = result.a2ui
          ?? getCompleteA2UISurfaces(result.content);
        const completion = assessA2UIVisualCompletion(prompt, completedSurfaces);
        const hasAnotherAttempt = attempt + 1 < attemptCount;

        if (visualRequest && !completion.complete && hasAnotherAttempt) {
          const rejected = result.rejectedEvents > 0
            ? ` ${result.rejectedEvents} structured update${result.rejectedEvents === 1 ? '' : 's'} ${result.rejectedEvents === 1 ? 'was' : 'were'} rejected.`
            : '';
          setError(`The first complete A2UI visual was incomplete.${rejected} Retrying once...`);
          continue;
        }

        updateMessage(assistantMessageId, {
          content: result.a2ui ? '' : result.content,
          modelContent: result.content,
          a2ui: result.a2ui,
        });

        if (visualRequest && !completion.complete) {
          const componentSummary = completion.componentTypes.length > 0
            ? ` Received only: ${completion.componentTypes.join(', ')}.`
            : '';
          const rejected = result.rejectedEvents > 0
            ? ` ${result.rejectedEvents} structured update${result.rejectedEvents === 1 ? '' : 's'} ${result.rejectedEvents === 1 ? 'was' : 'were'} rejected.`
            : '';
          setError(`Generous could not complete the requested visual after one retry.${componentSummary}${rejected}`);
        } else {
          setError(null);
        }

        break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      if (lastRenderableA2UI) {
        updateMessage(assistantMessageId, { a2ui: lastRenderableA2UI });
      } else {
        updateMessage(assistantMessageId, {
          content: `I apologize, but I encountered an error: ${errorMessage}`,
          modelContent: undefined,
          a2ui: undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [messages, addMessage, updateMessage, setLoading, setError, useGalaxyBrain]);

  const [focusRequest, setFocusRequest] = useState<{ id: string; nonce: number } | null>(null);
  const focusArtifact = useCallback((id: string) => {
    setFocusRequest((current) => ({ id, nonce: (current?.nonce ?? 0) + 1 }));
  }, []);

  const jsxComponents = componentBindings as unknown as Parameters<typeof HybridRenderer>[0]['jsxComponents'];

  const canvasItems = useMemo<CanvasArtifactItem[]>(() => messages.flatMap((message, index) => {
    if (message.role !== 'assistant') return [];

    const isStreaming = isLoading && index === messages.length - 1;
    const { visuals } = splitMessageBlocks(message, isStreaming);

    return visuals.map((block) => {
      const { name, emoji } = getBlockLabel(block);
      return {
        id: getCanvasArtifactId(message.id, block.id),
        turnId: message.id,
        label: name,
        emoji,
        isStreaming,
        body: (
          <HybridRenderer
            blocks={[block]}
            jsxComponents={jsxComponents}
            isStreaming={isStreaming}
          />
        ),
      };
    });
  }), [isLoading, jsxComponents, messages]);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Components navigation bar */}
      <div className="shrink-0 border-b border-border bg-background">
        <div className="px-3">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-1">
              {/* New chat */}
              <button
                type="button"
                onClick={saveCurrentChat}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New chat
              </button>

              {/* Artifact canvas shelf */}
              <ArtifactShelf jsxComponents={componentBindings as unknown as Parameters<typeof ArtifactShelf>[0]['jsxComponents']} />

              <GalaxySurfaceLibrary
                connected={galaxyBrainStatus === 'connected'}
                writesConfigured={galaxySurfaceWritesConfigured}
              />

              {galaxyBrainStatus === 'unlinked' && (
                <a
                  href={galaxyConnectUrl}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Connect Galaxy
                </a>
              )}

              {/* Chat history */}
              {savedChats.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setHistoryOpen((v) => !v)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                    <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 py-px text-[10px] font-medium text-primary leading-none">
                      {savedChats.length}
                    </span>
                  </button>

                  {historyOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setHistoryOpen(false)} />
                      {/* Panel */}
                      <div className="absolute left-0 top-full mt-1 z-50 w-72 rounded-xl border border-border bg-background/95 backdrop-blur shadow-xl overflow-hidden">
                        <div className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                          Saved chats
                        </div>
                        <ul className="max-h-72 overflow-y-auto divide-y divide-border">
                          {savedChats.map((chat) => (
                            <li key={chat.id} className="flex items-center gap-2 px-3 py-2 hover:bg-accent group">
                              <button
                                type="button"
                                className="flex-1 text-left min-w-0"
                                onClick={() => {
                                  setHistoryOpen(false);
                                  void loadChat(chat.id);
                                }}
                              >
                                <div className="text-xs font-medium text-foreground truncate">{chat.title}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {new Date(chat.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  {' · '}
                                  {chat.messageCount} messages
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteChat(chat.id)}
                                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded"
                                aria-label="Delete chat"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setNavOpen(!navOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {navOpen ? "Hide components" : "Components"}
            </button>
          </div>
          {navOpen && (
            <div className="pb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 text-xs">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className="font-medium text-muted-foreground mb-1.5 text-[10px] uppercase tracking-wider">{group.label}</div>
                  <div className="space-y-0.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-muted-foreground hover:text-foreground rounded px-1.5 py-0.5 transition-colors hover:bg-accent"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Docked chat + artifact canvas */}
      <div className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
        <aside
          aria-label="Chat"
          className="h-[45%] min-h-0 shrink-0 border-t border-border bg-background md:h-auto md:w-[400px] md:border-r md:border-t-0 lg:w-[440px]"
        >
          <DockedChat
            messages={messages}
            isLoading={isLoading}
            jsxComponents={jsxComponents}
            galaxySurfaceWritesConfigured={galaxySurfaceWritesConfigured}
            galaxyAccessAllowed={galaxyAccessAllowed}
            onFocusArtifact={focusArtifact}
            error={error}
            footer={(
              <div className="overflow-hidden rounded-xl border border-primary/20 bg-card/80 shadow-lg backdrop-blur">
                <div className="flex items-center border-b border-border/60 px-3 py-2">
                  <button
                    type="button"
                    disabled={galaxyBrainStatus !== 'connected'}
                    onClick={() => setUseGalaxyBrain((enabled) => !enabled)}
                    className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    title={
                      galaxyBrainStatus === 'connected'
                        ? 'Include relevant experiments and hypotheses from Galaxy Brain'
                        : galaxyBrainStatus === 'checking'
                          ? 'Checking Galaxy Brain connection'
                          : galaxyBrainStatus === 'unconfigured'
                            ? 'Add the Galaxy Brain URL and read-only agent token in Vercel'
                            : galaxyBrainStatus === 'unlinked'
                              ? 'Connect Galaxy with your Nostr identity'
                            : 'Galaxy Brain is configured but unavailable'
                    }
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        galaxyBrainStatus === 'connected' ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                      )}
                    />
                    Galaxy Brain
                    {useGalaxyBrain && <span className="font-medium text-primary">on</span>}
                  </button>
                </div>
                <PromptInput onSubmit={handleSubmit}>
                  <PromptInputTextarea placeholder="Ask for a chart, a map, slides, a 3D scene…" />
                </PromptInput>
              </div>
            )}
          />
        </aside>

        <main className="relative min-h-0 flex-1">
          <ArtifactCanvas
            items={canvasItems}
            focusRequest={focusRequest}
            emptyState={(
              <div className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
                Visuals you generate will appear here. Drag or scroll to pan; pinch or Ctrl+scroll to zoom.
              </div>
            )}
          />
        </main>
      </div>
    </div>
  );
}
