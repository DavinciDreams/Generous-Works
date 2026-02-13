"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-[var(--generous-blue)] opacity-20 blur-[120px]" />
        </div>
      </div>

      <div className="max-w-5xl space-y-8">
        {/* Main Headline */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[var(--generous-blue)]" />
            <span className="text-muted-foreground">
              114+ components • Real-time streaming • Open source
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Ask for anything.
          </h1>

          <p className="text-2xl text-muted-foreground sm:text-3xl lg:text-4xl font-light">
            The Universal Canvas for AI
          </p>
        </div>

        {/* Value Proposition */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
          Describe what you need — a chart, dashboard, 3D scene, game, or timeline —
          and watch it render live as interactive components. No templates. No workflows.
          Just ask.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="group text-lg px-8 py-6 bg-[var(--generous-blue)] hover:bg-[var(--generous-blue)]/90"
              >
                Try Generous
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/canvas">
              <Button
                size="lg"
                className="group text-lg px-8 py-6 bg-[var(--generous-blue)] hover:bg-[var(--generous-blue)]/90"
              >
                Open Canvas
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </SignedIn>

          <Link href="#components">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              View Components
            </Button>
          </Link>
        </div>

        {/* Demo Video/Animation Placeholder */}
        <div className="mt-12">
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm shadow-2xl">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center overflow-hidden">
                {/* Placeholder for animated demo - will be replaced with actual GIF/video */}
                <div className="text-center space-y-4 p-8">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-[var(--generous-blue)] animate-pulse" />
                    <span className="text-sm">Streaming UI in real-time</span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 w-64 rounded bg-muted/50 animate-pulse" />
                    <div className="h-3 w-48 rounded bg-muted/50 animate-pulse delay-75" />
                    <div className="h-3 w-56 rounded bg-muted/50 animate-pulse delay-150" />
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    Interactive demo coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-[var(--logos-gold)] opacity-20 blur-3xl" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[var(--galaxy-purple)] opacity-20 blur-3xl" />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm">
          <a
            href="https://github.com/DavinciDreams/Generous-Works"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="font-semibold text-foreground">1.2K</span>
            <span>stars</span>
          </a>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">114+</span>
            <span>components</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">100%</span>
            <span>open source</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">Free</span>
            <span>forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}
