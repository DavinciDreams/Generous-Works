"use client";

import { ApprovalCard } from "@/components/ai-elements/approval-card";
import { WeatherWidget } from "@/components/ai-elements/weather-widget";
import { StatsDisplay } from "@/components/ai-elements/stats-display";
import { ProgressTracker } from "@/components/ai-elements/progress-tracker";
import { OptionList } from "@/components/ai-elements/option-list";
import { InstagramPost } from "@/components/ai-elements/instagram-post";
import { LinkedInPost } from "@/components/ai-elements/linkedin-post";
import { XPost } from "@/components/ai-elements/x-post";
import { LinkPreview } from "@/components/ai-elements/link-preview";
import { Video } from "@/components/ai-elements/video";
import { MessageDraft } from "@/components/ai-elements/message-draft";
import { ItemCarousel } from "@/components/ai-elements/item-carousel";
import { OrderSummary } from "@/components/ai-elements/order-summary";
import { ParameterSlider } from "@/components/ai-elements/parameter-slider";
import { PreferencesPanel } from "@/components/ai-elements/preferences-panel";
import { QuestionFlow } from "@/components/ai-elements/question-flow";

export default function ToolUIShowcasePage() {
  return (
    <div className="container mx-auto p-8 space-y-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tool-UI Component Showcase</h1>
        <p className="text-muted-foreground text-lg">
          Demonstrating all 16 integrated tool-ui components with A2UI wrappers
        </p>
      </div>

      {/* Approval Card */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Approval Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ApprovalCard
            data={{
              title: "Deploy to Production",
              description: "Deploy version 2.5.0 to production environment",
              status: "pending",
              requester: {
                name: "Sarah Chen",
                email: "sarah@company.com",
                avatar: "https://i.pravatar.cc/150?u=sarah",
              },
              timestamp: Date.now() - 3600000,
              metadata: [
                { label: "Environment", value: "Production" },
                { label: "Version", value: "2.5.0" },
              ],
            }}
          />
          <ApprovalCard
            data={{
              title: "Budget Increase Request",
              description: "Increase Q4 marketing budget by $50,000",
              status: "approved",
              requester: {
                name: "Michael Brown",
                email: "michael@company.com",
              },
              timestamp: Date.now() - 86400000,
            }}
          />
        </div>
      </section>

      {/* Weather Widget */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Weather Widget</h2>
        <WeatherWidget
          data={{
            temperature: 72,
            unit: "fahrenheit",
            condition: "partly-cloudy",
            location: "San Francisco, CA",
            humidity: 65,
            windSpeed: 12,
            windDirection: "NW",
            precipitation: 20,
            uvIndex: 6,
            high: 78,
            low: 58,
            sunrise: "6:45 AM",
            sunset: "7:30 PM",
            forecast: [
              { day: "Mon", condition: "sunny", high: 80, low: 60 },
              { day: "Tue", condition: "cloudy", high: 75, low: 58 },
              { day: "Wed", condition: "rainy", high: 68, low: 55 },
            ],
          }}
          options={{ showForecast: true, showDetails: true }}
        />
      </section>

      {/* Stats Display */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Stats Display</h2>
        <StatsDisplay
          data={{
            title: "Business Metrics",
            stats: [
              {
                label: "Revenue",
                value: "$127,450",
                change: 12.5,
                changePeriod: "vs last month",
                trend: "up",
                sparkline: [45000, 52000, 48000, 61000, 58000, 67000, 72450],
              },
              {
                label: "Active Users",
                value: "8,234",
                change: 5.2,
                trend: "up",
                sparkline: [7200, 7400, 7800, 8100, 8000, 8150, 8234],
              },
              {
                label: "Conversion Rate",
                value: "3.24%",
                change: -0.8,
                trend: "down",
                sparkline: [3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.24],
              },
            ],
          }}
          options={{ layout: "grid", columns: 3, showSparklines: true }}
        />
      </section>

      {/* Progress Tracker */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Progress Tracker</h2>
        <ProgressTracker
          data={{
            title: "Project Deployment",
            steps: [
              {
                id: "1",
                title: "Code Review",
                description: "Review all changes and approve",
                status: "completed",
                timestamp: Date.now() - 7200000,
              },
              {
                id: "2",
                title: "Run Tests",
                description: "Execute full test suite",
                status: "completed",
                timestamp: Date.now() - 3600000,
              },
              {
                id: "3",
                title: "Build & Package",
                description: "Create deployment artifacts",
                status: "in-progress",
              },
              {
                id: "4",
                title: "Deploy",
                description: "Deploy to production",
                status: "pending",
              },
            ],
            currentStep: 2,
            status: "in-progress",
          }}
          options={{ orientation: "vertical", showNumbers: true }}
        />
      </section>

      {/* Option List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Option List</h2>
        <OptionList
          data={{
            title: "Select Your Plan",
            description: "Choose the subscription plan that works for you",
            options: [
              {
                id: "starter",
                label: "Starter",
                description: "Perfect for individuals and small projects",
                value: 9.99,
                metadata: { features: ["5 projects", "10GB storage", "Email support"] },
              },
              {
                id: "pro",
                label: "Pro",
                description: "For growing teams and businesses",
                value: 29.99,
                selected: true,
                metadata: { features: ["Unlimited projects", "100GB storage", "Priority support"] },
              },
              {
                id: "enterprise",
                label: "Enterprise",
                description: "Custom solutions for large organizations",
                value: 99.99,
                metadata: { features: ["Everything in Pro", "Custom integrations", "Dedicated support"] },
              },
            ],
          }}
          options={{ layout: "cards", searchable: false }}
        />
      </section>

      {/* Social Media Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Social Media Posts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InstagramPost
            data={{
              author: {
                username: "techstartup",
                displayName: "Tech Startup Inc",
                avatar: "https://i.pravatar.cc/150?u=techstartup",
                verified: true,
              },
              caption: "Excited to announce our new AI-powered features! 🚀 #AI #Innovation #TechStartup",
              images: ["https://picsum.photos/600/600?random=1"],
              likes: 1234,
              comments: 89,
              timestamp: Date.now() - 7200000,
              location: "San Francisco, CA",
              hashtags: ["AI", "Innovation", "TechStartup"],
            }}
          />
          <LinkedInPost
            data={{
              id: "1",
              author: {
                name: "Jane Smith",
                headline: "VP of Engineering at TechCorp",
                avatarUrl: "https://i.pravatar.cc/150?u=janesmith",
              },
              text: "Thrilled to share that our team just launched the new AI features! Big thanks to everyone involved.",
              stats: { likes: 456, isLiked: false },
              createdAt: Date.now() - 14400000,
            }}
          />
          <XPost
            data={{
              id: "1",
              author: {
                name: "Tech News",
                handle: "@technews",
                avatarUrl: "https://i.pravatar.cc/150?u=technews",
                verified: true,
              },
              text: "Breaking: New AI breakthrough enables real-time language translation with 99% accuracy 🎯",
              stats: { likes: 8932, isLiked: true },
              createdAt: Date.now() - 28800000,
            }}
          />
        </div>
      </section>

      {/* Link Preview & Video */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Link Preview & Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LinkPreview
            data={{
              id: "1",
              href: "https://example.com/article",
              title: "The Future of AI: What to Expect in 2024",
              description: "Exploring the latest trends and predictions in artificial intelligence and machine learning.",
              image: "https://picsum.photos/800/400?random=2",
              domain: "example.com",
            }}
            options={{ ratio: "16:9" }}
          />
          <Video
            data={{
              id: "1",
              assetId: "demo-video",
              src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              poster: "https://picsum.photos/800/450?random=3",
              title: "Product Demo",
              durationMs: 120000,
            }}
            options={{ ratio: "16:9" }}
          />
        </div>
      </section>

      {/* Message Draft */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Message Draft</h2>
        <MessageDraft
          data={{
            id: "1",
            channel: "email",
            to: ["john@example.com"],
            subject: "Project Update - Q4 2024",
            body: "Hi team,\n\nI wanted to share a quick update on our Q4 progress...",
          }}
        />
      </section>

      {/* Item Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Item Carousel</h2>
        <ItemCarousel
          data={{
            id: "1",
            items: [
              { id: "1", name: "Product A", image: "https://picsum.photos/300/300?random=4", subtitle: "$29.99" },
              { id: "2", name: "Product B", image: "https://picsum.photos/300/300?random=5", subtitle: "$39.99" },
              { id: "3", name: "Product C", image: "https://picsum.photos/300/300?random=6", subtitle: "$49.99" },
              { id: "4", name: "Product D", image: "https://picsum.photos/300/300?random=7", subtitle: "$59.99" },
            ],
          }}
        />
      </section>

      {/* Order Summary */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="max-w-md">
          <OrderSummary
            data={{
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
            }}
          />
        </div>
      </section>

      {/* Parameter Slider */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Parameter Slider</h2>
        <ParameterSlider
          data={{
            id: "1",
            sliders: [
              { id: "opacity", label: "Opacity", min: 0, max: 1, step: 0.1, value: 0.8, unit: "" },
              { id: "size", label: "Size", min: 10, max: 100, step: 5, value: 50, unit: "px" },
              { id: "rotation", label: "Rotation", min: 0, max: 360, step: 15, value: 90, unit: "°" },
            ],
          }}
        />
      </section>

      {/* Preferences Panel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Preferences Panel</h2>
        <PreferencesPanel
          data={{
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
          }}
        />
      </section>

      {/* Question Flow */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Question Flow</h2>
        <QuestionFlow
          data={{
            id: "1",
            step: 1,
            title: "What's your primary goal?",
            description: "This helps us personalize your experience",
            options: [
              { id: "growth", label: "Business Growth", description: "Scale and expand operations" },
              { id: "efficiency", label: "Efficiency", description: "Optimize current processes" },
              { id: "innovation", label: "Innovation", description: "Develop new products/services" },
            ],
          }}
        />
      </section>
    </div>
  );
}
