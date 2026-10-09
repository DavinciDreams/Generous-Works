"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, BarChart3Icon, TrendingUpIcon, ActivityIcon, CalendarIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsSummary, ComponentUsageStats } from "@/lib/generations/analytics";

interface AnalyticsDashboardProps {
  generationId?: string;
  className?: string;
}

interface GetSummaryResponse {
  success: boolean;
  summary?: AnalyticsSummary;
  error?: string;
}

interface GetComponentsResponse {
  success: boolean;
  components?: ComponentUsageStats[];
  error?: string;
}

export function AnalyticsDashboard({ generationId, className }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [componentStats, setComponentStats] = useState<ComponentUsageStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (generationId) params.set('generation_id', generationId);

      // Fetch summary
      const summaryResponse = await fetch(`/api/analytics/summary?${params.toString()}`);
      const summaryData: GetSummaryResponse = await summaryResponse.json();

      if (!summaryResponse.ok) {
        throw new Error(summaryData.error || "Failed to load analytics summary");
      }

      if (summaryData.success && summaryData.summary) {
        setSummary(summaryData.summary);
      }

      // Fetch component stats
      const componentsResponse = await fetch(`/api/analytics/components?${params.toString()}`);
      const componentsData: GetComponentsResponse = await componentsResponse.json();

      if (!componentsResponse.ok) {
        throw new Error(componentsData.error || "Failed to load component stats");
      }

      if (componentsData.success && componentsData.components) {
        setComponentStats(componentsData.components);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [generationId]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics();
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
            <BarChart3Icon className="h-5 w-5" />
            Analytics Dashboard
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
            <CardDescription>
              Track component usage and insights
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!summary || summary.total_events === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No analytics data available yet</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summary.total_events}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Event Types</CardTitle>
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Object.keys(summary.event_types).length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Components</CardTitle>
                    <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Object.keys(summary.component_types).length}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Event Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {Object.entries(summary.event_types)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <Badge variant="outline">{type}</Badge>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Component Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {componentStats.map((stat) => (
                        <div key={stat.component_type} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="default">{stat.component_type}</Badge>
                            <span className="text-sm font-medium">{stat.total_events} events</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Event Types:</span>
                              <div className="mt-1 space-y-1">
                                {Object.entries(stat.event_types)
                                  .sort(([, a], [, b]) => b - a)
                                  .slice(0, 3)
                                  .map(([type, count]) => (
                                    <div key={type} className="flex justify-between">
                                      <span>{type}</span>
                                      <span>{count}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Actions:</span>
                              <div className="mt-1 space-y-1">
                                {Object.entries(stat.actions)
                                  .sort(([, a], [, b]) => b - a)
                                  .slice(0, 3)
                                  .map(([action, count]) => (
                                    <div key={action} className="flex justify-between">
                                      <span>{action}</span>
                                      <span>{count}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                          {stat.last_used && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <CalendarIcon className="inline h-3 w-3 mr-1" />
                              Last used: {formatDate(stat.last_used)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {summary.daily_counts.slice(-30).reverse().map(({ date, count }) => (
                        <div key={date} className="flex items-center justify-between border-b pb-2">
                          <span className="text-sm">{formatDate(new Date(date))}</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 bg-primary rounded"
                              style={{
                                width: `${Math.min((count / Math.max(...summary.daily_counts.map(d => d.count))) * 100, 100)}px`,
                              }}
                            />
                            <span className="text-sm font-medium w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
