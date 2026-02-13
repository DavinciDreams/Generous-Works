import { Hero } from "@/app/components/landing/Hero";
import { ComponentShowcase } from "@/app/components/landing/ComponentShowcase";
import { HowItWorks } from "@/app/components/landing/HowItWorks";
import { ComparisonTable } from "@/app/components/landing/ComparisonTable";
import { Mission } from "@/app/components/landing/Mission";
import { SocialProof } from "@/app/components/landing/SocialProof";
import { Footer } from "@/app/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <ComponentShowcase />
      <HowItWorks />
      <ComparisonTable />
      <Mission />
      <SocialProof />
      <Footer />
    </main>
  );
}
