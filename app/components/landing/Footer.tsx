"use client";

import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Documentation", href: "/docs" },
    { name: "Components", href: "/docs#components" },
    { name: "GitHub", href: "https://github.com/DavinciDreams/Generous-Works" },
    { name: "Roadmap", href: "/roadmap" },
  ],
  ecosystem: [
    { name: "Logos Liber", href: "https://github.com/LogosLiber" },
    { name: "Galaxy Brain", href: "https://github.com/LogosLiber/galaxy-brain" },
    { name: "Agents of Empire", href: "https://github.com/LogosLiber/agents-of-empire" },
    { name: "Monumental Systems", href: "https://github.com/LogosLiber/monumental" },
  ],
  nonprofit: [
    { name: "About DIA", href: "https://decentralizedintelligence.agency" },
    { name: "Our Mission", href: "https://decentralizedintelligence.agency/mission" },
    { name: "Donate", href: "https://decentralizedintelligence.agency/donate" },
    { name: "Contact", href: "https://decentralizedintelligence.agency/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "License (MIT)", href: "https://github.com/DavinciDreams/Generous-Works/blob/main/LICENSE" },
    { name: "Code of Conduct", href: "/code-of-conduct" },
  ],
};

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/DavinciDreams/Generous-Works",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/LogosLiber",
    icon: Twitter,
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--generous-blue)] to-[var(--galaxy-purple)] text-white font-bold">
                G
              </div>
              <span className="text-xl font-bold">Generous</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              The universal canvas for AI. Streaming generative UI with 114+ components.
              Built with Next.js, React, and TypeScript.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Part of{" "}
              <a
                href="https://github.com/LogosLiber"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-[var(--logos-gold)] transition-colors"
              >
                Logos Liber
              </a>
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:border-[var(--generous-blue)] hover:text-[var(--generous-blue)]"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Ecosystem</h3>
            <ul className="space-y-3">
              {footerLinks.ecosystem.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Nonprofit</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.nonprofit.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-border" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Decentralized Intelligence Agency.
              Open source under{" "}
              <a
                href="https://github.com/DavinciDreams/Generous-Works/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                MIT License
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-[var(--error)]" />
            <span>by</span>
            <a
              href="https://decentralizedintelligence.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-[var(--generous-blue)] transition-colors"
            >
              DIA
            </a>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              501(c)(3) Nonprofit
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Built with:</span>
            <span className="rounded-md bg-muted px-2 py-1">Next.js 16</span>
            <span className="rounded-md bg-muted px-2 py-1">React 19</span>
            <span className="rounded-md bg-muted px-2 py-1">TypeScript</span>
            <span className="rounded-md bg-muted px-2 py-1">Tailwind CSS</span>
            <span className="rounded-md bg-muted px-2 py-1">Vercel AI SDK</span>
            <span className="rounded-md bg-muted px-2 py-1">shadcn/ui</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
