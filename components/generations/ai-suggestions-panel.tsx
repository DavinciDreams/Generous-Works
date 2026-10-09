"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, SparklesIcon, CheckIcon, XIcon, LightbulbIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAIOptimization, type AISuggestion, type AIRecommendation } from "@/hooks/use-ai-optimization";

interface AISuggestionsPanelProps {
  components: Record<string, unknown>;
  context?: Record<string, unknown>;
  onApplySuggestion?: (suggestion: AISuggestion) => void;
  onAddComponent?: (componentType: string) => void;
  className?: string;
}

export function AISuggestionsPanel({
  components,
  context,
  onApplySuggestion,
  onAddComponent,
  className,
}: AISuggestionsPanelProps) {
  const {
    suggestions,
    recommendations,
    isLoading,
    error,
    generateSuggestions,
    generateRecommendations,
    applySuggestion,
    dismissSuggestion,
    clearSuggestions,
    clearRecommendations,
  } = useAIOptimization({
    enabled: true,
    autoApply: false,
  });

  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  // Generate suggestions on mount
  useEffect(() => {
    if (Object.keys(components).length > 0) {
      handleGenerateSuggestions();
    }
  }, [components]);

  // Generate recommendations on mount
  useEffect(() => {
    if (context && Object.keys(context).length > 0) {
      handleGenerateRecommendations();
    }
  }, [context]);

  // Handle generate suggestions
  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    await generateSuggestions(components);
    setIsGeneratingSuggestions(false);
  };

  // Handle generate recommendations
  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    await generateRecommendations(context || {});
    setIsGeneratingRecommendations(false);
  };

  // Handle apply suggestion
  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    await applySuggestion(suggestion.id);
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'layout':
        return <LightbulbIcon className="h-4 w-4" />;
      case 'component':
        return <SparklesIcon className="h-4 w-4" />;
      case 'optimization':
        return <RefreshCwIcon className="h-4 w-4" />;
      default:
        return <LightbulbIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            <CardDescription>
              AI-powered suggestions and recommendations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleGenerateSuggestions}
              disabled={isGeneratingSuggestions}
              title="Regenerate suggestions"
            >
              {isGeneratingSuggestions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">
              Suggestions ({suggestions.length})
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              Recommendations ({recommendations.length})
            </TabsTrigger>
          </TabsList>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            {isLoading || isGeneratingSuggestions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LightbulbIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No suggestions available</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSuggestions}
                  className="mt-4"
                >
                  Generate Suggestions
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className={suggestion.applied ? "opacity-50" : ""}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(suggestion.type)}
                              <CardTitle className="text-base">{suggestion.title}</CardTitle>
                              <Badge variant={getPriorityColor(suggestion.priority) as any}>
                                {suggestion.priority}
                              </Badge>
                            </div>
                            <CardDescription className="text-xs">
                              {suggestion.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => dismissSuggestion(suggestion.id)}
                              title="Dismiss"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="font-medium">{Math.round(suggestion.confidence * 100)}%</span>
                          </div>
                          <Progress value={suggestion.confidence * 100} className="h-2" />
                          {!suggestion.applied && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleApplySuggestion(suggestion)}
                            >
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Apply Suggestion
                            </Button>
                          )}
                          {suggestion.applied && (
                            <Badge variant="default" className="w-full justify-center">
                              <CheckIcon className="mr-1 h-3 w-3" />
                              Applied
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            {isLoading || isGeneratingRecommendations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <SparklesIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recommendations available</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateRecommendations}
                  className="mt-4"
                >
                  Generate Recommendations
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <SparklesIcon className="h-4 w-4" />
                              <CardTitle className="text-base">{recommendation.component_type}</CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                              {recommendation.reason}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {Math.round(recommendation.confidence * 100)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {recommendation.recommended_components.map((component) => (
                              <Badge key={component} variant="secondary" className="text-xs">
                                {component}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => onAddComponent?.(recommendation.component_type)}
                          >
                            <SparklesIcon className="mr-2 h-4 w-4" />
                            Add Component
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
