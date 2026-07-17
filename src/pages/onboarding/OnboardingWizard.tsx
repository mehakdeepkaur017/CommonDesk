import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { CreateWorkspaceStep } from "./steps/CreateWorkspaceStep";
import { InviteMembersStep } from "./steps/InviteMembersStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { SuccessStep } from "./steps/SuccessStep";

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [workspaceData, setWorkspaceData] = useState<any>({});
  
  const totalSteps = 5;
  const isFinalStep = currentStep === totalSteps;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const skipToJoin = () => console.log("Navigating to Join flow...");

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} onJoin={skipToJoin} />;
      case 2:
        return <CreateWorkspaceStep onNext={nextStep} onBack={prevStep} updateData={setWorkspaceData} data={workspaceData} />;
      case 3:
        return <InviteMembersStep onNext={nextStep} onBack={prevStep} onSkip={nextStep} />;
      case 4:
        return <PreferencesStep onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <SuccessStep workspaceName={workspaceData?.name || "Your Workspace"} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header with Logo and Progress */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-surface-border bg-surface-light/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center shadow-lg">
            <Layers className="w-5 h-5 text-text-primary" />
          </div>
          <span className="text-xl font-bold font-heading text-text-primary hidden sm:block">
            CommonDesk
          </span>
        </div>
        
        {/* Progress Indicator */}
        {!isFinalStep && (
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs font-medium text-text-muted hidden sm:block">
              Step {currentStep} of {totalSteps - 1}
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep >= step ? "bg-brand-indigo w-6" : "bg-surface w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area with Sliding Animations */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-soft-light" />
        
        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-surface-border bg-black/[0.02] dark:bg-background shadow-2xl"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
