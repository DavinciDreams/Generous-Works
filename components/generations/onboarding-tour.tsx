"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedWrapper } from "./animated-wrapper";

/**
 * Tour step configuration
 */
export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for target element
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: () => void;
  skipable?: boolean;
}

/**
 * Default tour steps for Generations Management
 */
export const defaultTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Generations Management!",
    description: "Let's take a quick tour of the features available for saving, organizing, and sharing your AI-generated components.",
    position: "center",
    skipable: true,
  },
  {
    id: "save",
    title: "Save Your Generations",
    description: "Click the Save button to save your current generation. You can give it a name and description to help you find it later.",
    target: "[data-tour='save-button']",
    position: "bottom",
  },
  {
    id: "saved-list",
    title: "View Saved Generations",
    description: "Click the Saved List button to browse all your saved generations. You can search, load, share, and delete them from here.",
    target: "[data-tour='saved-list-button']",
    position: "bottom",
  },
  {
    id: "version-history",
    title: "Track Changes with Version History",
    description: "Every save creates a new version. You can view the history, compare versions, and restore previous states anytime.",
    target: "[data-tour='version-history-button']",
    position: "bottom",
  },
  {
    id: "templates",
    title: "Use Templates",
    description: "Templates help you start quickly with pre-configured components. You can also save your own generations as templates.",
    target: "[data-tour='templates-button']",
    position: "bottom",
  },
  {
    id: "share",
    title: "Share Your Work",
    description: "Share your generations with others using shareable links. You can control access and set expiration dates.",
    target: "[data-tour='share-button']",
    position: "bottom",
  },
  {
    id: "analytics",
    title: "View Analytics",
    description: "Track how your generations are used with detailed analytics. See views, interactions, and component usage statistics.",
    target: "[data-tour='analytics-button']",
    position: "bottom",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "You now know the basics of Generations Management. Start creating, saving, and sharing your AI-generated components!",
    position: "center",
    skipable: false,
  },
];

/**
 * Onboarding Tour Component
 * Provides a step-by-step tour of the Generations Management features
 */
interface OnboardingTourProps {
  steps?: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function OnboardingTour({
  steps = defaultTourSteps,
  onComplete,
  onSkip,
  autoStart = true,
  showProgress = true,
  className = "",
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if tour has been completed before
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("generations-tour-completed");
    if (hasCompletedTour) {
      setIsCompleted(true);
      setIsOpen(false);
    }
  }, []);

  const handleNext = () => {
    const step = steps[currentStep];
    if (step.action) {
      step.action();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsOpen(false);
    localStorage.setItem("generations-tour-completed", "true");
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    if (onSkip) {
      onSkip();
    }
  };

  const handleRestart = () => {
    localStorage.removeItem("generations-tour-completed");
    setIsCompleted(false);
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}>
      <AnimatedWrapper animationType="scale" duration={0.2}>
        <Card className="max-w-lg w-full mx-4 shadow-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                {showProgress && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Step {currentStep + 1} of {steps.length}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="flex-shrink-0"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base mb-6">
              {currentStepData.description}
            </CardDescription>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStepData.skipable && !isLastStep && (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip Tour
                  </Button>
                )}
                <Button onClick={handleNext} className="flex items-center gap-2">
                  {isLastStep ? (
                    <>
                      <Check className="h-4 w-4" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedWrapper>
    </div>
  );
}

/**
 * Tour trigger button component
 * Shows a button to restart the tour
 */
interface TourTriggerProps {
  onRestart?: () => void;
  className?: string;
}

export function TourTrigger({ onRestart, className = "" }: TourTriggerProps) {
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("generations-tour-completed");
    if (hasCompletedTour) {
      setShowTrigger(true);
    }
  }, []);

  if (!showTrigger) {
    return null;
  }

  return (
    <AnimatedWrapper animationType="fade" className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          localStorage.removeItem("generations-tour-completed");
          if (onRestart) {
            onRestart();
          } else {
            window.location.reload();
          }
        }}
      >
        <Check className="mr-2 h-4 w-4" />
        Show Tour Again
      </Button>
    </AnimatedWrapper>
  );
}

/**
 * Tooltip component for tour highlights
 * Highlights specific elements during the tour
 */
interface TourHighlightProps {
  target: string;
  isActive: boolean;
  children: React.ReactNode;
}

export function TourHighlight({ target, isActive, children }: TourHighlightProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const targetElement = document.querySelector(target) as HTMLElement;
    setElement(targetElement);
  }, [target]);

  if (!isActive || !element) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 ring-4 ring-primary ring-offset-2 rounded-lg animate-pulse" />
      </div>
      {children}
    </div>
  );
}
