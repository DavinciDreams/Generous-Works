"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, BookOpen, Save, FolderOpen, GitBranch, LayoutTemplate, Share2, BarChart3, Lightbulb, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AnimatedWrapper, StaggeredChildren, StaggeredItem } from "./animated-wrapper";
import { OnboardingTour } from "./onboarding-tour";

/**
 * Guide section configuration
 */
interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: GuideStep[];
}

/**
 * Guide step configuration
 */
interface GuideStep {
  title: string;
  description: string;
  tips?: string[];
}

/**
 * Getting started guide sections
 */
const guideSections: GuideSection[] = [
  {
    id: "saving",
    title: "Saving Your Generations",
    description: "Learn how to save your AI-generated components for later use.",
    icon: <Save className="h-5 w-5" />,
    steps: [
      {
        title: "Create a Generation",
        description: "Use the chat interface to generate a component or UI using natural language.",
        tips: [
          "Be specific in your requests",
          "Iterate and refine your generation",
          "Make sure you're happy with the result before saving",
        ],
      },
      {
        title: "Click the Save Button",
        description: "Click the Save button (💾 icon) in the toolbar to open the save dialog.",
        tips: [
          "The save button is located in the main toolbar",
          "You can also use the keyboard shortcut Ctrl+S (Cmd+S on Mac)",
        ],
      },
      {
        title: "Fill in the Details",
        description: "Enter a name and optional description for your generation.",
        tips: [
          "Use a descriptive name that describes what the generation does",
          "Add a description to help you find it later",
          "Include component type in the name (e.g., 'Sales Dashboard - Charts')",
        ],
      },
      {
        title: "Save to Cloud",
        description: "Click the Save button to save your generation to the cloud.",
        tips: [
          "Your generation is now saved and accessible from any device",
          "A new version is created automatically",
          "You can access it from the saved list",
        ],
      },
    ],
  },
  {
    id: "loading",
    title: "Loading Generations",
    description: "Learn how to load and work with your saved generations.",
    icon: <FolderOpen className="h-5 w-5" />,
    steps: [
      {
        title: "Open the Saved List",
        description: "Click the Saved List button (📁 icon) to view all your saved generations.",
        tips: [
          "You can search for generations by name or description",
          "Use the refresh button to reload the list",
        ],
      },
      {
        title: "Select a Generation",
        description: "Click on a generation card to load it into the chat interface.",
        tips: [
          "The generation will be restored to its saved state",
          "You can continue working on it from where you left off",
        ],
      },
      {
        title: "Continue Working",
        description: "Once loaded, you can continue generating, modifying, or saving your work.",
        tips: [
          "All previous messages and components are restored",
          "You can save again to create a new version",
        ],
      },
    ],
  },
  {
    id: "versioning",
    title: "Using Version Control",
    description: "Learn how to track changes and restore previous versions.",
    icon: <GitBranch className="h-5 w-5" />,
    steps: [
      {
        title: "Automatic Versioning",
        description: "Every time you save a generation, a new version is automatically created.",
        tips: [
          "Versions are numbered sequentially (1, 2, 3, etc.)",
          "Each version includes all messages, components, and layouts",
        ],
      },
      {
        title: "View Version History",
        description: "Click the Version History button (📜 icon) to see all versions of a generation.",
        tips: [
          "See when each version was created",
          "View change reasons if provided",
        ],
      },
      {
        title: "Compare Versions",
        description: "Select two versions to compare and see what changed between them.",
        tips: [
          "See added, removed, and modified components",
          "Understand the evolution of your generation",
        ],
      },
      {
        title: "Restore a Version",
        description: "Click the Restore button to roll back to any previous version.",
        tips: [
          "Restoring creates a new version to track the restoration",
          "You can always go back to a more recent version",
        ],
      },
    ],
  },
  {
    id: "templates",
    title: "Using Templates",
    description: "Learn how to create and use templates for faster workflows.",
    icon: <LayoutTemplate className="h-5 w-5" />,
    steps: [
      {
        title: "Browse Templates",
        description: "Click the Templates button (📋 icon) to browse available templates.",
        tips: [
          "Filter by category or search by name",
          "View public templates shared by the community",
        ],
      },
      {
        title: "Use a Template",
        description: "Click on a template to start a new generation from it.",
        tips: [
          "Templates provide a starting point for your work",
          "You can modify and save as your own generation",
        ],
      },
      {
        title: "Create a Template",
        description: "Save any generation as a template for future use.",
        tips: [
          "Give your template a descriptive name",
          "Add categories and tags for easy discovery",
          "Choose whether to share with the community",
        ],
      },
    ],
  },
  {
    id: "sharing",
    title: "Sharing Generations",
    description: "Learn how to share your generations with others.",
    icon: <Share2 className="h-5 w-5" />,
    steps: [
      {
        title: "Create a Share Link",
        description: "Click the Share button (🔗 icon) to create a shareable link.",
        tips: [
          "Choose between read-only or editable access",
          "Set an optional expiration date",
        ],
      },
      {
        title: "Share the Link",
        description: "Copy the generated link and share it with others.",
        tips: [
          "Anyone with the link can access the generation",
          "Share via email, chat, or any messaging platform",
        ],
      },
      {
        title: "Manage Shares",
        description: "View and manage all your active shares from the share dialog.",
        tips: [
          "See how many times each share has been viewed",
          "Delete shares when you no longer need them",
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Viewing Analytics",
    description: "Learn how to track and analyze your generation usage.",
    icon: <BarChart3 className="h-5 w-5" />,
    steps: [
      {
        title: "Open Analytics Dashboard",
        description: "Click the Analytics button (📊 icon) to view your analytics.",
        tips: [
          "See total generations, views, and interactions",
          "View activity charts over time",
        ],
      },
      {
        title: "Component Statistics",
        description: "View detailed statistics for each component type.",
        tips: [
          "See which components are used most frequently",
          "Understand user interaction patterns",
        ],
      },
      {
        title: "Filter Analytics",
        description: "Filter analytics by generation, event type, or date range.",
        tips: [
          "Focus on specific time periods",
          "Analyze particular generations or components",
        ],
      },
    ],
  },
  {
    id: "tips",
    title: "Tips and Best Practices",
    description: "Learn tips and best practices for using Generations Management.",
    icon: <Lightbulb className="h-5 w-5" />,
    steps: [
      {
        title: "Save Early and Often",
        description: "Save your work frequently to avoid losing progress.",
        tips: [
          "Don't wait until you're completely done",
          "Version history lets you go back if needed",
        ],
      },
      {
        title: "Use Descriptive Names",
        description: "Make it easy to find your generations later.",
        tips: [
          "Include component type and purpose",
          "Use consistent naming conventions",
        ],
      },
      {
        title: "Organize with Tags",
        description: "Use tags and categories to organize your generations.",
        tips: [
          "Group related generations together",
          "Make templates discoverable",
        ],
      },
      {
        title: "Review Before Restoring",
        description: "Always compare versions before restoring.",
        tips: [
          "Understand what changed between versions",
          "Make sure you're restoring to the right state",
        ],
      },
    ],
  },
];

/**
 * Getting Started Guide Component
 * Provides a comprehensive guide for new users
 */
interface GettingStartedGuideProps {
  onComplete?: () => void;
  className?: string;
}

export function GettingStartedGuide({ onComplete, className = "" }: GettingStartedGuideProps) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([guideSections[0].id]));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleComplete = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);

    // Check if all sections are completed
    if (newCompleted.size === guideSections.length && onComplete) {
      onComplete();
    }
  };

  const progress = (completedSections.size / guideSections.length) * 100;

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Getting Started with Generations Management</h1>
        <p className="text-muted-foreground mb-4">
          Learn how to save, organize, version, share, and analyze your AI-generated components.
        </p>
        
        {/* Progress */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Your Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSections.size} of {guideSections.length} sections completed
            </span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Guide Sections */}
      <StaggeredChildren>
        {guideSections.map((section) => (
          <StaggeredItem key={section.id}>
            <AnimatedWrapper animationType="fade" className="mb-4">
              <Card>
                <Collapsible
                  open={expandedSections.has(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            completedSections.has(section.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            {section.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{section.title}</CardTitle>
                              {completedSections.has(section.id) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <CardDescription>{section.description}</CardDescription>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            expandedSections.has(section.id) ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4 mt-4">
                        {section.steps.map((step, index) => (
                          <div key={index} className="pl-4 border-l-2 border-muted">
                            <h4 className="font-medium mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            {step.tips && step.tips.length > 0 && (
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {step.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="flex items-start gap-2">
                                    <ChevronRight className="h-3 w-3 mt-1 flex-shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                        
                        {/* Complete Section Button */}
                        <Button
                          variant={completedSections.has(section.id) ? "outline" : "default"}
                          onClick={() => toggleComplete(section.id)}
                          className="w-full"
                        >
                          {completedSections.has(section.id) ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Section Completed
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Complete
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </AnimatedWrapper>
          </StaggeredItem>
        ))}
      </StaggeredChildren>

      {/* Footer */}
      {progress === 100 && (
        <AnimatedWrapper animationType="fade" className="mt-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p className="mb-4">
                  You've completed the Getting Started guide. You're now ready to make the most of Generations Management!
                </p>
                <Button variant="secondary" onClick={onComplete}>
                  Start Using Generations Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedWrapper>
      )}
    </div>
  );
}

/**
 * Quick start card component
 * Shows a quick summary of getting started steps
 */
export function QuickStartCard({ className = "" }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Quick Start
        </CardTitle>
        <CardDescription>
          Get started with Generations Management in 3 easy steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Generate Something</p>
              <p className="text-sm text-muted-foreground">
                Use the chat interface to create a component or UI
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium">Save Your Work</p>
              <p className="text-sm text-muted-foreground">
                Click the Save button to save your generation to the cloud
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium">Share and Collaborate</p>
              <p className="text-sm text-muted-foreground">
                Share your generations with others using shareable links
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
