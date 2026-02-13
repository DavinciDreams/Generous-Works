"use client";

import { Button } from "@/components/ui/button";
import { Github, MessageCircle, Star, GitFork, Users, Zap } from "lucide-react";

const stats = [
  {
    icon: Star,
    value: "1.2K+",
    label: "GitHub Stars",
    color: "text-[var(--logos-gold)]",
  },
  {
    icon: GitFork,
    value: "114+",
    label: "Components",
    color: "text-[var(--generous-blue)]",
  },
  {
    icon: Zap,
    value: "10K+",
    label: "Generations",
    color: "text-[var(--galaxy-purple)]",
  },
  {
    icon: Users,
    value: "Global",
    label: "Community",
    color: "text-[var(--success)]",
  },
];

export function SocialProof() {
  return (
    <section className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Join the Community
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Developers, researchers, and creators worldwide are building with Generous.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-[var(--generous-blue)]/50 hover:shadow-xl"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/30 opacity-0 transition-opacity hover:opacity-100" />

                <div className="relative">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <Icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* GitHub CTA */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-500/5" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                  <Github className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Star on GitHub</h3>
                  <p className="text-sm text-muted-foreground">Open source and MIT licensed</p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Explore the source code, contribute features, or fork for your own projects. Every star helps us grow.
              </p>

              <a
                href="https://github.com/DavinciDreams/Generous-Works"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                  <Github className="mr-2 h-4 w-4" />
                  Star on GitHub
                  <div className="ml-auto flex items-center gap-1 rounded-full bg-background/20 px-2 py-1 text-xs">
                    <Star className="h-3 w-3" />
                    <span>1.2K</span>
                  </div>
                </Button>
              </a>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--generous-blue)]" />
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--galaxy-purple)]" />
                  <span>React</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--success)]" />
                  <span>Next.js</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discord CTA */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--generous-blue)]/5 to-[var(--galaxy-purple)]/5" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--generous-blue)] to-[var(--galaxy-purple)] text-white">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Join Discord</h3>
                  <p className="text-sm text-muted-foreground">Connect with the community</p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Get help, share creations, and collaborate with developers building the future of generative UI.
              </p>

              <a
                href="https://discord.gg/logosliber"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Discord
                  <div className="ml-auto flex items-center gap-1 rounded-full bg-[var(--success)]/10 text-[var(--success)] px-2 py-1 text-xs">
                    <div className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
                    <span>Online</span>
                  </div>
                </Button>
              </a>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-semibold text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground">Support</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Active</div>
                  <div className="text-xs text-muted-foreground">Community</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Weekly</div>
                  <div className="text-xs text-muted-foreground">Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Used by developers at{" "}
            <span className="font-semibold text-foreground">
              universities, startups, and open source projects
            </span>{" "}
            worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
