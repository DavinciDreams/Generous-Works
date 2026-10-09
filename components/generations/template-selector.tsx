"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, LayoutTemplateIcon, SearchIcon, FilterIcon, StarIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Template } from "@/lib/generations/templates";

interface TemplateSelectorProps {
  onSelectTemplate?: (template: Template) => void;
  className?: string;
}

interface ListTemplatesResponse {
  success: boolean;
  templates?: Template[];
  total?: number;
  error?: string;
}

export function TemplateSelector({ onSelectTemplate, className }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([]);
  const [includePublic, setIncludePublic] = useState(true);
  const [includeSystem, setIncludeSystem] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      if (includePublic) params.set('include_public', 'true');
      if (includeSystem) params.set('include_system', 'true');
      
      const response = await fetch(`/api/templates?${params.toString()}`);
      const data: ListTemplatesResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load templates");
      }

      if (data.success && data.templates) {
        setTemplates(data.templates);
      } else {
        throw new Error("Failed to load templates");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to load templates:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedTags, includePublic, includeSystem]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (includePublic) params.set('include_public', 'true');
      if (includeSystem) params.set('include_system', 'true');
      
      const response = await fetch(`/api/templates/categories?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, [includePublic, includeSystem]);

  // Fetch popular tags
  const fetchPopularTags = useCallback(async () => {
    try {
      const response = await fetch('/api/templates/tags/popular?limit=10');
      const data = await response.json();

      if (data.success && data.tags) {
        setPopularTags(data.tags);
      }
    } catch (err) {
      console.error("Failed to load popular tags:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTemplates();
    fetchCategories();
    fetchPopularTags();
  }, [fetchTemplates, fetchCategories, fetchPopularTags]);

  // Handle select template
  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  // Handle toggle tag
  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplateIcon className="h-5 w-5" />
            Templates
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
          <LayoutTemplateIcon className="h-5 w-5" />
          Templates
        </CardTitle>
        <CardDescription>
          Choose a template to get started quickly
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="space-y-4 mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Popular Tags */}
          {popularTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {popularTags.map(({ tag, count }) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleToggleTag(tag)}
                >
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Templates List */}
        <ScrollArea className="h-[400px]">
          <div className="grid gap-3">
            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LayoutTemplateIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No templates found</p>
              </div>
            ) : (
              templates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          {template.is_system_template && (
                            <Badge variant="secondary" className="text-xs">
                              System
                            </Badge>
                          )}
                          {template.is_public && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                        {template.description && (
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <StarIcon className="h-3 w-3" />
                        <span>{template.usage_count}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {template.category && (
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        )}
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatDate(template.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              {previewTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              {previewTemplate.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{previewTemplate.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-2">UI Components</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(previewTemplate.ui_components, null, 2)}
                </pre>
              </div>
              {previewTemplate.component_layouts && (
                <div>
                  <h4 className="font-medium mb-2">Component Layouts</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(previewTemplate.component_layouts, null, 2)}
                  </pre>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSelectTemplate(previewTemplate)}>
                  Use Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
