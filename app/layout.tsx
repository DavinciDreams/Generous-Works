import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Generous — The Universal Canvas for AI",
    template: "%s | Generous",
  },
  description:
    "Ask for anything. Generous is a streaming generative UI platform that renders live, interactive components from natural language. 114+ components: charts, 3D, maps, editors, games, and more.",
  keywords: [
    "generative UI",
    "streaming UI",
    "AI interface",
    "universal canvas",
    "generative interface",
    "AI components",
    "data visualization",
    "3D rendering",
    "interactive maps",
    "code editor",
    "AI chat interface",
    "open source",
    "Next.js",
    "React",
    "Vercel AI SDK",
    "A2UI",
    "Logos Liber",
    "collective intelligence",
  ],
  authors: [{ name: "Decentralized Intelligence Agency" }],
  creator: "Decentralized Intelligence Agency",
  publisher: "Logos Liber",
  metadataBase: new URL("https://generous.works"),
  alternates: {
    canonical: "https://generous.works",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://generous.works",
    siteName: "Generous",
    title: "Generous — Ask for anything.",
    description:
      "The universal canvas for AI. Describe what you need — a chart, dashboard, 3D scene, game, timeline — and watch it render live as interactive components.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Generous — The Universal Canvas for AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generous — Ask for anything.",
    description:
      "The universal canvas for AI. Streaming generative UI with 114+ components. Open source.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
