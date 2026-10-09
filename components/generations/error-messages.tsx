"use client";

import { AlertCircle, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AnimatedWrapper } from "./animated-wrapper";

/**
 * Error types with associated icons and colors
 */
export type ErrorType = "error" | "warning" | "info" | "success";

/**
 * Error configuration mapping
 */
const errorConfig = {
  error: {
    icon: XCircle,
    variant: "destructive" as const,
    title: "Error",
  },
  warning: {
    icon: AlertTriangle,
    variant: "default" as const,
    title: "Warning",
  },
  info: {
    icon: Info,
    variant: "default" as const,
    title: "Information",
  },
  success: {
    icon: CheckCircle,
    variant: "default" as const,
    title: "Success",
  },
};

/**
 * Error message component with helpful suggestions
 * Provides user-friendly error messages with actionable suggestions
 */
interface ErrorMessageProps {
  type?: ErrorType;
  title?: string;
  message: string;
  suggestions?: string[];
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorMessage({
  type = "error",
  title,
  message,
  suggestions = [],
  onRetry,
  onDismiss,
  showRetry = false,
  className = "",
}: ErrorMessageProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <AnimatedWrapper animationType="slide" className={className}>
      <Alert variant={config.variant} className="relative">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription className="mt-1">{message}</AlertDescription>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium">Suggestions:</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {(showRetry || onRetry) && (
              <div className="mt-3 flex gap-2">
                {showRetry && onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="h-8"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Retry
                  </Button>
                )}
                {onDismiss && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="h-8"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Dismiss button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </Alert>
    </AnimatedWrapper>
  );
}

/**
 * Common error messages with helpful suggestions
 */
export const ErrorMessages = {
  /**
   * Network error - no internet connection
   */
  networkError: {
    type: "error" as ErrorType,
    title: "Network Error",
    message: "Unable to connect to the server. Please check your internet connection.",
    suggestions: [
      "Check your internet connection",
      "Try refreshing the page",
      "Check if the service is down",
    ],
  },

  /**
   * Unauthorized error - not logged in
   */
  unauthorizedError: {
    type: "error" as ErrorType,
    title: "Authentication Required",
    message: "You need to be logged in to perform this action.",
    suggestions: [
      "Sign in to your account",
      "Check if your session has expired",
      "Try logging out and back in",
    ],
  },

  /**
   * Not found error - resource doesn't exist
   */
  notFoundError: {
    type: "error" as ErrorType,
    title: "Not Found",
    message: "The requested resource could not be found.",
    suggestions: [
      "Check if the URL is correct",
      "The resource may have been deleted",
      "Try searching for it",
    ],
  },

  /**
   * Validation error - invalid input
   */
  validationError: {
    type: "warning" as ErrorType,
    title: "Validation Error",
    message: "Please check your input and try again.",
    suggestions: [
      "Ensure all required fields are filled",
      "Check for any invalid characters",
      "Review the form for errors",
    ],
  },

  /**
   * Save error - failed to save generation
   */
  saveError: {
    type: "error" as ErrorType,
    title: "Save Failed",
    message: "Unable to save your generation. Please try again.",
    suggestions: [
      "Check your internet connection",
      "Ensure the name is not empty",
      "Try saving again",
    ],
  },

  /**
   * Load error - failed to load generation
   */
  loadError: {
    type: "error" as ErrorType,
    title: "Load Failed",
    message: "Unable to load the generation. Please try again.",
    suggestions: [
      "Check your internet connection",
      "The generation may have been deleted",
      "Try refreshing the list",
    ],
  },

  /**
   * Delete error - failed to delete generation
   */
  deleteError: {
    type: "error" as ErrorType,
    title: "Delete Failed",
    message: "Unable to delete the generation. Please try again.",
    suggestions: [
      "Check your internet connection",
      "Ensure you have permission to delete",
      "Try deleting again",
    ],
  },

  /**
   * Share error - failed to create share link
   */
  shareError: {
    type: "error" as ErrorType,
    title: "Share Failed",
    message: "Unable to create a share link. Please try again.",
    suggestions: [
      "Check your internet connection",
      "Ensure the generation exists",
      "Try creating the share again",
    ],
  },

  /**
   * Template error - failed to save template
   */
  templateError: {
    type: "error" as ErrorType,
    title: "Template Save Failed",
    message: "Unable to save the template. Please try again.",
    suggestions: [
      "Check your internet connection",
      "Ensure the template name is not empty",
      "Try saving again",
    ],
  },

  /**
   * Version error - failed to restore version
   */
  versionError: {
    type: "error" as ErrorType,
    title: "Version Restore Failed",
    message: "Unable to restore the version. Please try again.",
    suggestions: [
      "Check your internet connection",
      "Ensure the version exists",
      "Try restoring again",
    ],
  },

  /**
   * Analytics error - failed to load analytics
   */
  analyticsError: {
    type: "warning" as ErrorType,
    title: "Analytics Unavailable",
    message: "Unable to load analytics data at this time.",
    suggestions: [
      "Check your internet connection",
      "Analytics may be temporarily unavailable",
      "Try refreshing the page",
    ],
  },

  /**
   * AI suggestions error - failed to generate suggestions
   */
  aiSuggestionsError: {
    type: "warning" as ErrorType,
    title: "AI Suggestions Unavailable",
    message: "Unable to generate AI suggestions at this time.",
    suggestions: [
      "Check your internet connection",
      "AI service may be temporarily unavailable",
      "Try again later",
    ],
  },

  /**
   * Generic error - unexpected error occurred
   */
  genericError: {
    type: "error" as ErrorType,
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
    suggestions: [
      "Try refreshing the page",
      "Check your internet connection",
      "Contact support if the issue persists",
    ],
  },
};

/**
 * Helper function to get error message by key
 */
export function getErrorMessage(key: keyof typeof ErrorMessages) {
  return ErrorMessages[key];
}

/**
 * Inline error message component
 * For use within forms and inline contexts
 */
interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className = "" }: InlineErrorProps) {
  return (
    <AnimatedWrapper animationType="fade" className={className}>
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    </AnimatedWrapper>
  );
}

/**
 * Loading error component
 * Shows when a resource fails to load with retry option
 */
interface LoadingErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function LoadingError({
  message = "Failed to load data",
  onRetry,
  className = "",
}: LoadingErrorProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
