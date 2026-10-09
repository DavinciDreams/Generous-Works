"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, HistoryIcon, RotateCcwIcon, Trash2Icon, GitCompareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { GenerationHistory } from "@/lib/generations/version-control";

interface VersionHistoryProps {
  generationId: string;
  onRestore?: (version: GenerationHistory) => void;
  className?: string;
}

interface ListVersionsResponse {
  success: boolean;
  versions?: GenerationHistory[];
  total?: number;
  error?: string;
}

interface RestoreVersionResponse {
  success: boolean;
  version?: GenerationHistory;
  error?: string;
}

interface DeleteVersionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export function VersionHistory({ generationId, onRestore, className }: VersionHistoryProps) {
  const [versions, setVersions] = useState<GenerationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [compareVersion1, setCompareVersion1] = useState<GenerationHistory | null>(null);
  const [compareVersion2, setCompareVersion2] = useState<GenerationHistory | null>(null);

  // Fetch versions
  const fetchVersions = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/generations/${generationId}/versions`);
      const data: ListVersionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load versions");
      }

      if (data.success && data.versions) {
        setVersions(data.versions);
      } else {
        throw new Error("Failed to load versions");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to load versions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [generationId]);

  // Initial load
  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  // Handle restore version
  const handleRestore = async (versionId: string) => {
    try {
      setIsRestoring(versionId);
      const response = await fetch(`/api/generations/${generationId}/versions/${versionId}?action=restore`, {
        method: 'POST',
      });
      const data: RestoreVersionResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to restore version");
      }

      if (data.success && data.version) {
        // Refresh versions
        await fetchVersions();
        // Call onRestore callback if provided
        if (onRestore) {
          onRestore(data.version);
        }
      } else {
        throw new Error("Failed to restore version");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to restore version:", err);
    } finally {
      setIsRestoring(null);
    }
  };

  // Handle delete version
  const handleDelete = async (versionId: string) => {
    try {
      setIsDeleting(versionId);
      const response = await fetch(`/api/generations/${generationId}/versions/${versionId}`, {
        method: 'DELETE',
      });
      const data: DeleteVersionResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete version");
      }

      if (data.success) {
        // Refresh versions
        await fetchVersions();
      } else {
        throw new Error("Failed to delete version");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to delete version:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle compare versions
  const handleCompare = (version1: GenerationHistory, version2: GenerationHistory) => {
    setCompareVersion1(version1);
    setCompareVersion2(version2);
    setCompareDialogOpen(true);
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

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          View and restore previous versions of this generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HistoryIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No version history available</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div key={version.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={version.is_current_version ? "default" : "secondary"}>
                          v{version.version}
                        </Badge>
                        {version.is_current_version && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{version.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(version.created_at)}
                      </p>
                      {version.change_reason && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {version.change_reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {!version.is_current_version && (
                        <>
                          {index < versions.length - 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCompare(version, versions[index + 1])}
                              title="Compare with next version"
                            >
                              <GitCompareIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestore(version.id)}
                            disabled={isRestoring === version.id}
                            title="Restore this version"
                          >
                            {isRestoring === version.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcwIcon className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(version.id)}
                            disabled={isDeleting === version.id}
                            title="Delete this version"
                          >
                            {isDeleting === version.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Compare Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Compare changes between version {compareVersion1?.version} and version {compareVersion2?.version}
            </DialogDescription>
          </DialogHeader>
          {compareVersion1 && compareVersion2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Version {compareVersion1.version}</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(compareVersion1.created_at)}</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify({
                      name: compareVersion1.name,
                      messages: compareVersion1.messages,
                      ui_components: compareVersion1.ui_components,
                    }, null, 2)}
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Version {compareVersion2.version}</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(compareVersion2.created_at)}</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify({
                      name: compareVersion2.name,
                      messages: compareVersion2.messages,
                      ui_components: compareVersion2.ui_components,
                    }, null, 2)}
                  </pre>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Differences</h4>
                <div className="text-sm space-y-1">
                  {compareVersion1.name !== compareVersion2.name && (
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 text-red-500 line-through">{compareVersion1.name}</span>
                      <span className="ml-2 text-green-500">{compareVersion2.name}</span>
                    </div>
                  )}
                  {compareVersion1.messages.length !== compareVersion2.messages.length && (
                    <div>
                      <span className="text-muted-foreground">Messages:</span>
                      <span className="ml-2 text-red-500 line-through">{compareVersion1.messages.length}</span>
                      <span className="ml-2 text-green-500">{compareVersion2.messages.length}</span>
                    </div>
                  )}
                  {JSON.stringify(compareVersion1.ui_components) !== JSON.stringify(compareVersion2.ui_components) && (
                    <div>
                      <span className="text-muted-foreground">UI Components:</span>
                      <span className="ml-2">Changed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
