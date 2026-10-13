export interface DiagramDefinition {
  id: string
  title: string
  description: string
  kind: string
  project?: string
  source: string
  code: string
}
export const diagrams: DiagramDefinition[] = [
  {
    id: 'evalforge',
    title: 'Multi-LLM evaluation platform',
    description:
      'EvalForge’s interface, evaluation runner, model providers, and persistence boundaries.',
    kind: 'Component & deployment',
    project: 'evalforge',
    source: 'EvalForge README and deployment documentation',
    code: `flowchart TB
    UI[Next.js interface] --> API[FastAPI backend]
    Bench[HTTP benchmark runner] --> API
    API --> Runner[Bounded async evaluation]
    Runner --> Providers[Model provider APIs]
    Runner --> Judge[Pydantic-validated judge]
    API --> DB[(SQLite persistent volume)]
    Judge --> DB`,
  },
  {
    id: 'hospital',
    title: 'Layered healthcare application',
    description:
      'React and a separate facade share an API whose routes, business rules, and persistence are separated.',
    kind: 'High-level architecture',
    project: 'hospital-management',
    source: 'Hospital Management System README',
    code: `flowchart TB
    React[React interface] --> Routes[Express routes and validation]
    External[Other-hospital portal] --> Facade[Patient lookup facade]
    Facade --> Routes
    Routes --> Services[Auth and patient services]
    Services --> Repos[SQL repositories]
    Repos --> Pool[MySQL connection pool]
    Pool --> DB[(MySQL database)]`,
  },
  {
    id: 'voting',
    title: 'Voting eligibility & transaction',
    description:
      'A sequence overview of server-side eligibility checks and transactional vote recording.',
    kind: 'Sequence',
    project: 'voting-application',
    source: 'Voting application README; conceptual sequence',
    code: `sequenceDiagram
    actor V as Voter
    participant S as Server
    participant D as MySQL
    V->>S: Submit vote
    S->>S: Check role, precinct and election window
    S->>D: Transaction: check and record vote
    alt Eligible and not already recorded
        D-->>S: Commit vote
        S-->>V: Vote recorded
    else Ineligible or duplicate
        D-->>S: No new vote
        S-->>V: Reject request
    end`,
  },
  {
    id: 'automation',
    title: 'Training certificate workflow',
    description:
      'Attendance and grade data flow through validation, certificate generation, and delivery.',
    kind: 'Data flow',
    project: 'hawkai-automation',
    source: 'HawkAI certificate pipeline — workflow overview',
    code: `flowchart LR
    A[Attendance and grade data] --> B[Clean and validate]
    B --> C[Generate certificates]
    C --> D[Deliver to learners]
    P[Python and Power Automate] -.-> B
    P -.-> C
    P -.-> D`,
  },
  {
    id: 'vr',
    title: 'AI & physiological input in VR',
    description:
      'A component overview connecting the VR classroom, AI integration, physiological sensor, and study-data analysis.',
    kind: 'Component',
    project: 'vr-classroom',
    source: 'AI-guided VR classroom — component overview',
    code: `flowchart TB
    Sensor[HeartMath emWave sensor] --> VR[Unity and C# VR classroom]
    AI[OpenAI API] <--> VR
    VR --> Headset[Oculus Quest experience]
    Study[Study and tracking data] --> Analysis[MATLAB and Python analysis]`,
  },
]
export const diagramTemplates = [
  {
    title: 'High-level architecture',
    code: 'flowchart LR\n  Client --> API\n  API --> Database[(Database)]',
  },
  {
    title: 'Sequence diagram',
    code: 'sequenceDiagram\n  Client->>API: Request\n  API-->>Client: Response',
  },
  {
    title: 'Entity relationship',
    code: 'erDiagram\n  PROJECT ||--o{ ARTIFACT : contains\n  PROJECT {\n    string id PK\n    string title\n  }\n  ARTIFACT {\n    string id PK\n    string projectId FK\n  }',
  },
  { title: 'Data flow', code: 'flowchart LR\n  Input --> Validate --> Transform --> Output' },
  {
    title: 'Deployment',
    code: 'flowchart TB\n  subgraph Static_host\n    HTML[HTML and assets]\n  end\n  Browser --> HTML',
  },
  {
    title: 'Component diagram',
    code: 'flowchart LR\n  UI[Interface] --> Service[Service]\n  Service --> Adapter[Adapter]',
  },
]
export const plannedDesigns = [
  'URL shortener',
  'Notification service',
  'Rate limiter',
  'Distributed job processing',
  'Real-time chat',
  'File upload & processing',
  'RAG architecture',
]
