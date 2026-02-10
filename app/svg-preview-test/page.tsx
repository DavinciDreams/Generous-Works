import {
  SVGPreview,
  SVGPreviewActions,
  SVGPreviewContent,
  SVGPreviewCopyButton,
  SVGPreviewDownloadButton,
  SVGPreviewHeader,
  SVGPreviewModeToggle,
  SVGPreviewTitle,
} from "@/components/ai-elements/svg-preview";

const sampleSVG = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.8" />
    </radialGradient>
  </defs>

  <!-- Sky -->
  <rect width="600" height="400" fill="url(#skyGradient)"/>

  <!-- Sun -->
  <circle cx="150" cy="100" r="50" fill="url(#sunGradient)"/>

  <!-- Mountains -->
  <polygon points="0,400 0,250 150,150 300,300 400,200 600,350 600,400" fill="#8B7355"/>
  <polygon points="150,150 300,300 450,180 600,320 600,400 0,400 0,320" fill="#A0826D" opacity="0.8"/>

  <!-- Trees -->
  <polygon points="100,300 120,250 140,300" fill="#228B22"/>
  <rect x="115" y="300" width="10" height="30" fill="#8B4513"/>

  <polygon points="500,320 525,260 550,320" fill="#2E8B57"/>
  <rect x="520" y="320" width="10" height="35" fill="#654321"/>

  <!-- Text -->
  <text x="300" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#333">
    Beautiful SVG Landscape
  </text>
</svg>`;

export default function SVGPreviewTestPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">SVG Preview Test</h1>
        <p className="text-muted-foreground mt-2">
          Display and interact with SVG graphics
        </p>
      </div>

      <SVGPreview svg={sampleSVG} title="Landscape Scene" filename="landscape.svg">
        <SVGPreviewHeader>
          <SVGPreviewTitle />
          <SVGPreviewActions>
            <SVGPreviewModeToggle />
            <SVGPreviewCopyButton />
            <SVGPreviewDownloadButton />
          </SVGPreviewActions>
        </SVGPreviewHeader>
        <SVGPreviewContent />
      </SVGPreview>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">SVG Preview Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Toggle between preview and source code view</li>
          <li>Copy SVG source to clipboard</li>
          <li>Download SVG as a file</li>
          <li>Supports gradients, shapes, and text</li>
          <li>Validates SVG markup</li>
          <li>Responsive rendering</li>
        </ul>
      </div>
    </div>
  );
}
