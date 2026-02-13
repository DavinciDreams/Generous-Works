"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Box,
  Map,
  Clock,
  Code2,
  Gamepad2,
  Table,
  FileText,
  ArrowRight
} from "lucide-react";

const components = [
  {
    icon: BarChart3,
    name: "Charts & Graphs",
    description: "18 chart types with Recharts, Chart.js, Plotly",
    color: "from-blue-500 to-cyan-500",
    examples: "Bar, Line, Pie, Scatter, Heatmap"
  },
  {
    icon: Box,
    name: "3D Graphics",
    description: "Three.js scenes, VRM avatars, 3D visualizations",
    color: "from-purple-500 to-pink-500",
    examples: "Scenes, Models, Animations"
  },
  {
    icon: Map,
    name: "Maps & Geo",
    description: "Mapbox, Leaflet, Deck.gl geospatial viz",
    color: "from-green-500 to-emerald-500",
    examples: "Interactive Maps, Heatmaps"
  },
  {
    icon: Clock,
    name: "Timelines",
    description: "Vertical and horizontal timeline components",
    color: "from-orange-500 to-amber-500",
    examples: "Event Timelines, Gantt Charts"
  },
  {
    icon: Code2,
    name: "Code Editors",
    description: "Monaco, CodeMirror with syntax highlighting",
    color: "from-slate-500 to-gray-500",
    examples: "Multi-language Support"
  },
  {
    icon: Gamepad2,
    name: "Games & Interactive",
    description: "Phaser games, interactive experiences",
    color: "from-rose-500 to-red-500",
    examples: "2D Games, Simulations"
  },
  {
    icon: Table,
    name: "Data Tables",
    description: "TanStack Table with sorting, filtering",
    color: "from-indigo-500 to-blue-500",
    examples: "Sortable, Filterable Tables"
  },
  {
    icon: FileText,
    name: "Forms & Input",
    description: "React Hook Form, validation, file uploads",
    color: "from-teal-500 to-cyan-500",
    examples: "Dynamic Forms, Validation"
  },
];

export function ComponentShowcase() {
  return (
    <section id="components" className="relative px-4 py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-[var(--galaxy-purple)] opacity-10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            114+ Components.
            <br />
            <span className="bg-gradient-to-r from-[var(--generous-blue)] to-[var(--galaxy-purple)] bg-clip-text text-transparent">
              Infinite Possibilities.
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            From simple buttons to complex 3D scenes. Every component streams in real-time
            and is fully interactive from the moment it appears.
          </p>
        </div>

        {/* Component Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {components.map((component) => {
            const Icon = component.icon;
            return (
              <div
                key={component.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-[var(--generous-blue)]/50 hover:shadow-xl hover:shadow-[var(--generous-blue)]/10"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${component.color} opacity-0 transition-opacity group-hover:opacity-5`} />

                {/* Content */}
                <div className="relative space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${component.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{component.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {component.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {component.examples.split(", ").map((example) => (
                        <span
                          key={example}
                          className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Component Categories */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-center">
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="text-2xl font-bold text-[var(--generous-blue)]">18+</div>
            <div className="text-sm text-muted-foreground">Chart Types</div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="text-2xl font-bold text-[var(--galaxy-purple)]">15+</div>
            <div className="text-sm text-muted-foreground">UI Components</div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="text-2xl font-bold text-[var(--logos-gold)]">10+</div>
            <div className="text-sm text-muted-foreground">Data Viz Types</div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="text-2xl font-bold text-[var(--success)]">∞</div>
            <div className="text-sm text-muted-foreground">Combinations</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/docs">
            <Button
              size="lg"
              variant="outline"
              className="group text-base px-6 py-6"
            >
              Explore All Components
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
