import type { KnowledgeGraphData } from "./knowledge-graph";

import {
  KnowledgeGraph,
  KnowledgeGraphActions,
  KnowledgeGraphContent,
  KnowledgeGraphCopyButton,
  KnowledgeGraphError,
  KnowledgeGraphFullscreenButton,
  KnowledgeGraphHeader,
  KnowledgeGraphLegend,
  KnowledgeGraphSearch,
  KnowledgeGraphTitle,
} from "./knowledge-graph";

// Example 1: Simple person-organization knowledge graph
export function SimpleKnowledgeGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      {
        id: "alice",
        label: "Alice Johnson",
        type: "person",
        description: "Software Engineer",
      },
      {
        id: "bob",
        label: "Bob Smith",
        type: "person",
        description: "Product Manager",
      },
      {
        id: "acme",
        label: "ACME Corp",
        type: "organization",
        description: "Technology Company",
      },
      {
        id: "project-x",
        label: "Project X",
        type: "concept",
        description: "AI Initiative",
      },
    ],
    relationships: [
      {
        id: "r1",
        source: "alice",
        target: "acme",
        type: "works_at",
        label: "works at",
      },
      {
        id: "r2",
        source: "bob",
        target: "acme",
        type: "works_at",
        label: "works at",
      },
      {
        id: "r3",
        source: "alice",
        target: "project-x",
        type: "leads",
        label: "leads",
      },
      {
        id: "r4",
        source: "bob",
        target: "project-x",
        type: "manages",
        label: "manages",
      },
    ],
  };

  return (
    <KnowledgeGraph data={data}>
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle />
        <KnowledgeGraphActions>
          <KnowledgeGraphCopyButton />
          <KnowledgeGraphFullscreenButton />
        </KnowledgeGraphActions>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError />
      <KnowledgeGraphContent />
      <KnowledgeGraphLegend />
    </KnowledgeGraph>
  );
}

// Example 2: Academic research knowledge graph
export function AcademicKnowledgeGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      {
        id: "ml",
        label: "Machine Learning",
        type: "concept",
        description: "AI subfield",
      },
      {
        id: "dl",
        label: "Deep Learning",
        type: "concept",
        description: "ML technique",
      },
      {
        id: "nlp",
        label: "Natural Language Processing",
        type: "concept",
        description: "Language understanding",
      },
      {
        id: "cv",
        label: "Computer Vision",
        type: "concept",
        description: "Image understanding",
      },
      {
        id: "paper1",
        label: "Attention Is All You Need",
        type: "document",
        description: "Transformer paper",
      },
      {
        id: "paper2",
        label: "ImageNet Classification",
        type: "document",
        description: "AlexNet paper",
      },
      {
        id: "stanford",
        label: "Stanford University",
        type: "organization",
      },
    ],
    relationships: [
      {
        id: "r1",
        source: "dl",
        target: "ml",
        type: "subset_of",
        label: "is subset of",
      },
      {
        id: "r2",
        source: "nlp",
        target: "ml",
        type: "applies",
        label: "applies",
      },
      {
        id: "r3",
        source: "cv",
        target: "ml",
        type: "applies",
        label: "applies",
      },
      {
        id: "r4",
        source: "paper1",
        target: "nlp",
        type: "advances",
        label: "advances",
      },
      {
        id: "r5",
        source: "paper2",
        target: "cv",
        type: "advances",
        label: "advances",
      },
      {
        id: "r6",
        source: "paper1",
        target: "stanford",
        type: "published_by",
        label: "published by",
      },
    ],
  };

  return (
    <KnowledgeGraph data={data} title="AI Research Concepts">
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle />
        <KnowledgeGraphActions>
          <KnowledgeGraphSearch />
          <KnowledgeGraphCopyButton />
          <KnowledgeGraphFullscreenButton />
        </KnowledgeGraphActions>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError />
      <KnowledgeGraphContent />
      <KnowledgeGraphLegend />
    </KnowledgeGraph>
  );
}

// Example 3: Geographic knowledge graph
export function GeographicKnowledgeGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      {
        id: "usa",
        label: "United States",
        type: "location",
        description: "Country",
      },
      {
        id: "california",
        label: "California",
        type: "location",
        description: "State",
      },
      {
        id: "san-francisco",
        label: "San Francisco",
        type: "location",
        description: "City",
      },
      {
        id: "silicon-valley",
        label: "Silicon Valley",
        type: "location",
        description: "Region",
      },
      {
        id: "tech-boom",
        label: "Tech Boom",
        type: "event",
        description: "1990s-2000s",
      },
      {
        id: "google",
        label: "Google",
        type: "organization",
      },
      {
        id: "apple",
        label: "Apple",
        type: "organization",
      },
    ],
    relationships: [
      {
        id: "r1",
        source: "california",
        target: "usa",
        type: "part_of",
        label: "located in",
      },
      {
        id: "r2",
        source: "san-francisco",
        target: "california",
        type: "part_of",
        label: "located in",
      },
      {
        id: "r3",
        source: "silicon-valley",
        target: "california",
        type: "part_of",
        label: "located in",
      },
      {
        id: "r4",
        source: "tech-boom",
        target: "silicon-valley",
        type: "occurred_in",
        label: "occurred in",
      },
      {
        id: "r5",
        source: "google",
        target: "silicon-valley",
        type: "located_in",
        label: "based in",
      },
      {
        id: "r6",
        source: "apple",
        target: "silicon-valley",
        type: "located_in",
        label: "based in",
      },
    ],
  };

  return (
    <KnowledgeGraph data={data} title="Silicon Valley Ecosystem">
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle />
        <KnowledgeGraphActions>
          <KnowledgeGraphSearch />
          <KnowledgeGraphCopyButton />
          <KnowledgeGraphFullscreenButton />
        </KnowledgeGraphActions>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError />
      <KnowledgeGraphContent />
      <KnowledgeGraphLegend />
    </KnowledgeGraph>
  );
}

// Example 4: Historical events knowledge graph
export function HistoricalKnowledgeGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      {
        id: "ww2",
        label: "World War II",
        type: "event",
        description: "1939-1945",
      },
      {
        id: "un-founded",
        label: "UN Founded",
        type: "event",
        description: "1945",
      },
      {
        id: "cold-war",
        label: "Cold War",
        type: "event",
        description: "1947-1991",
      },
      {
        id: "un",
        label: "United Nations",
        type: "organization",
      },
      {
        id: "usa-entity",
        label: "United States",
        type: "location",
      },
      {
        id: "ussr",
        label: "Soviet Union",
        type: "location",
      },
      {
        id: "churchill",
        label: "Winston Churchill",
        type: "person",
      },
    ],
    relationships: [
      {
        id: "r1",
        source: "un-founded",
        target: "ww2",
        type: "followed",
        label: "followed",
      },
      {
        id: "r2",
        source: "un",
        target: "un-founded",
        type: "created_during",
        label: "created during",
      },
      {
        id: "r3",
        source: "cold-war",
        target: "ww2",
        type: "followed",
        label: "followed",
      },
      {
        id: "r4",
        source: "usa-entity",
        target: "cold-war",
        type: "participated_in",
        label: "participated in",
      },
      {
        id: "r5",
        source: "ussr",
        target: "cold-war",
        type: "participated_in",
        label: "participated in",
      },
      {
        id: "r6",
        source: "churchill",
        target: "ww2",
        type: "led_during",
        label: "led during",
      },
    ],
  };

  return (
    <KnowledgeGraph data={data} title="Post-WWII History">
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle />
        <KnowledgeGraphActions>
          <KnowledgeGraphSearch />
          <KnowledgeGraphCopyButton />
          <KnowledgeGraphFullscreenButton />
        </KnowledgeGraphActions>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError />
      <KnowledgeGraphContent />
      <KnowledgeGraphLegend />
    </KnowledgeGraph>
  );
}

// Example 5: Software architecture knowledge graph
export function SoftwareArchitectureGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      {
        id: "frontend",
        label: "Frontend",
        type: "concept",
        description: "React App",
      },
      {
        id: "backend",
        label: "Backend",
        type: "concept",
        description: "Node.js API",
      },
      {
        id: "database",
        label: "Database",
        type: "concept",
        description: "PostgreSQL",
      },
      {
        id: "cache",
        label: "Cache",
        type: "concept",
        description: "Redis",
      },
      {
        id: "auth",
        label: "Auth Service",
        type: "concept",
        description: "JWT",
      },
      {
        id: "cdn",
        label: "CDN",
        type: "concept",
        description: "CloudFlare",
      },
    ],
    relationships: [
      {
        id: "r1",
        source: "frontend",
        target: "backend",
        type: "calls",
        label: "API calls",
      },
      {
        id: "r2",
        source: "frontend",
        target: "cdn",
        type: "served_by",
        label: "served by",
      },
      {
        id: "r3",
        source: "backend",
        target: "database",
        type: "reads_writes",
        label: "reads/writes",
      },
      {
        id: "r4",
        source: "backend",
        target: "cache",
        type: "uses",
        label: "uses",
      },
      {
        id: "r5",
        source: "backend",
        target: "auth",
        type: "uses",
        label: "uses",
      },
      {
        id: "r6",
        source: "cache",
        target: "database",
        type: "caches",
        label: "caches",
      },
    ],
  };

  return (
    <KnowledgeGraph data={data} title="System Architecture">
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle />
        <KnowledgeGraphActions>
          <KnowledgeGraphCopyButton />
          <KnowledgeGraphFullscreenButton />
        </KnowledgeGraphActions>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError />
      <KnowledgeGraphContent />
      <KnowledgeGraphLegend />
    </KnowledgeGraph>
  );
}

// Example 6: Minimal knowledge graph (no header)
export function MinimalKnowledgeGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      { id: "a", label: "Entity A", type: "concept" },
      { id: "b", label: "Entity B", type: "concept" },
      { id: "c", label: "Entity C", type: "concept" },
    ],
    relationships: [
      { id: "r1", source: "a", target: "b", type: "relates_to" },
      { id: "r2", source: "b", target: "c", type: "relates_to" },
      { id: "r3", source: "c", target: "a", type: "relates_to" },
    ],
  };

  return (
    <KnowledgeGraph data={data}>
      <KnowledgeGraphContent />
    </KnowledgeGraph>
  );
}

// Example 7: Error handling (invalid data)
export function KnowledgeGraphWithError() {
  const invalidData: KnowledgeGraphData = {
    entities: [],
    relationships: [],
  };

  return (
    <KnowledgeGraph data={invalidData}>
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle>This will show an error</KnowledgeGraphTitle>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError>
        {(error) => (
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Knowledge Graph Error:</span>
            <span>{error.message}</span>
          </div>
        )}
      </KnowledgeGraphError>
      <KnowledgeGraphContent />
    </KnowledgeGraph>
  );
}

// Example 8: Product ecosystem knowledge graph
export function ProductEcosystemGraph() {
  const data: KnowledgeGraphData = {
    entities: [
      {
        id: "product",
        label: "SaaS Product",
        type: "concept",
        description: "Main product",
      },
      {
        id: "user1",
        label: "Enterprise User",
        type: "person",
        description: "Large company",
      },
      {
        id: "user2",
        label: "Individual User",
        type: "person",
        description: "Freelancer",
      },
      {
        id: "feature1",
        label: "Analytics",
        type: "concept",
        description: "Data insights",
      },
      {
        id: "feature2",
        label: "Collaboration",
        type: "concept",
        description: "Team features",
      },
      {
        id: "integration1",
        label: "Slack",
        type: "organization",
      },
      {
        id: "integration2",
        label: "GitHub",
        type: "organization",
      },
    ],
    relationships: [
      {
        id: "r1",
        source: "user1",
        target: "product",
        type: "uses",
        label: "uses",
      },
      {
        id: "r2",
        source: "user2",
        target: "product",
        type: "uses",
        label: "uses",
      },
      {
        id: "r3",
        source: "product",
        target: "feature1",
        type: "includes",
        label: "includes",
      },
      {
        id: "r4",
        source: "product",
        target: "feature2",
        type: "includes",
        label: "includes",
      },
      {
        id: "r5",
        source: "product",
        target: "integration1",
        type: "integrates_with",
        label: "integrates with",
      },
      {
        id: "r6",
        source: "product",
        target: "integration2",
        type: "integrates_with",
        label: "integrates with",
      },
      {
        id: "r7",
        source: "user1",
        target: "feature2",
        type: "uses",
        label: "primarily uses",
      },
    ],
  };

  return (
    <KnowledgeGraph data={data} title="Product Ecosystem">
      <KnowledgeGraphHeader>
        <KnowledgeGraphTitle />
        <KnowledgeGraphActions>
          <KnowledgeGraphSearch />
          <KnowledgeGraphCopyButton />
          <KnowledgeGraphFullscreenButton />
        </KnowledgeGraphActions>
      </KnowledgeGraphHeader>
      <KnowledgeGraphError />
      <KnowledgeGraphContent />
      <KnowledgeGraphLegend />
    </KnowledgeGraph>
  );
}
