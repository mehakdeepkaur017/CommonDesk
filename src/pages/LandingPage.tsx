import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { HeroSection } from "../components/sections/HeroSection";
import { TrustedBy } from "../components/sections/TrustedBy";
import { ProblemSolution } from "../components/sections/ProblemSolution";
import { BentoGrid } from "../components/sections/BentoGrid";
import { WorkspaceShowcase } from "../components/sections/WorkspaceShowcase";
import { MultiTenantArchitecture } from "../components/sections/MultiTenantArchitecture";
import { FeatureTimeline } from "../components/sections/FeatureTimeline";
import { SecuritySection } from "../components/sections/SecuritySection";
import { FAQ } from "../components/sections/FAQ";
import { FinalCTA } from "../components/sections/FinalCTA";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface text-text-primary selection:bg-brand-indigo/30 selection:text-text-primary flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <TrustedBy />
        <ProblemSolution />
        <BentoGrid />
        <WorkspaceShowcase />
        <MultiTenantArchitecture />
        <FeatureTimeline />
        <SecuritySection />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};
