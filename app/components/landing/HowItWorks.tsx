"use client";

import { MessageSquare, Zap, MousePointerClick, ChevronDown } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Type What You Need",
    description: "Describe your vision in plain language. No code, no templates, no complex workflows.",
    example: '"Show me a bar chart of sales data"',
    color: "from-[var(--generous-blue)] to-cyan-500",
  },
  {
    number: "02",
    icon: Zap,
    title: "Watch It Stream",
    description: "Components build in real-time as the AI generates them. See every element appear live.",
    example: "React components stream token by token",
    color: "from-[var(--galaxy-purple)] to-pink-500",
  },
  {
    number: "03",
    icon: MousePointerClick,
    title: "Interact Immediately",
    description: "No waiting, no compile time. Components are live and interactive from the moment they finish.",
    example: "Click, hover, filter, and explore",
    color: "from-[var(--logos-gold)] to-orange-500",
  },
];

export function HowItWorks() {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <section className="relative px-4 py-24 sm:py-32 bg-gradient-to-b from-background to-[var(--bg-secondary)]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How Generous Works
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            From thought to interactive component in seconds. No templates, no workflows — just ask.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-border via-[var(--generous-blue)]/50 to-border lg:block" />

          <div className="space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col lg:flex-row lg:items-center gap-8 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? "lg:text-right" : ""}`}>
                    <div className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm mb-4`}>
                      <span className="font-mono text-muted-foreground">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold sm:text-3xl mb-4">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground text-lg mb-4 max-w-md">
                      {step.description}
                    </p>

                    <div className={`inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 font-mono text-sm`}>
                      <span className="text-[var(--generous-blue)]">&gt;</span>
                      <span className="text-muted-foreground">{step.example}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative flex items-center justify-center">
                    <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>

                    {/* Glow effect */}
                    <div className={`absolute h-32 w-32 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-2xl`} />
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Details Toggle */}
        <div className="mt-16">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="mx-auto flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <span>Technical Details</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showTechnical ? "rotate-180" : ""
              }`}
            />
          </button>

          {showTechnical && (
            <div className="mt-6 mx-auto max-w-3xl rounded-xl border border-border bg-card p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--generous-blue)]" />
                  Built with Modern Stack
                </h4>
                <p className="text-sm text-muted-foreground">
                  Next.js 16 App Router, React 19 Server Components, TypeScript, Tailwind CSS, Vercel AI SDK
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--galaxy-purple)]" />
                  Dual Rendering Engine
                </h4>
                <p className="text-sm text-muted-foreground">
                  Simple components use JSX for maximum flexibility. Complex data-driven components use A2UI JSON format for precision.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--logos-gold)]" />
                  Real-time Streaming
                </h4>
                <p className="text-sm text-muted-foreground">
                  Components stream token-by-token as the AI generates them. No waiting for complete generation — see it build live.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href="https://github.com/DavinciDreams/Generous-Works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--generous-blue)] hover:underline"
                >
                  View full architecture on GitHub →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
