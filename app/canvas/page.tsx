"use client";

import type { FormEvent, ComponentType } from "react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import type { StickToBottomContext } from "use-stick-to-bottom";
import Link from "next/link";

import { useMessages, useAppState, useGenerativeUIStore } from "@/lib/store";
import { cn } from '@/lib/utils';

import { GenerativeMessage } from "@/components/ai-elements/generative-message";
import { PromptInput, PromptInputTextarea, type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { ArtifactShelf } from "@/components/ai-elements/artifact-shelf";
import { GalaxySurfaceControls } from '@/components/galaxy-surface-controls';

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
  const [galaxyBrainStatus, setGalaxyBrainStatus] = useState<'checking' | 'connected' | 'unconfigured' | 'error'>('checking');
  const [galaxySurfaceWritesConfigured, setGalaxySurfaceWritesConfigured] = useState(false);
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
        };
        if (!active) return;
        setGalaxySurfaceWritesConfigured(Boolean(status.surfaceWritesConfigured));
        if (status.connected) setGalaxyBrainStatus('connected');
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

    try {
      const apiMessages = messages
        .filter((msg) => typeof msg.content === 'string' && msg.content.trim().length > 0)
        .map((msg) => ({ role: msg.role, content: msg.content }));

      apiMessages.push({ role: "user", content: prompt });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, stream: true, useGalaxyBrain }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
          updateMessage(assistantMessageId, { content: fullContent });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      updateMessage(assistantMessageId, { content: `I apologize, but I encountered an error: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  }, [messages, addMessage, updateMessage, setLoading, setError, useGalaxyBrain]);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Components navigation bar */}
      <div className="shrink-0 border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4">
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
                                onClick={() => { loadChat(chat.id); setHistoryOpen(false); }}
                              >
                                <div className="text-xs font-medium text-foreground truncate">{chat.title}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {new Date(chat.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  {' · '}
                                  {chat.messages.length} messages
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

      {/* Messages area */}
      <Conversation className="flex-1">
        <ConversationContent className="overflow-y-auto">
          <div className="px-4 py-8">
            <div className="mx-auto max-w-3xl space-y-8">
              {messages.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                  <div className="text-center space-y-4">
                    <div
                      className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-xl mb-2"
                      style={{ background: 'linear-gradient(135deg, #0097b2, #7ed952)' }}
                    >
                      ✦
                    </div>
                    <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Ask for anything.
                    </h2>
                    <p className="text-muted-foreground max-w-xs leading-relaxed text-sm">
                      Charts, 3D scenes, maps, code, timelines, slides, docs — watch it render live.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isStreaming = isLoading && message.role === "assistant" && index === messages.length - 1;
                  return (
                    <div key={message.id}>
                      <GenerativeMessage
                        message={{ id: message.id, role: message.role, content: message.content, timestamp: message.timestamp }}
                        isStreaming={isStreaming}
                        components={componentBindings as unknown as Parameters<typeof GenerativeMessage>[0]['components']}
                      />
                      {message.role === 'assistant' && (
                        <GalaxySurfaceControls
                          messageId={message.id}
                          content={message.content}
                          isStreaming={isStreaming}
                          writesConfigured={galaxySurfaceWritesConfigured}
                        />
                      )}
                    </div>
                  );
                })
              )}

              {isLoading && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Spinner />
                  <span className="text-sm">Generating response...</span>
                </div>
              )}

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

      {/* Prompt input */}
      <div className="shrink-0 px-4 py-4 border-t border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl overflow-hidden bg-card/80 backdrop-blur"
            style={{ border: '1px solid rgba(0, 151, 178, 0.2)', boxShadow: '0 0 0 1px rgba(0,151,178,0.05), 0 8px 32px rgba(0,0,0,0.15)' }}>
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
              <PromptInputTextarea placeholder="Ask for anything — a chart, a map, slides, a document, a 3D scene…" />
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
