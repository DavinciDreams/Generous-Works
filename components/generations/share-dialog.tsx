"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Share2Icon, CopyIcon, CheckIcon, Trash2Icon, EyeIcon, ClockIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Share } from "@/lib/generations/sharing";

interface ShareDialogProps {
  generationId: string;
  generationName: string;
  onShareCreated?: (share: Share) => void;
  trigger?: React.ReactNode;
}

interface ListSharesResponse {
  success: boolean;
  shares?: Share[];
  total?: number;
  error?: string;
}

interface CreateShareResponse {
  success: boolean;
  share?: Share;
  error?: string;
}

interface DeleteShareResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export function ShareDialog({ generationId, generationName, onShareCreated, trigger }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [shares, setShares] = useState<Share[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDays, setExpirationDays] = useState(7);

  // Fetch shares when dialog opens
  const fetchShares = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(`/api/generations/${generationId}/shares`);
      const data: ListSharesResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load shares");
      }

      if (data.success && data.shares) {
        setShares(data.shares);
      } else {
        throw new Error("Failed to load shares");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to load shares:", err);
    } finally {
      setIsLoading(false);
    }
  }, [generationId]);

  // Handle create share
  const handleCreateShare = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const expiresAt = hasExpiration
        ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
        : null;

      const response = await fetch(`/api/generations/${generationId}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_readonly: isReadonly,
          expires_at: expiresAt?.toISOString(),
        }),
      });
      const data: CreateShareResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create share");
      }

      if (data.success && data.share) {
        // Refresh shares
        await fetchShares();
        // Call onShareCreated callback if provided
        if (onShareCreated) {
          onShareCreated(data.share);
        }
        // Copy the share link
        await copyToClipboard(data.share.share_url, data.share.id);
      } else {
        throw new Error("Failed to create share");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to create share:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete share
  const handleDeleteShare = async (shareId: string) => {
    try {
      setIsDeleting(shareId);
      setError(null);
      const response = await fetch(`/api/shares/${shareId}`, {
        method: 'DELETE',
      });
      const data: DeleteShareResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete share");
      }

      if (data.success) {
        // Refresh shares
        await fetchShares();
      } else {
        throw new Error("Failed to delete share");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to delete share:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle copy to clipboard
  const copyToClipboard = async (text: string, shareId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(shareId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Expired";
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires in 1 day";
    return `Expires in ${days} days`;
  };

  // Fetch shares when dialog opens
  useEffect(() => {
    if (open) {
      fetchShares();
    }
  }, [open, fetchShares]);

  const defaultTrigger = (
    <Button variant="outline" size="icon">
      <Share2Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share "{generationName}"</DialogTitle>
          <DialogDescription>
            Create share links to collaborate with others
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Create Share Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Share Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="readonly"
                checked={isReadonly}
                onCheckedChange={setIsReadonly}
              />
              <Label htmlFor="readonly" className="flex items-center gap-2">
                {isReadonly ? <LockIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                {isReadonly ? "Read-only access" : "Allow editing"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="expiration"
                checked={hasExpiration}
                onCheckedChange={(checked) => setHasExpiration(checked as boolean)}
              />
              <Label htmlFor="expiration" className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                Set expiration date
              </Label>
            </div>

            {hasExpiration && (
              <div className="space-y-2">
                <Label htmlFor="expirationDays">Expiration (days)</Label>
                <Input
                  id="expirationDays"
                  type="number"
                  min="1"
                  max="365"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(parseInt(e.target.value, 10))}
                />
              </div>
            )}

            <Button
              onClick={handleCreateShare}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Share2Icon className="mr-2 h-4 w-4" />
                  Create Share Link
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Shares */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Share Links</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : shares.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Share2Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No share links created yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {shares.map((share) => (
                    <div key={share.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {share.is_readonly ? (
                              <Badge variant="secondary" className="text-xs">
                                <LockIcon className="h-3 w-3 mr-1" />
                                Read-only
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs">
                                <EyeIcon className="h-3 w-3 mr-1" />
                                Editable
                              </Badge>
                            )}
                            {share.expires_at && (
                              <Badge variant="outline" className="text-xs">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatRelativeTime(share.expires_at)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              value={share.share_url}
                              readOnly
                              className="text-xs"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(share.share_url, share.id)}
                              title="Copy link"
                            >
                              {copiedLink === share.id ? (
                                <CheckIcon className="h-4 w-4" />
                              ) : (
                                <CopyIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              <EyeIcon className="inline h-3 w-3 mr-1" />
                              {share.view_count} views
                            </span>
                            <span>Created {formatDate(share.created_at)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteShare(share.id)}
                          disabled={isDeleting === share.id}
                          title="Delete share"
                        >
                          {isDeleting === share.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2Icon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
