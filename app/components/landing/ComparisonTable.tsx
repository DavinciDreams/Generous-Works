"use client";

import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Live Component Rendering",
    generous: true,
    v0: false,
    bolt: false,
    description: "Components render in real-time as they're generated"
  },
  {
    name: "Component Library Size",
    generous: "114+",
    v0: "Limited",
    bolt: "N/A",
    description: "Pre-built specialized components ready to use"
  },
  {
    name: "Real-time Streaming",
    generous: true,
    v0: false,
    bolt: false,
    description: "Watch components build token by token"
  },
  {
    name: "Data Visualization",
    generous: "18 types",
    v0: "Basic",
    bolt: "Limited",
    description: "Charts, 3D, maps, timelines, and more"
  },
  {
    name: "Open Source",
    generous: true,
    v0: false,
    bolt: true,
    description: "Full source code available, MIT licensed"
  },
  {
    name: "Nonprofit Backing",
    generous: true,
    v0: false,
    bolt: false,
    description: "501(c)(3) nonprofit, no VC extraction"
  },
  {
    name: "3D Graphics Support",
    generous: true,
    v0: false,
    bolt: "Limited",
    description: "Three.js scenes, VRM avatars, WebGL"
  },
  {
    name: "Approach",
    generous: "Render live",
    v0: "Generate code",
    bolt: "Full-stack code",
    description: "How the platform generates interfaces"
  },
];

const FeatureValue = ({ value }: { value: boolean | string }) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-[var(--success)]" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50" />
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

export function ComparisonTable() {
  return (
    <section className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Why Generous?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Unlike v0.dev and Bolt.new which generate code, Generous generates{" "}
            <span className="font-semibold text-foreground">and renders</span> live
            interactive components in real-time.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/50 p-6">
            <div className="text-sm font-semibold text-muted-foreground">
              Feature
            </div>
            <div className="text-center">
              <div className="font-bold text-lg mb-1 text-[var(--generous-blue)]">
                Generous
              </div>
              <div className="text-xs text-muted-foreground">This project</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg mb-1">v0.dev</div>
              <div className="text-xs text-muted-foreground">Vercel</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg mb-1">Bolt.new</div>
              <div className="text-xs text-muted-foreground">StackBlitz</div>
            </div>
          </div>

          {/* Features */}
          <div className="divide-y divide-border">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="grid grid-cols-4 gap-4 p-6 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex flex-col justify-center">
                  <div className="font-medium text-sm">{feature.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <FeatureValue value={feature.generous} />
                </div>
                <div className="flex items-center justify-center">
                  <FeatureValue value={feature.v0} />
                </div>
                <div className="flex items-center justify-center">
                  <FeatureValue value={feature.bolt} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="border-t border-border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want the full comparison?
            </p>
            <Link href="/docs/comparison">
              <Button variant="outline" size="sm" className="group">
                Read Detailed Comparison
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Differentiator Callout */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-2xl border border-[var(--generous-blue)]/30 bg-gradient-to-br from-[var(--generous-blue)]/5 to-[var(--galaxy-purple)]/5 p-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--generous-blue)]/10 px-4 py-2 text-sm font-medium text-[var(--generous-blue)] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--generous-blue)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--generous-blue)]"></span>
              </span>
              Core Differentiator
            </div>
            <p className="text-lg font-medium">
              Generous is the only platform that{" "}
              <span className="text-[var(--generous-blue)] font-bold">
                generates AND renders
              </span>{" "}
              live interactive components in real-time. Fork it, extend it, or integrate it — fully open source.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
