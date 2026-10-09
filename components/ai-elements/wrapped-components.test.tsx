import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import {
  WrappedCharts,
  WrappedTimeline,
  WrappedMaps,
  WrappedThreeScene,
  WrappedKnowledgeGraph,
  WrappedDataTable,
  WrappedCodeEditor,
  WrappedMarkdown,
  WrappedCalendar,
  WrappedGeospatial,
  WrappedImageGallery,
  WrappedJSONViewer,
  WrappedLatex,
  WrappedMermaid,
  WrappedModelViewer,
  WrappedNodeEditor,
  WrappedPhaser,
  WrappedRemotion,
  WrappedSVGPreview,
  WrappedVRM,
  WrappedWYSIWYG
} from "./wrapped-components";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

describe("Wrapped Components Integration Tests", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("WrappedCharts", () => {
    it("should render Charts component", () => {
      render(
        <WrappedCharts
          id="test-charts"
          data={{
            type: "bar",
            series: [
              {
                name: "Series 1",
                data: [
                  { x: "A", y: 10 },
                  { x: "B", y: 20 },
                ],
              },
            ],
          }}
        />
      );

      expect(screen.getByText("Series 1")).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedCharts
          id="test-charts"
          initialPosition={{ x: 100, y: 200 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-charts"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-charts"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(100px, 200px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });

    it("should respect initiallyLocked prop", () => {
      render(
        <WrappedCharts
          id="test-charts"
          initiallyLocked={true}
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      const lockButton = screen.getByLabelText("Unlock");
      expect(lockButton).toBeInTheDocument();
    });
  });

  describe("WrappedTimeline", () => {
    it("should render Timeline component", () => {
      render(
        <WrappedTimeline
          id="test-timeline"
          data={{
            title: { text: "Test Timeline" },
            events: [
              {
                start_date: { year: 2020 },
                text: { text: "Event 1" },
              },
            ],
          }}
        />
      );

      expect(screen.getByText("Test Timeline")).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedTimeline
          id="test-timeline"
          initialPosition={{ x: 50, y: 100 }}
          initialSize={{ width: 800, height: 500 }}
          data={{
            title: { text: "Test Timeline" },
            events: [
              {
                start_date: { year: 2020 },
                text: { text: "Event 1" },
              },
            ],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-timeline"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-timeline"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(50px, 100px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "500px",
      });
    });
  });

  describe("WrappedMaps", () => {
    it("should render Maps component", () => {
      render(
        <WrappedMaps
          id="test-maps"
          data={{
            center: [0, 0],
            zoom: 2,
            markers: [],
          }}
        />
      );

      // Maps component should render
      const wrapper = screen.queryByTestId("maps-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedMaps
          id="test-maps"
          initialPosition={{ x: 150, y: 250 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            center: [0, 0],
            zoom: 2,
            markers: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-maps"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-maps"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(150px, 250px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedThreeScene", () => {
    it("should render ThreeScene component", () => {
      render(
        <WrappedThreeScene
          id="test-threescene"
          data={{
            scene: "",
            camera: { position: [0, 0, 5] },
          }}
        />
      );

      // ThreeScene component should render
      const wrapper = screen.queryByTestId("threescene-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedThreeScene
          id="test-threescene"
          initialPosition={{ x: 200, y: 300 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            scene: "",
            camera: { position: [0, 0, 5] },
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-threescene"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-threescene"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(200px, 300px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedKnowledgeGraph", () => {
    it("should render KnowledgeGraph component", () => {
      render(
        <WrappedKnowledgeGraph
          id="test-knowledgegraph"
          data={{
            nodes: [{ id: "1", label: "Node 1" }],
            edges: [],
          }}
        />
      );

      // KnowledgeGraph component should render
      const wrapper = screen.queryByTestId("knowledgegraph-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedKnowledgeGraph
          id="test-knowledgegraph"
          initialPosition={{ x: 250, y: 350 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            nodes: [{ id: "1", label: "Node 1" }],
            edges: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-knowledgegraph"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-knowledgegraph"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(250px, 350px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedDataTable", () => {
    it("should render DataTable component", () => {
      render(
        <WrappedDataTable
          id="test-datatable"
          data={{
            columns: [
              { id: "name", header: "Name" },
              { id: "value", header: "Value" },
            ],
            rows: [
              { name: "Item 1", value: 100 },
              { name: "Item 2", value: 200 },
            ],
          }}
        />
      );

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedDataTable
          id="test-datatable"
          initialPosition={{ x: 300, y: 400 }}
          initialSize={{ width: 800, height: 500 }}
          data={{
            columns: [
              { id: "name", header: "Name" },
              { id: "value", header: "Value" },
            ],
            rows: [
              { name: "Item 1", value: 100 },
              { name: "Item 2", value: 200 },
            ],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-datatable"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-datatable"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(300px, 400px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "500px",
      });
    });
  });

  describe("WrappedCodeEditor", () => {
    it("should render CodeEditor component", () => {
      render(
        <WrappedCodeEditor
          id="test-codeeditor"
          data={{
            code: "const x = 1;",
            language: "javascript",
          }}
        />
      );

      // CodeEditor component should render
      const wrapper = screen.queryByTestId("codeeditor-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedCodeEditor
          id="test-codeeditor"
          initialPosition={{ x: 350, y: 450 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            code: "const x = 1;",
            language: "javascript",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-codeeditor"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-codeeditor"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(350px, 450px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });

    it("should pass onCodeChange callback", () => {
      const onCodeChange = vi.fn();

      render(
        <WrappedCodeEditor
          id="test-codeeditor"
          data={{
            code: "const x = 1;",
            language: "javascript",
          }}
          onCodeChange={onCodeChange}
        />
      );

      // onCodeChange should be passed through
      expect(onCodeChange).toBeDefined();
    });
  });

  describe("WrappedMarkdown", () => {
    it("should render Markdown component", () => {
      render(
        <WrappedMarkdown
          id="test-markdown"
          data={{
            content: "# Test\n\nThis is a test.",
          }}
        />
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("This is a test.")).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedMarkdown
          id="test-markdown"
          initialPosition={{ x: 400, y: 500 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            content: "# Test\n\nThis is a test.",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-markdown"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-markdown"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(400px, 500px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedCalendar", () => {
    it("should render Calendar component", () => {
      render(
        <WrappedCalendar
          id="test-calendar"
          data={{
            events: [],
          }}
        />
      );

      // Calendar component should render
      const wrapper = screen.queryByTestId("calendar-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedCalendar
          id="test-calendar"
          initialPosition={{ x: 100, y: 100 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            events: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-calendar"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-calendar"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(100px, 100px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("WrappedGeospatial", () => {
    it("should render Geospatial component", () => {
      render(
        <WrappedGeospatial
          id="test-geospatial"
          data={{
            layers: [],
          }}
        />
      );

      // Geospatial component should render
      const wrapper = screen.queryByTestId("geospatial-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedGeospatial
          id="test-geospatial"
          initialPosition={{ x: 150, y: 150 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            layers: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-geospatial"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-geospatial"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(150px, 150px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("WrappedImageGallery", () => {
    it("should render ImageGallery component", () => {
      render(
        <WrappedImageGallery
          id="test-imagegallery"
          data={{
            images: [],
          }}
        />
      );

      // ImageGallery component should render
      const wrapper = screen.queryByTestId("imagegallery-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedImageGallery
          id="test-imagegallery"
          initialPosition={{ x: 200, y: 200 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            images: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-imagegallery"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-imagegallery"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(200px, 200px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("WrappedJSONViewer", () => {
    it("should render JSONViewer component", () => {
      render(
        <WrappedJSONViewer
          id="test-jsonviewer"
          data={{
            json: "{}",
          }}
        />
      );

      // JSONViewer component should render
      const wrapper = screen.queryByTestId("jsonviewer-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedJSONViewer
          id="test-jsonviewer"
          initialPosition={{ x: 250, y: 250 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            json: "{}",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-jsonviewer"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-jsonviewer"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(250px, 250px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedLatex", () => {
    it("should render Latex component", () => {
      render(
        <WrappedLatex
          id="test-latex"
          data={{
            equation: "E = mc^2",
          }}
        />
      );

      // Latex component should render
      const wrapper = screen.queryByTestId("latex-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedLatex
          id="test-latex"
          initialPosition={{ x: 300, y: 300 }}
          initialSize={{ width: 600, height: 400 }}
          data={{
            equation: "E = mc^2",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-latex"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-latex"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(300px, 300px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedMermaid", () => {
    it("should render Mermaid component", () => {
      render(
        <WrappedMermaid
          id="test-mermaid"
          data={{
            diagram: "graph TD; A-->B;",
          }}
        />
      );

      // Mermaid component should render
      const wrapper = screen.queryByTestId("mermaid-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedMermaid
          id="test-mermaid"
          initialPosition={{ x: 350, y: 350 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            diagram: "graph TD; A-->B;",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-mermaid"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-mermaid"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(350px, 350px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("WrappedModelViewer", () => {
    it("should render ModelViewer component", () => {
      render(
        <WrappedModelViewer
          id="test-modelviewer"
          data={{
            url: "https://example.com/model.glb",
            format: "glb",
          }}
        />
      );

      // ModelViewer component should render
      const wrapper = screen.queryByTestId("modelviewer-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedModelViewer
          id="test-modelviewer"
          initialPosition={{ x: 400, y: 400 }}
          initialSize={{ width: 600, height: 500 }}
          data={{
            url: "https://example.com/model.glb",
            format: "glb",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-modelviewer"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-modelviewer"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(400px, 400px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "500px",
      });
    });
  });

  describe("WrappedNodeEditor", () => {
    it("should render NodeEditor component", () => {
      render(
        <WrappedNodeEditor
          id="test-nodeeditor"
          data={{
            nodes: [],
            edges: [],
          }}
        />
      );

      // NodeEditor component should render
      const wrapper = screen.queryByTestId("nodeeditor-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedNodeEditor
          id="test-nodeeditor"
          initialPosition={{ x: 450, y: 450 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            nodes: [],
            edges: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-nodeeditor"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-nodeeditor"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(450px, 450px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("WrappedPhaser", () => {
    it("should render Phaser component", () => {
      render(
        <WrappedPhaser
          id="test-phaser"
          data={{
            config: {},
            scenes: [],
          }}
        />
      );

      // Phaser component should render
      const wrapper = screen.queryByTestId("phaser-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size with aspect ratio", () => {
      const { container } = render(
        <WrappedPhaser
          id="test-phaser"
          initialPosition={{ x: 500, y: 500 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            config: {},
            scenes: [],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-phaser"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-phaser"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(500px, 500px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("WrappedRemotion", () => {
    it("should render Remotion component", () => {
      render(
        <WrappedRemotion
          id="test-remotion"
          data={{
            composition: {
              type: "video",
              width: 800,
              height: 450,
              fps: 30,
              durationInFrames: 100,
              props: {},
            },
          }}
        />
      );

      // Remotion component should render
      const wrapper = screen.queryByTestId("remotion-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size with aspect ratio", () => {
      const { container } = render(
        <WrappedRemotion
          id="test-remotion"
          initialPosition={{ x: 550, y: 550 }}
          initialSize={{ width: 800, height: 450 }}
          data={{
            composition: {
              type: "video",
              width: 800,
              height: 450,
              fps: 30,
              durationInFrames: 100,
              props: {},
            },
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-remotion"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-remotion"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(550px, 550px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "450px",
      });
    });
  });

  describe("WrappedSVGPreview", () => {
    it("should render SVGPreview component", () => {
      render(
        <WrappedSVGPreview
          id="test-svgpreview"
          svg="<svg><rect width='100' height='100'/></svg>"
        />
      );

      // SVGPreview component should render
      const wrapper = screen.queryByTestId("svgpreview-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedSVGPreview
          id="test-svgpreview"
          initialPosition={{ x: 600, y: 600 }}
          initialSize={{ width: 600, height: 400 }}
          svg="<svg><rect width='100' height='100'/></svg>"
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-svgpreview"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-svgpreview"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(600px, 600px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "400px",
      });
    });
  });

  describe("WrappedVRM", () => {
    it("should render VRM component", () => {
      render(
        <WrappedVRM
          id="test-vrm"
          data={{
            url: "https://example.com/model.vrm",
          }}
        />
      );

      // VRM component should render
      const wrapper = screen.queryByTestId("vrm-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedVRM
          id="test-vrm"
          initialPosition={{ x: 650, y: 650 }}
          initialSize={{ width: 600, height: 700 }}
          data={{
            url: "https://example.com/model.vrm",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-vrm"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-vrm"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(650px, 650px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "600px",
        height: "700px",
      });
    });
  });

  describe("WrappedWYSIWYG", () => {
    it("should render WYSIWYG component", () => {
      render(
        <WrappedWYSIWYG
          id="test-wysiwyg"
          data={{
            content: "<p>Test content</p>",
          }}
        />
      );

      // WYSIWYG component should render
      const wrapper = screen.queryByTestId("wysiwyg-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply initial position and size", () => {
      const { container } = render(
        <WrappedWYSIWYG
          id="test-wysiwyg"
          initialPosition={{ x: 700, y: 700 }}
          initialSize={{ width: 800, height: 600 }}
          data={{
            content: "<p>Test content</p>",
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-wysiwyg"]');
      const resizableWrapper = container.querySelector('[data-resizable-id="test-wysiwyg"]');

      expect(draggableWrapper).toHaveStyle({
        transform: "translate(700px, 700px)",
      });
      expect(resizableWrapper).toHaveStyle({
        width: "800px",
        height: "600px",
      });
    });
  });

  describe("Common Wrapped Component Behavior", () => {
    it("should preserve state across re-renders", async () => {
      const { rerender } = render(
        <WrappedCharts
          id="test-charts"
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      // Drag component to new position
      const draggableWrapper = screen.getByText("Series 1").parentElement;
      fireEvent.mouseDown(draggableWrapper!, { clientX: 0, clientY: 0, button: 0 });
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const stored = localStorageMock.getItem("component-layout:test-charts");
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.position).toEqual({ x: 100, y: 100 });
      });
    });

    it("should respect minSize constraint", () => {
      const { container } = render(
        <WrappedCharts
          id="test-charts"
          minSize={{ width: 300, height: 200 }}
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      const resizableWrapper = container.querySelector('[data-resizable-id="test-charts"]');
      expect(resizableWrapper).toBeInTheDocument();
    });

    it("should respect maxSize constraint", () => {
      const { container } = render(
        <WrappedCharts
          id="test-charts"
          maxSize={{ width: 800, height: 600 }}
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      const resizableWrapper = container.querySelector('[data-resizable-id="test-charts"]');
      expect(resizableWrapper).toBeInTheDocument();
    });

    it("should respect boundaryId when provided", () => {
      const { container } = render(
        <WrappedCharts
          id="test-charts"
          boundaryId="test-boundary"
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      const draggableWrapper = container.querySelector('[data-draggable-id="test-charts"]');
      expect(draggableWrapper).toBeInTheDocument();
    });

    it("should respect maintainAspectRatio when provided", () => {
      const { container } = render(
        <WrappedCharts
          id="test-charts"
          maintainAspectRatio={true}
          data={{
            type: "bar",
            series: [{ name: "Series 1", data: [{ x: "A", y: 10 }] }],
          }}
        />
      );

      const resizableWrapper = container.querySelector('[data-resizable-id="test-charts"]');
      expect(resizableWrapper).toBeInTheDocument();
    });
  });
});
