"use client";

import { Button } from "@/components/ui/button";
import { Heart, Shield, Globe, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Gift,
    title: "No Ads, No Tracking",
    description: "No dark patterns, no data mining. We respect you and your privacy.",
  },
  {
    icon: Shield,
    title: "Fully Open Source",
    description: "MIT licensed. Fork it, extend it, or integrate it into your own projects.",
  },
  {
    icon: Globe,
    title: "Logos Liber Ecosystem",
    description: "Part of a family of open tools for collective intelligence and knowledge work.",
  },
  {
    icon: Heart,
    title: "Donation-Supported",
    description: "Sustained by community contributions, not VC funding or extraction.",
  },
];

export function Mission() {
  return (
    <section className="relative px-4 py-24 sm:py-32 bg-gradient-to-b from-background to-[var(--bg-secondary)]">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-[var(--generous-blue)] opacity-10 blur-[120px]" />
        <div className="absolute right-0 bottom-1/3 h-96 w-96 rounded-full bg-[var(--logos-gold)] opacity-10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm mb-6">
            <Heart className="h-4 w-4 text-[var(--error)]" />
            <span className="text-muted-foreground">
              Built by a nonprofit, for everyone
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Open Source.
            <br />
            <span className="bg-gradient-to-r from-[var(--generous-blue)] to-[var(--logos-gold)] bg-clip-text text-transparent">
              Nonprofit-Backed.
            </span>
          </h2>

          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Generous is supported by the{" "}
            <a
              href="https://decentralizedintelligence.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-[var(--generous-blue)] transition-colors"
            >
              Decentralized Intelligence Agency
            </a>{" "}
            (DIA), a 501(c)(3) nonprofit building AI infrastructure that belongs to everyone.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-[var(--generous-blue)]/50 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--generous-blue)]/20 to-[var(--galaxy-purple)]/20">
                  <Icon className="h-7 w-7 text-[var(--generous-blue)]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mission Statement */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--generous-blue)]/5 via-transparent to-[var(--galaxy-purple)]/5" />

          <div className="relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left: Mission Text */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Impact That Lasts
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Unlike VC-backed startups that extract value from users, Generous is sustained by donations and operated by a nonprofit.
                  </p>
                  <p>
                    This means our incentives align with yours: building genuinely useful, free tools that belong to everyone.
                  </p>
                  <p className="font-medium text-foreground">
                    Open source ensures our work outlasts any single organization or company.
                  </p>
                </div>
              </div>

              {/* Right: CTAs */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 space-y-4">
                  <h4 className="font-semibold">Support Our Mission</h4>
                  <p className="text-sm text-muted-foreground">
                    Every dollar supports free, open tools that belong to everyone. DIA is a registered 501(c)(3) nonprofit.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="https://decentralizedintelligence.agency/donate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-[var(--generous-blue)] hover:bg-[var(--generous-blue)]/90">
                        <Heart className="mr-2 h-4 w-4" />
                        Donate
                      </Button>
                    </a>
                    <a
                      href="https://decentralizedintelligence.agency"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 space-y-4">
                  <h4 className="font-semibold">Join the Ecosystem</h4>
                  <p className="text-sm text-muted-foreground">
                    Generous is part of Logos Liber, a collection of open tools for knowledge work and collective intelligence.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <a
                      href="https://github.com/LogosLiber"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">Galaxy Brain</div>
                      <div className="text-xs text-muted-foreground">Knowledge Mgmt</div>
                    </a>
                    <a
                      href="https://github.com/LogosLiber"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">Agents of Empire</div>
                      <div className="text-xs text-muted-foreground">Agent Orchestration</div>
                    </a>
                  </div>
                  <Link href="/ecosystem">
                    <Button variant="ghost" size="sm" className="w-full group">
                      View Full Ecosystem
                      <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
