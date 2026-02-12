import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-4xl space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Generous
            </h1>
            <p className="text-xl text-muted-foreground sm:text-2xl lg:text-3xl">
              The Universal Canvas for AI
            </p>
          </div>

          {/* Value Proposition */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Ask for anything. Watch it render live as interactive components.
            Charts, 3D scenes, maps, timelines, code editors — 114+ components at your command.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/canvas">
                <Button size="lg" className="text-lg px-8 py-6">
                  Open Canvas
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🎨"
              title="Generative UI"
              description="Streaming AI-powered components that render as you type"
            />
            <FeatureCard
              icon="📊"
              title="Data Visualization"
              description="Charts, graphs, maps, and timelines — all interactive"
            />
            <FeatureCard
              icon="🎮"
              title="3D & Games"
              description="Three.js scenes, Phaser games, VRM avatars, and more"
            />
            <FeatureCard
              icon="💻"
              title="Code Editors"
              description="Syntax highlighting, multiple languages, live preview"
            />
            <FeatureCard
              icon="🗺️"
              title="Maps & Geo"
              description="Geospatial visualization with Mapbox, Leaflet, Deck.gl"
            />
            <FeatureCard
              icon="⚡"
              title="114+ Components"
              description="The most comprehensive generative UI library"
            />
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">114+</span>
              <span>Components</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">∞</span>
              <span>Possibilities</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">100%</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, React, Tailwind CSS, and the Vercel AI SDK.
          </p>
          <p className="mt-2">
            By{" "}
            <a
              href="https://github.com/DavinciDreams/Generous-Works"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Logos Liber
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center space-y-2 rounded-xl border border-border bg-card p-6 text-center transition-colors hover:bg-accent">
      <div className="text-4xl">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
