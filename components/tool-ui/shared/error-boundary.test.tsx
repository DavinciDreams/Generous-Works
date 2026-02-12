import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ToolUIErrorBoundary } from './error-boundary';

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
}

describe('ToolUIErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <div>Child content</div>
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should catch errors and display default fallback', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('TestComponent failed to render')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should display custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const customFallback = <div>Custom error UI</div>;

    render(
      <ToolUIErrorBoundary
        componentName="TestComponent"
        fallback={customFallback}
      >
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    expect(screen.queryByText('TestComponent failed to render')).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should call onError callback when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ToolUIErrorBoundary
        componentName="TestComponent"
        onError={onError}
      >
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error message' }),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('should log error to console with component name', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();
    // Check that the error was logged (console.error is called by React with multiple args)
    const calls = consoleSpy.mock.calls;
    const hasComponentName = calls.some(call =>
      call.some(arg => typeof arg === 'string' && arg.includes('[TestComponent]'))
    );
    expect(hasComponentName).toBe(true);

    consoleSpy.mockRestore();
  });

  it('should not render fallback when children render successfully', () => {
    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <ThrowError shouldThrow={false} />
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('TestComponent failed to render')).not.toBeInTheDocument();
  });

  it('should handle different component names in error display', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ToolUIErrorBoundary componentName="MyCustomWidget">
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('MyCustomWidget failed to render')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should display error message in default fallback', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    const errorMessageElement = screen.getByText('Test error message');
    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement.className).toContain('text-sm');

    consoleSpy.mockRestore();
  });

  it('should apply correct CSS classes to default fallback', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <ThrowError shouldThrow={true} />
      </ToolUIErrorBoundary>
    );

    const fallbackContainer = screen.getByText('TestComponent failed to render').parentElement;
    expect(fallbackContainer?.className).toContain('border-destructive');
    expect(fallbackContainer?.className).toContain('text-destructive');
    expect(fallbackContainer?.className).toContain('rounded-lg');
    expect(fallbackContainer?.className).toContain('border');
    expect(fallbackContainer?.className).toContain('p-4');

    consoleSpy.mockRestore();
  });

  it('should handle errors thrown in nested children', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ToolUIErrorBoundary componentName="ParentComponent">
        <div>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        </div>
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('ParentComponent failed to render')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should handle multiple children with mixed success/failure', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Only the first error will be caught
    render(
      <ToolUIErrorBoundary componentName="TestComponent">
        <div>Success 1</div>
        <ThrowError shouldThrow={true} />
        <div>Success 2</div>
      </ToolUIErrorBoundary>
    );

    expect(screen.getByText('TestComponent failed to render')).toBeInTheDocument();
    expect(screen.queryByText('Success 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Success 2')).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
