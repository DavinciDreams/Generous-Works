"use client";

import { ToolUI } from "@/components/ai-elements/toolui";
import type { ToolUIData } from "@/lib/schemas/toolui.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// All 18 Tool UI Components
// ============================================================================

// 1. Approval Card
const approvalCardExample: ToolUIData = {
  type: "approval-card",
  data: {
    id: "approval-1",
    title: "Deploy to Production",
    description: "Deploy version 2.5.0 to production environment",
    metadata: [
      { key: "Environment", value: "Production" },
      { key: "Version", value: "2.5.0" },
      { key: "Requester", value: "Sarah Chen" },
    ],
    variant: "default",
    confirmLabel: "Approve",
    cancelLabel: "Reject",
  },
};

// 2. Weather Widget
const weatherWidgetExample: ToolUIData = {
  type: "weather-widget",
  data: {
    id: "weather-1",
    location: "San Francisco, CA",
    unit: "fahrenheit",
    current: {
      temp: 72,
      tempMin: 58,
      tempMax: 78,
      condition: "partly-cloudy",
      humidity: 65,
      windSpeed: 12,
      windDirection: 315, // NW direction in degrees
      precipitation: "light",
    },
    forecast: [
      { day: "Mon", condition: "clear", tempMax: 80, tempMin: 60 },
      { day: "Tue", condition: "cloudy", tempMax: 75, tempMin: 58 },
      { day: "Wed", condition: "rain", tempMax: 68, tempMin: 55 },
    ],
  },
};

// 3. Stats Display
const statsDisplayExample: ToolUIData = {
  type: "stats-display",
  data: {
    id: "stats-1",
    title: "Business Metrics",
    stats: [
      {
        key: "revenue",
        label: "Revenue",
        value: 127450,
        format: { kind: "currency", currency: "USD", decimals: 2 },
        diff: { value: 12.5, decimals: 1, upIsPositive: true, label: "vs last month" },
        sparkline: { data: [45000, 52000, 48000, 61000, 58000, 67000, 72450] },
      },
      {
        key: "users",
        label: "Active Users",
        value: 8234,
        format: { kind: "number", compact: true },
        diff: { value: 5.2, decimals: 1, upIsPositive: true },
        sparkline: { data: [7200, 7400, 7800, 8100, 8000, 8150, 8234] },
      },
      {
        key: "conversion",
        label: "Conversion Rate",
        value: 0.0324,
        format: { kind: "percent", decimals: 2, basis: "fraction" },
        diff: { value: -0.8, decimals: 1, upIsPositive: true },
        sparkline: { data: [0.038, 0.036, 0.035, 0.034, 0.033, 0.032, 0.0324] },
      },
    ],
  },
};

// 4. Progress Tracker
const progressTrackerExample: ToolUIData = {
  type: "progress-tracker",
  data: {
    id: "progress-1",
    steps: [
      {
        id: "1",
        label: "Code Review",
        description: "Review all changes and approve",
        status: "completed",
      },
      {
        id: "2",
        label: "Run Tests",
        description: "Execute full test suite",
        status: "completed",
      },
      {
        id: "3",
        label: "Build & Package",
        description: "Create deployment artifacts",
        status: "in-progress",
      },
      {
        id: "4",
        label: "Deploy",
        description: "Deploy to production",
        status: "pending",
      },
    ],
  },
};

// 5. Option List
const optionListExample: ToolUIData = {
  type: "option-list",
  data: {
    id: "option-list-1",
    options: [
      {
        id: "starter",
        label: "Starter - $9.99/mo",
        description: "Perfect for individuals and small projects. 5 projects, 10GB storage, Email support",
      },
      {
        id: "pro",
        label: "Pro - $29.99/mo",
        description: "For growing teams and businesses. Unlimited projects, 100GB storage, Priority support",
      },
      {
        id: "enterprise",
        label: "Enterprise - $99.99/mo",
        description: "Custom solutions for large organizations. Everything in Pro, Custom integrations, Dedicated support",
      },
    ],
    defaultValue: "pro",
  },
};

// 6. Instagram Post
const instagramPostExample: ToolUIData = {
  type: "instagram-post",
  data: {
    id: "1",
    author: {
      name: "Tech Startup Inc",
      handle: "techstartup",
      avatarUrl: "https://i.pravatar.cc/150?u=techstartup",
      verified: true,
    },
    text: "Excited to announce our new AI-powered features! 🚀 #AI #Innovation #TechStartup",
    media: [
      { type: "image" as const, url: "https://picsum.photos/600/600?random=1", alt: "AI features demo" },
    ],
    stats: {
      likes: 1234,
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
};

// 7. LinkedIn Post
const linkedInPostExample: ToolUIData = {
  type: "linkedin-post",
  data: {
    id: "1",
    author: {
      name: "Jane Smith",
      headline: "VP of Engineering at TechCorp",
      avatarUrl: "https://i.pravatar.cc/150?u=janesmith",
    },
    text: "Thrilled to share that our team just launched the new AI features! Big thanks to everyone involved.",
    stats: { likes: 456, isLiked: false },
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
};

// 8. X (Twitter) Post
const xPostExample: ToolUIData = {
  type: "x-post",
  data: {
    id: "1",
    author: {
      name: "Tech News",
      handle: "technews",
      avatarUrl: "https://i.pravatar.cc/150?u=technews",
      verified: true,
    },
    text: "Breaking: New AI breakthrough enables real-time language translation with 99% accuracy 🎯",
    stats: { likes: 8932, isLiked: true },
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
};

// 9. Link Preview
const linkPreviewExample: ToolUIData = {
  type: "link-preview",
  data: {
    id: "1",
    href: "https://example.com/article",
    title: "The Future of AI: What to Expect in 2024",
    description: "Exploring the latest trends and predictions in artificial intelligence and machine learning.",
    image: "https://picsum.photos/800/400?random=2",
    domain: "example.com",
  },
};

// 10. Video
const videoExample: ToolUIData = {
  type: "video",
  data: {
    id: "1",
    assetId: "demo-video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://picsum.photos/800/450?random=3",
    title: "Product Demo",
    durationMs: 120000,
  },
};

// 11. Message Draft
const messageDraftExample: ToolUIData = {
  type: "message-draft",
  data: {
    id: "1",
    channel: "email",
    to: ["john@example.com"],
    subject: "Project Update - Q4 2024",
    body: "Hi team,\n\nI wanted to share a quick update on our Q4 progress...",
  },
};

// 12. Item Carousel
const itemCarouselExample: ToolUIData = {
  type: "item-carousel",
  data: {
    id: "1",
    items: [
      { id: "1", name: "Product A", image: "https://picsum.photos/300/300?random=4", subtitle: "$29.99" },
      { id: "2", name: "Product B", image: "https://picsum.photos/300/300?random=5", subtitle: "$39.99" },
      { id: "3", name: "Product C", image: "https://picsum.photos/300/300?random=6", subtitle: "$49.99" },
      { id: "4", name: "Product D", image: "https://picsum.photos/300/300?random=7", subtitle: "$59.99" },
    ],
  },
};

// 13. Order Summary
const orderSummaryExample: ToolUIData = {
  type: "order-summary",
  data: {
    id: "1",
    items: [
      { id: "1", name: "Premium Subscription", unitPrice: 29.99, quantity: 1 },
      { id: "2", name: "Extra Storage (100GB)", unitPrice: 9.99, quantity: 2 },
    ],
    pricing: {
      subtotal: 49.97,
      tax: 4.50,
      shipping: 0,
      total: 54.47,
    },
  },
};

// 14. Parameter Slider
const parameterSliderExample: ToolUIData = {
  type: "parameter-slider",
  data: {
    id: "1",
    sliders: [
      { id: "opacity", label: "Opacity", min: 0, max: 1, step: 0.1, value: 0.8, unit: "" },
      { id: "size", label: "Size", min: 10, max: 100, step: 5, value: 50, unit: "px" },
      { id: "rotation", label: "Rotation", min: 0, max: 360, step: 15, value: 90, unit: "°" },
    ],
  },
};

// 15. Preferences Panel
const preferencesPanelExample: ToolUIData = {
  type: "preferences-panel",
  data: {
    id: "1",
    sections: [
      {
        heading: "Appearance",
        items: [
          { type: "switch", id: "dark-mode", label: "Dark Mode", description: "Use dark theme" },
          { type: "switch", id: "compact", label: "Compact View", description: "Reduce spacing" },
        ],
      },
      {
        heading: "Notifications",
        items: [
          { type: "switch", id: "email-notif", label: "Email Notifications" },
          { type: "switch", id: "push-notif", label: "Push Notifications" },
        ],
      },
    ],
  },
};

// 16. Question Flow
const questionFlowExample: ToolUIData = {
  type: "question-flow",
  data: {
    id: "1",
    step: 1,
    title: "What's your primary goal?",
    description: "This helps us personalize your experience",
    options: [
      { id: "growth", label: "Business Growth", description: "Scale and expand operations" },
      { id: "efficiency", label: "Efficiency", description: "Optimize current processes" },
      { id: "innovation", label: "Innovation", description: "Develop new products/services" },
    ],
  },
};

// 17. Image Gallery
const imageGalleryExample: ToolUIData = {
  type: "image-gallery",
  data: {
    id: "gallery-1",
    title: "Product Photography",
    description: "Our latest product collection featuring cutting-edge technology",
    images: [
      {
        id: "img-1",
        src: "https://picsum.photos/800/600?random=10",
        alt: "Modern workspace with laptop and coffee",
        width: 800,
        height: 600,
        title: "Workspace Setup",
        caption: "A minimalist workspace designed for productivity",
        source: {
          label: "Unsplash",
          url: "https://unsplash.com",
        },
      },
      {
        id: "img-2",
        src: "https://picsum.photos/800/600?random=11",
        alt: "Close-up of mechanical keyboard",
        width: 800,
        height: 600,
        title: "Premium Keyboard",
        caption: "Mechanical keyboard with RGB lighting",
      },
      {
        id: "img-3",
        src: "https://picsum.photos/800/600?random=12",
        alt: "Smartphone displaying app interface",
        width: 800,
        height: 600,
        title: "Mobile App",
        caption: "Our mobile app with intuitive design",
        source: {
          label: "Product Team",
        },
      },
      {
        id: "img-4",
        src: "https://picsum.photos/800/600?random=13",
        alt: "Wireless headphones on desk",
        width: 800,
        height: 600,
        title: "Audio Gear",
        caption: "Premium noise-cancelling headphones",
      },
    ],
  },
};

// 18. Data Table
const dataTableExample: ToolUIData = {
  type: "data-table",
  data: {
    id: "table-1",
    columns: [
      {
        key: "name",
        label: "Product Name",
        sortable: true,
        priority: "primary",
      },
      {
        key: "status",
        label: "Status",
        format: {
          kind: "status",
          statusMap: {
            active: { tone: "success", label: "Active" },
            pending: { tone: "warning", label: "Pending" },
            discontinued: { tone: "danger", label: "Discontinued" },
          },
        },
      },
      {
        key: "price",
        label: "Price",
        sortable: true,
        align: "right",
        format: {
          kind: "currency",
          currency: "USD",
          decimals: 2,
        },
      },
      {
        key: "sales",
        label: "Sales",
        sortable: true,
        align: "right",
        format: {
          kind: "number",
          compact: true,
        },
      },
      {
        key: "change",
        label: "Change",
        align: "right",
        format: {
          kind: "delta",
          decimals: 1,
          upIsPositive: true,
          showSign: true,
        },
      },
      {
        key: "lastUpdated",
        label: "Last Updated",
        hideOnMobile: true,
        format: {
          kind: "date",
          dateFormat: "relative",
        },
      },
    ],
    data: [
      {
        name: "Smart Watch Pro",
        status: "active",
        price: 399.99,
        sales: 15234,
        change: 12.5,
        lastUpdated: Date.now() - 3600000,
      },
      {
        name: "Wireless Earbuds",
        status: "active",
        price: 149.99,
        sales: 28567,
        change: 8.3,
        lastUpdated: Date.now() - 7200000,
      },
      {
        name: "Fitness Tracker",
        status: "pending",
        price: 79.99,
        sales: 9821,
        change: -2.1,
        lastUpdated: Date.now() - 14400000,
      },
      {
        name: "Smart Speaker",
        status: "active",
        price: 199.99,
        sales: 12045,
        change: 15.7,
        lastUpdated: Date.now() - 21600000,
      },
      {
        name: "Tablet Pro",
        status: "discontinued",
        price: 599.99,
        sales: 4532,
        change: -18.4,
        lastUpdated: Date.now() - 86400000,
      },
    ],
  },
};

export default function ToolUITestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tool UI Component Gallery</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Showcase of all 18 @assistant-ui/tool-ui components integrated into the AI elements library.
        </p>
      </div>

      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflow">Workflow (4)</TabsTrigger>
          <TabsTrigger value="social">Social (3)</TabsTrigger>
          <TabsTrigger value="media">Media (5)</TabsTrigger>
          <TabsTrigger value="interaction">Interaction (6)</TabsTrigger>
        </TabsList>

        {/* Workflow Components */}
        <TabsContent value="workflow" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Card</CardTitle>
              <CardDescription>Request approvals with status tracking and metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={approvalCardExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Tracker</CardTitle>
              <CardDescription>Track multi-step processes with status indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={progressTrackerExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats Display</CardTitle>
              <CardDescription>Display metrics with trends and sparklines</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={statsDisplayExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Widget</CardTitle>
              <CardDescription>Show current weather conditions and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={weatherWidgetExample} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Components */}
        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>X (Twitter) Post</CardTitle>
              <CardDescription>Render X/Twitter posts with author, text, media, and engagement stats</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={xPostExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instagram Post</CardTitle>
              <CardDescription>Display Instagram posts with multi-image galleries</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={instagramPostExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Post</CardTitle>
              <CardDescription>Professional posts with author headlines and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={linkedInPostExample} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Components */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Preview</CardTitle>
              <CardDescription>Rich link previews with images and metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={linkPreviewExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video</CardTitle>
              <CardDescription>Video player with poster images and controls</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={videoExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Carousel</CardTitle>
              <CardDescription>Horizontal scrolling carousel for items or products</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={itemCarouselExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>Display multiple images with titles, captions, and sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={imageGalleryExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Table</CardTitle>
              <CardDescription>Structured data table with formatting, sorting, and responsive layout</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={dataTableExample} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interaction Components */}
        <TabsContent value="interaction" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Option List</CardTitle>
              <CardDescription>Selectable options with descriptions and metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={optionListExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question Flow</CardTitle>
              <CardDescription>Step-by-step question flow with multiple choice options</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={questionFlowExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parameter Slider</CardTitle>
              <CardDescription>Adjustable parameter controls with units and steps</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={parameterSliderExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences Panel</CardTitle>
              <CardDescription>Settings panel with switches and grouped sections</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={preferencesPanelExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message Draft</CardTitle>
              <CardDescription>Email/message composition with recipients and subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={messageDraftExample} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Shopping cart summary with items, pricing, and totals</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolUI data={orderSummaryExample} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 border-green-500/50">
        <CardHeader>
          <CardTitle>Component Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>All 18 components working:</strong></p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <p className="font-semibold mb-2">Workflow:</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Approval Card</li>
                  <li>Progress Tracker</li>
                  <li>Stats Display</li>
                  <li>Weather Widget</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Social Media:</p>
                <ul className="list-disc list-inside text-sm">
                  <li>X Post</li>
                  <li>Instagram Post</li>
                  <li>LinkedIn Post</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Media:</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Link Preview</li>
                  <li>Video</li>
                  <li>Item Carousel</li>
                  <li>Image Gallery</li>
                  <li>Data Table</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Interaction:</p>
                <ul className="list-disc list-inside text-sm">
                  <li>Option List</li>
                  <li>Question Flow</li>
                  <li>Parameter Slider</li>
                  <li>Preferences Panel</li>
                  <li>Message Draft</li>
                  <li>Order Summary</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
