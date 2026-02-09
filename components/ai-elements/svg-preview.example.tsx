import {
  SVGPreview,
  SVGPreviewActions,
  SVGPreviewContent,
  SVGPreviewCopyButton,
  SVGPreviewDownloadButton,
  SVGPreviewError,
  SVGPreviewHeader,
  SVGPreviewModeToggle,
  SVGPreviewTitle,
} from "./svg-preview";

// Example 1: Simple SVG preview with default controls
export function SimpleSVGPreview() {
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#3b82f6" />
</svg>`;

  return (
    <SVGPreview svg={svg} title="Blue Circle" filename="circle.svg">
      <SVGPreviewHeader>
        <SVGPreviewTitle />
        <SVGPreviewActions>
          <SVGPreviewModeToggle />
          <SVGPreviewCopyButton />
          <SVGPreviewDownloadButton />
        </SVGPreviewActions>
      </SVGPreviewHeader>
      <SVGPreviewError />
      <SVGPreviewContent />
    </SVGPreview>
  );
}

// Example 2: SVG preview with custom dimensions
export function CustomDimensionsSVGPreview() {
  const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#10b981" />
  <text x="200" y="150" text-anchor="middle" fill="white" font-size="24">
    Hello, World!
  </text>
</svg>`;

  return (
    <SVGPreview svg={svg} width={400} height={300} filename="greeting.svg">
      <SVGPreviewHeader>
        <SVGPreviewTitle>Custom Greeting</SVGPreviewTitle>
        <SVGPreviewActions>
          <SVGPreviewModeToggle />
          <SVGPreviewCopyButton />
          <SVGPreviewDownloadButton />
        </SVGPreviewActions>
      </SVGPreviewHeader>
      <SVGPreviewError />
      <SVGPreviewContent />
    </SVGPreview>
  );
}

// Example 3: Isolated SVG preview (rendered in iframe)
export function IsolatedSVGPreview() {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <polygon points="150,10 290,290 10,290" fill="#f59e0b" />
</svg>`;

  return (
    <SVGPreview svg={svg} title="Triangle" filename="triangle.svg">
      <SVGPreviewHeader>
        <SVGPreviewTitle />
        <SVGPreviewActions>
          <SVGPreviewModeToggle />
          <SVGPreviewCopyButton />
          <SVGPreviewDownloadButton />
        </SVGPreviewActions>
      </SVGPreviewHeader>
      <SVGPreviewError />
      <SVGPreviewContent isolate />
    </SVGPreview>
  );
}

// Example 4: SVG preview with error handling
export function InvalidSVGPreview() {
  const invalidSvg = `<svg width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#ef4444"
</svg>`;

  return (
    <SVGPreview svg={invalidSvg} title="Invalid SVG" filename="invalid.svg">
      <SVGPreviewHeader>
        <SVGPreviewTitle />
        <SVGPreviewActions>
          <SVGPreviewModeToggle />
          <SVGPreviewCopyButton />
          <SVGPreviewDownloadButton />
        </SVGPreviewActions>
      </SVGPreviewHeader>
      <SVGPreviewError />
      <SVGPreviewContent />
    </SVGPreview>
  );
}

// Example 5: Minimal SVG preview (no header)
export function MinimalSVGPreview() {
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#8b5cf6" />
</svg>`;

  return (
    <SVGPreview svg={svg}>
      <SVGPreviewContent />
    </SVGPreview>
  );
}

// Example 6: SVG preview with custom error message
export function CustomErrorSVGPreview() {
  const invalidSvg = `<svg>Invalid markup`;

  return (
    <SVGPreview svg={invalidSvg} filename="error.svg">
      <SVGPreviewHeader>
        <SVGPreviewTitle>Error Example</SVGPreviewTitle>
        <SVGPreviewActions>
          <SVGPreviewCopyButton />
        </SVGPreviewActions>
      </SVGPreviewHeader>
      <SVGPreviewError>
        {(error) => (
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ SVG Error:</span>
            <span>{error.message}</span>
          </div>
        )}
      </SVGPreviewError>
      <SVGPreviewContent />
    </SVGPreview>
  );
}
