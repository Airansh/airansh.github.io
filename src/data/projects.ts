import type { Project, Source } from './types'
const resume: Source = {
  label: 'Professional resume',
  note: 'User-supplied resume; see docs/content-sources.md for provenance.',
}
const researchResume: Source = {
  label: 'Research and AI resume',
  note: 'User-supplied UCSD resume and LinkedIn profile.',
}
const repo = (name: string): Source => ({
  label: 'Repository & documentation',
  url: `https://github.com/Airansh/${name}`,
})
export const projects: Project[] = [
  {
    id: 'iowa-ai-gateway',
    title: 'Iowa AI Gateway',
    subtitle: 'Enterprise AI, built around real work.',
    summary:
      'A university pilot bringing multiple AI providers into one HawkID SSO workspace, shaped by faculty, staff, and researcher needs.',
    category: 'AI & LLM Systems',
    context: 'Professional',
    organization: 'University of Iowa ITS',
    period: '2024–present',
    tech: ['LibreChat', 'OpenAI', 'Anthropic', 'Amazon Bedrock', 'SSO'],
    featured: true,
    contributions: [
      'Led the 147-person pilot and translated use cases into platform configuration.',
      'Delivered agents, artifacts, and custom model parameters in the pilot workspace.',
      'Analyzed pre- and post-pilot feedback to inform the production decision.',
    ],
    outcomes: ['147 pilot participants', 'Multiple AI providers in one workspace'],
    sources: [resume],
    study: {
      problem:
        'Faculty, staff, and researchers needed a way to explore multiple AI models within a university workspace and assess their value for real institutional tasks.',
      role: 'Led the pilot, gathered use cases, configured platform capabilities, and analyzed participant feedback as part of the university’s emerging technology work.',
      requirements: [
        'A HawkID SSO workspace for university participants.',
        'Access to OpenAI, Anthropic, and Amazon Bedrock models.',
        'A structured pilot evaluation to inform production readiness.',
      ],
      implementation: [
        'Used LibreChat as the multi-model workspace.',
        'Translated participant needs into agents, artifacts, and custom model parameters.',
        'Combined pre- and post-pilot survey analysis with operational feedback.',
      ],
      validation:
        'Pilot evaluation included 147 faculty, staff, and researchers and pre/post feedback analysis. Detailed survey instruments and internal operational results are not published here.',
      tradeoffs:
        'The documented decision process considered user needs and pilot evidence before production adoption. Provider selection, hosting topology, and identity configuration are internal details.',
      outcome: 'Provided the pilot findings used to inform the university’s production decision.',
      further: ['Approved pilot visuals and a public account of the evaluation criteria.'],
    },
  },
  {
    id: 'titronics-cloud',
    title: 'Titronics Cloud',
    subtitle: 'Patient access, connected to care.',
    summary:
      'Patient-facing healthcare software for scan access, provider communication, provider networks, and payments.',
    category: 'Healthcare Software',
    context: 'Professional',
    organization: 'FarrPro',
    period: 'Feb–Jul 2026',
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'AWS EC2', 'Cognito', 'Stripe'],
    featured: true,
    contributions: [
      'Built portal features spanning React interfaces and Node.js/Express APIs.',
      'Contributed secure scan access, provider messaging, provider-network features, and Stripe payments.',
      'Reviewed code and tested new integrations across the healthcare product suite.',
    ],
    outcomes: [
      'Portal serving thousands of patients',
      'One of three concurrent healthcare products',
    ],
    sources: [resume],
    study: {
      problem:
        'Patients needed convenient access to their scans and a way to communicate with providers through a patient-facing portal.',
      role: 'Contributed full-stack features as a part-time software engineer working across Titronics Cloud, Titronics, and MyCare.',
      requirements: [
        'Patient scan access and provider communication.',
        'Provider-network features and payment integration.',
        'Integration testing before releasing new services.',
      ],
      implementation: [
        'Built React features backed by Node.js/Express REST APIs and MySQL.',
        'Worked with the existing AWS EC2 and Cognito environment.',
        'Contributed Stripe payment features and tested service integrations, including Google Maps Platform.',
      ],
      validation:
        'The resume records code review, integration testing, and end-to-end testing of new services before release. Internal test reports are not public.',
      tradeoffs:
        'Work was delivered across three concurrent products using Jira/Kanban. Internal data models, security controls, and architectural decisions are not disclosed.',
      outcome:
        'Contributed to a portal serving thousands of patients, supporting scan access, communication, and provider discovery.',
      further: ['Approved product screenshots and specific public feature demonstrations.'],
    },
  },
  {
    id: 'evalforge',
    title: 'EvalForge',
    subtitle: 'AI evaluation you can trace.',
    summary:
      'A local-first multi-LLM evaluation platform for comparing answer quality, latency, and cost—and detecting comparable regressions.',
    category: 'AI & LLM Systems',
    context: 'Independent',
    organization: 'Independent project',
    period: '2026',
    tech: ['Python', 'FastAPI', 'asyncio', 'Next.js', 'SQLAlchemy', 'Docker', 'Kubernetes'],
    featured: true,
    github: 'https://github.com/Airansh/LLM-Evaluator',
    diagram: 'evalforge',
    contributions: [
      'Built a bounded-concurrency async runner with retries, timeouts, and Pydantic-validated judging.',
      'Used content-hashed cases and matching model settings to gate regression comparisons.',
      'Added non-root container images, health probes, resource limits, and CI.',
    ],
    outcomes: [
      '72 live case evaluations reported',
      '87 pytest tests reported in the resume',
      'Cross-model regression comparisons refused',
    ],
    sources: [resume, repo('LLM-Evaluator')],
    study: {
      problem:
        'Prompt and model changes can quietly affect answer quality, latency, and cost. Hand-checking a few outputs does not provide a traceable regression verdict.',
      role: 'Built the evaluation application, asynchronous execution flow, comparison logic, and deployment configuration.',
      requirements: [
        'Evaluate a fixed dataset across multiple model providers.',
        'Capture per-case outputs, judge reasoning, errors, and metric denominators.',
        'Issue regression verdicts only for like-for-like cases, models, and settings.',
      ],
      implementation: [
        'A FastAPI backend executes evaluations with bounded asyncio concurrency, retries, and timeouts.',
        'Pydantic validates judge output; SQLAlchemy persists results in SQLite.',
        'A Next.js interface supports experiment review and baseline comparison.',
        'Compose and Kubernetes use the same frontend/backend images; a separate HTTP benchmark runner holds no provider keys.',
      ],
      validation:
        'The supplied resume reports 72 live case evaluations with no request or judge errors and 87 pytest tests. Repository documentation reports live Anthropic and Gemini runs; the OpenAI adapter has not been live-verified. These are project-reported results, not tests rerun by this portfolio.',
      tradeoffs:
        'SQLite keeps deployment simple but constrains backend scaling: Kubernetes uses one backend replica with a Recreate strategy. Small datasets, single samples, and a Claude-family judge limit claims about model superiority.',
      outcome:
        'Recorded a −0.4 percentage-point Gemini run-to-run difference and refused a misleading Sonnet-versus-Haiku regression comparison.',
      further: [
        'Cross-provider judging and broader repeated evaluation would strengthen model comparisons.',
      ],
    },
  },
  {
    id: 'vr-classroom',
    title: 'AI-guided VR classroom',
    subtitle: 'Research at the intersection of AI and XR.',
    summary:
      'An immersive teacher-training simulation integrating AI, interactive characters, and real-time physiological sensor data.',
    category: 'XR & Generative Media',
    context: 'Research',
    organization: 'Holo Reality Lab · University of Iowa',
    period: '2022–2024',
    tech: ['Unity', 'C#', 'OpenAI API', 'Oculus Quest', 'emWave', 'MATLAB'],
    featured: true,
    diagram: 'vr',
    contributions: [
      'Built a Unity VR classroom and behavior-driven character interactions.',
      'Integrated real-time heart-rate-variability data from a HeartMath emWave sensor.',
      'Analyzed study data and co-authored the resulting Electronic Imaging research paper.',
    ],
    outcomes: [
      '38% higher study engagement reported',
      'Co-authored IS&T Electronic Imaging 2025 research',
    ],
    sources: [resume, researchResume],
    study: {
      problem:
        'Teacher-training research needed an immersive environment for studying interactions and physiological responses during simulated classroom situations.',
      role: 'Developed the simulation and sensor integration as a graduate research assistant, with later AI development work, and contributed to the research publication.',
      requirements: [
        'An interactive classroom experience on Oculus Quest.',
        'AI-enabled behavior and C# character interactions.',
        'Real-time physiological input and reproducible study-data analysis.',
      ],
      implementation: [
        'Used Unity for the VR environment and C# for simulation behavior and movement tracking.',
        'Integrated OpenAI APIs and live HRV data from an emWave sensor.',
        'Analyzed tracking and physiological data using MATLAB and Python.',
      ],
      validation:
        'The work supported a human-subjects teacher-training study. The resume reports a 38% engagement increase; the detailed metric definition and study protocol are not supplied in the portfolio materials.',
      tradeoffs:
        'The research connects software behavior, physical sensors, and human study methods. The diagram shows only documented components; timing guarantees and experimental controls require further documentation.',
      outcome:
        'Contributed to “Enhancing teacher training with AI-guided simulations in smart virtual reality,” IS&T Electronic Imaging 2025.',
      further: [
        'Public study protocol, engagement metric definition, and approved simulation captures.',
      ],
    },
  },
  {
    id: 'simplex-operations',
    title: 'Simplex operations platform',
    subtitle: 'From manual processes to shared software.',
    summary:
      'A manufacturing operations application covering costing, financial tracking, quality checks, and spreadsheet reporting.',
    category: 'Automation & Data',
    context: 'Professional',
    organization: 'Simplex Metal Processors',
    period: 'Sep 2020–Jun 2021',
    tech: ['PHP', 'CodeIgniter', 'MySQL', 'DigitalOcean'],
    featured: true,
    contributions: [
      'Designed the relational schema and built a CodeIgniter MVC web application.',
      'Implemented operational workflows and automated spreadsheet reports.',
      'Deployed the application to seven companies and supported adoption with documentation and training.',
    ],
    outcomes: ['Deployed to 7 companies', '50% fewer manual tasks', '30% fewer errors'],
    sources: [resume],
    study: {
      problem:
        'Manufacturing operations depended on manual work across cost calculations, financial tracking, reporting, and quality checks.',
      role: 'Designed the database, built the web application, deployed it, and supported users through adoption.',
      requirements: [
        'Bring operational workflows into a shared web application.',
        'Support structured records, calculations, quality checks, and spreadsheet reports.',
        'Provide user documentation and training across seven companies.',
      ],
      implementation: [
        'Implemented server-side workflows using PHP and CodeIgniter MVC.',
        'Designed and integrated the MySQL database.',
        'Deployed on DigitalOcean and documented workflows, queries, and user guidance.',
      ],
      validation:
        'The supplied resume reports adoption across seven companies and reductions in manual tasks and errors. Detailed measurement methods and internal test reports are not included.',
      tradeoffs:
        'The documented design uses a conventional MVC application and relational database. Specific tenancy boundaries and hosting capacity should not be inferred from the seven-company deployment.',
      outcome: 'Reported a 50% reduction in manual tasks and a 30% reduction in errors.',
    },
  },
  {
    id: 'hospital-management',
    title: 'Hospital Management System',
    subtitle: 'A full-stack view of software architecture.',
    summary:
      'A healthcare demo with a React interface, layered Express API, MySQL database, and a separate patient-lookup facade.',
    category: 'Full-Stack Applications',
    context: 'Academic',
    organization: 'Academic project',
    period: 'Graduate coursework',
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'Jest'],
    featured: true,
    diagram: 'hospital',
    github: 'https://github.com/Airansh/Hospital-Management-System-Demo',
    contributions: [
      'Built the path from relational schema through REST APIs to role-based dashboards.',
      'Separated routes, services, repositories, and connection management.',
      'Included a facade that forwards patient lookups to the API with timeout and error handling.',
    ],
    outcomes: [
      'Layered architecture with testable service boundaries',
      'Public source and architecture documentation',
    ],
    sources: [resume, repo('Hospital-Management-System-Demo')],
    study: {
      problem:
        'A software architecture project needed to demonstrate how user interfaces, application rules, persistence, and integration boundaries fit together.',
      role: 'Developed the full-stack hospital demo, from relational modeling through API and interface implementation.',
      requirements: [
        'Patient signup, login, and role-based interface navigation.',
        'Patient-record lookup through an API and a separate facade.',
        'Layer separation that supports isolated tests.',
      ],
      implementation: [
        'Used Express routes and validation middleware above services and parameterized SQL repositories.',
        'Injected dependencies into the app composition root to support test fakes.',
        'Added a facade with input validation, upstream timeouts, and status forwarding.',
      ],
      validation:
        'Repository documentation lists 18 backend tests and 31 frontend tests, covering auth rules, HTTP endpoints, forms, navigation, and role protection. Those source-project suites were not rerun as part of building this portfolio.',
      tradeoffs:
        'This is an educational demo. Client-side session state does not provide production authentication, and patient API endpoints lack server-side access control. The appointment form has no booking endpoint.',
      outcome:
        'An inspectable example of layered application design, API boundaries, and dependency-isolated testing.',
      further: [
        'Signed sessions or tokens, server-side authorization, and a real appointment workflow are documented next steps.',
      ],
    },
  },
  {
    id: 'mycare',
    title: 'MyCare',
    subtitle: 'AI-assisted personal health records.',
    summary:
      'A health-records application bringing documents, recordings, notes, and caregiver collaboration into one product.',
    category: 'Healthcare Software',
    context: 'Professional',
    organization: 'FarrPro',
    period: 'Feb–Jul 2026',
    tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'Auth0', 'Whisper', 'HL7 FHIR'],
    contributions: [
      'Developed application features for personal medical records and health information.',
      'Integrated Whisper transcription and HL7 FHIR workflows.',
      'Supported a beta program and tested new service integrations.',
    ],
    outcomes: ['100+ user beta', 'One of three concurrent healthcare products'],
    sources: [resume],
  },
  {
    id: 'titronics',
    title: 'Titronics',
    subtitle: 'Software behind clinical measurement.',
    summary: 'A clinical thermography system used to capture and review patient scan data.',
    category: 'Healthcare Software',
    context: 'Professional',
    organization: 'FarrPro',
    period: 'Feb–Jul 2026',
    tech: ['.NET', 'C#', 'MySQL'],
    contributions: [
      'Developed and maintained clinical measurement software.',
      'Supported patient thermography capture and review workflows.',
    ],
    outcomes: ['Used by 100+ clinics'],
    sources: [resume],
  },
  {
    id: 'institutional-agents',
    title: 'Institutional AI agents',
    subtitle: 'Useful answers, grounded in approved sources.',
    summary:
      'Departmental chatbots and Copilot agents shaped by staff workflows and approved institutional knowledge.',
    category: 'AI & LLM Systems',
    context: 'Professional',
    organization: 'University of Iowa ITS',
    period: '2024–present',
    tech: ['OpenAI API', 'Copilot Studio', 'Gravyty / Ivy.ai', 'RAG'],
    contributions: [
      'Interviewed staff to understand operational processes.',
      'Built and maintained agents grounded in each unit’s approved information.',
      'Supported HR and OneIT pilots and ongoing operational use.',
    ],
    outcomes: ['1,000+ users across 8+ units'],
    sources: [resume],
  },
  {
    id: 'enterprise-ai-evaluation',
    title: 'Enterprise AI evaluation',
    subtitle: 'Evidence before adoption.',
    summary:
      'Testing infrastructure and black-box evaluations to assess AI answer accuracy and detect regressions.',
    category: 'AI & LLM Systems',
    context: 'Professional',
    organization: 'University of Iowa ITS',
    period: '2024–present',
    tech: ['AI evaluation', 'Regression testing', 'Black-box testing'],
    contributions: [
      'Built infrastructure to score AI answer accuracy and flag regressions.',
      'Evaluated enterprise tools before campus adoption.',
      'Authored guidance on human review of agent outputs.',
    ],
    outcomes: ['Supported evidence-informed campus adoption'],
    sources: [resume],
  },
  {
    id: 'hawkai-automation',
    title: 'HawkAI certificate pipeline',
    subtitle: 'An entire workflow, automated.',
    summary:
      'A Python and Power Automate pipeline that validates training data, generates certificates, and delivers them to learners.',
    category: 'Automation & Data',
    context: 'Professional',
    organization: 'University of Iowa ITS',
    period: '2024–present',
    tech: ['Python', 'Power Automate', 'Data validation'],
    diagram: 'automation',
    contributions: [
      'Mapped the existing certificate process with program staff.',
      'Cleaned and validated attendance and grade data.',
      'Automated certificate generation and delivery.',
    ],
    outcomes: ['1,120 certificates issued without manual processing'],
    sources: [resume],
    study: {
      problem:
        'Training completion data had to be turned into certificates through a manual operational workflow.',
      role: 'Worked with HawkAI staff to map the process and built the validation, generation, and delivery pipeline.',
      requirements: [
        'Clean attendance and grade inputs.',
        'Validate records before generating certificates.',
        'Deliver generated certificates without manual processing.',
      ],
      implementation: [
        'Used Python for data processing and automation.',
        'Connected the workflow with Power Automate.',
        'Automated certificate generation and delivery following validation.',
      ],
      validation:
        'The resume reports 1,120 certificates issued without manual steps. Specific exception-handling rules, data formats, and delivery retries are not documented in the supplied sources.',
      tradeoffs:
        'The documented pipeline combines Python processing with Power Automate orchestration. The public diagram describes workflow stages, not an internal deployment topology.',
      outcome: 'Eliminated manual processing for the reported batch of 1,120 certificates.',
    },
  },
  {
    id: 'chenoa-healthcare',
    title: 'Healthcare workflow application',
    subtitle: 'Registration to provider dashboards.',
    summary:
      'Patient registration, appointment scheduling, and provider dashboard modules for a healthcare web application.',
    category: 'Healthcare Software',
    context: 'Professional',
    organization: 'Chenoa Information Services',
    period: 'Jul 2021–Jul 2022',
    tech: ['Angular', 'Node.js', 'DynamoDB'],
    contributions: [
      'Built patient-facing and provider-facing application modules.',
      'Delivered improvements through Agile sprints with Jira and Bitbucket.',
    ],
    outcomes: ['45% improved scheduling efficiency reported', '50% improved usability reported'],
    sources: [resume],
  },
  {
    id: 'insurance-ocr',
    title: 'Insurance intake automation',
    subtitle: 'Less typing at patient intake.',
    summary:
      'Google Vision integration to capture insurance-card information automatically during patient intake.',
    category: 'Healthcare Software',
    context: 'Professional',
    organization: 'Chenoa Information Services',
    period: '2021–2022',
    tech: ['Google Vision API', 'OCR', 'API integration'],
    contributions: [
      'Integrated card scanning into the insurance intake workflow.',
      'Replaced manual insurance-detail entry with API-assisted extraction.',
    ],
    outcomes: ['70% less intake processing time reported'],
    sources: [resume],
  },
  {
    id: 'leadquest-migration',
    title: 'LeadQuest database migration',
    subtitle: 'Modernizing the data layer.',
    summary:
      'A legacy-to-modern SQL Server migration with query optimization and data-integrity validation.',
    category: 'Automation & Data',
    context: 'Professional',
    organization: 'Chenoa Information Services',
    period: '2021–2022',
    tech: ['SQL Server', 'SQL', 'Data migration'],
    contributions: [
      'Led the database migration.',
      'Optimized queries and validated data integrity.',
    ],
    outcomes: ['35% faster data access reported'],
    sources: [resume, researchResume],
  },
  {
    id: 'voting-application',
    title: 'Voting Web Application',
    subtitle: 'Rules, transactions, and quality gates.',
    summary:
      'An educational election application with voter approval, precinct eligibility, election administration, and transactional vote recording.',
    category: 'Full-Stack Applications',
    context: 'Academic',
    organization: 'Software engineering team project',
    period: 'Graduate coursework',
    tech: ['Node.js', 'Express', 'Socket.IO', 'MySQL', 'Jasmine', 'GitLab CI'],
    diagram: 'voting',
    github: 'https://github.com/Airansh/Voting-Application-for-US-Elections',
    contributions: [
      'Built a team project supporting election setup, voter approval, and voting dashboards.',
      'Added testing and CI/quality-gate configuration.',
      'The public implementation documents role checks, eligibility validation, and one-vote transactions.',
    ],
    outcomes: [
      'Public application and CI configuration',
      'Educational demo; not certified election software',
    ],
    sources: [resume, repo('Voting-Application-for-US-Elections')],
    study: {
      problem:
        'A software engineering team project needed to coordinate voter registration, election administration, and rule-based voting.',
      role: 'Contributed to the application with Alec and Joseph and implemented the documented CI/quality workflow. The repository reflects team work.',
      requirements: [
        'Approve voters and configure precincts, races, and election windows.',
        'Enforce eligibility and one vote per race on the server.',
        'Test validation, credentials, tokens, and election-state logic.',
      ],
      implementation: [
        'Node.js/Express serves the application and Socket.IO handles interactions.',
        'MySQL transactions protect vote recording against concurrent duplicate requests.',
        'The repository documents scrypt password hashing, one-time hashed reset tokens, and server-side role checks.',
      ],
      validation:
        'Jasmine covers validation, password hashing, token behavior, election status, and voting history. GitLab CI/SonarQube configuration is resume-supported; the current repository also documents GitHub Actions tests.',
      tradeoffs:
        'This application is an educational demonstration. It does not establish suitability, certification, or security assurance for a real election.',
      outcome:
        'A public example of application rules, transaction boundaries, and automated quality checks.',
    },
  },
  {
    id: 'generative-ar',
    title: 'Generative AI in AR',
    subtitle: 'From voice to an augmented view.',
    summary:
      'A Unity augmented-reality application for real-time in-camera image replacement with generative AI.',
    category: 'XR & Generative Media',
    context: 'Academic',
    organization: 'University of Iowa project',
    period: 'Graduate project',
    tech: ['Unity', 'Whisper API', 'Segmind', 'Generative AI'],
    contributions: [
      'Built an AR application with in-camera image replacement.',
      'Integrated voice input through Whisper and text-to-image generation through Segmind.',
      'Presented image replacement through AR and AI at a university AI Lightning Talk.',
    ],
    outcomes: ['Presented at AI Lightning Talks, February 2025'],
    sources: [researchResume],
  },
  {
    id: 'backdropwizard',
    title: 'BackdropWizard',
    subtitle: 'Generative images, from phone to print.',
    summary:
      'An AI photo project connecting image generation and background replacement with mobile requests and automated printing.',
    category: 'XR & Generative Media',
    context: 'Academic',
    organization: 'Collaborative project',
    period: 'Graduate project',
    tech: ['React', 'Node.js', 'Puppeteer', 'Segmind', 'Clipdrop'],
    contributions: [
      'Developed photo enhancement and automated printing workflows.',
      'The public backend documents Node services for image generation and printing.',
      'Integrated with a separate mobile application.',
    ],
    outcomes: ['Image generation and printing integration'],
    sources: [resume, repo('BackdropWizard-Backend')],
  },
  {
    id: 'vr-ball-trajectory',
    title: 'VR ball trajectory',
    subtitle: 'Physical interactions in virtual space.',
    summary:
      'An independent-study Unity application exploring ball throws, target paths, and collision behavior in VR.',
    category: 'XR & Generative Media',
    context: 'Research',
    organization: 'University of Iowa',
    period: 'Graduate independent study',
    tech: ['Unity', 'C#', 'OpenXR', 'Quest 2'],
    github: 'https://github.com/Airansh/VR-Smooth-Ball-Trajectory',
    contributions: [
      'Built ball-throw and target-path behavior.',
      'Implemented VRBallThrow, TargetSpawner, TargetFollower, and TargetCollisionDetector scripts.',
    ],
    outcomes: ['Public Unity/OpenXR implementation'],
    sources: [researchResume, repo('VR-Smooth-Ball-Trajectory')],
  },
  {
    id: 'kinect-tracking',
    title: 'Kinect trajectory tracking',
    subtitle: 'Turning motion into analyzable data.',
    summary:
      'A MATLAB face-tracking application using Microsoft Kinect and the KinZ library to record, filter, and plot motion.',
    category: 'Research & IoT',
    context: 'Research',
    organization: 'University of Iowa',
    period: 'Graduate independent study',
    tech: ['MATLAB', 'Microsoft Kinect', 'KinZ'],
    contributions: [
      'Built face-position recording and trajectory visualization.',
      'Applied pre/post filtering to reduce noise in tracking data.',
    ],
    outcomes: ['Interactive capture and trajectory analysis'],
    sources: [researchResume, repo('Tracking-Face-Path')],
  },
  {
    id: 'bat-trajectories',
    title: 'Bat-flight trajectory analysis',
    subtitle: 'Research data for wildlife risk assessment.',
    summary:
      'Analysis of bat tracking data near wind turbines to understand flight behavior and inform wildlife risk assessment.',
    category: 'Research & IoT',
    context: 'Research',
    organization: 'University of Iowa',
    period: '2023',
    tech: ['MATLAB', 'Tracking data', 'Data analysis'],
    contributions: [
      'Analyzed bat-flight trajectories near wind turbines.',
      'Interpreted tracking data to inform research on behavior and turbine interactions.',
    ],
    outcomes: ['Supported wildlife risk-assessment research'],
    sources: [researchResume],
  },
  {
    id: 'green-corridor',
    title: 'Green Corridor',
    subtitle: 'IoT for emergency-vehicle routing.',
    summary:
      'A team-built adaptive traffic-management prototype combining object detection and IoT sensors for emergency-vehicle corridors.',
    category: 'Research & IoT',
    context: 'Academic',
    organization: 'University of Iowa',
    period: '2023',
    tech: ['Raspberry Pi', 'RFID', 'NodeMCU', 'Firebase', 'Machine learning'],
    contributions: [
      'Led the team developing the traffic-management prototype.',
      'Combined object detection, RFID, and connected sensors.',
      'Presented the project at Modern Marvels.',
    ],
    outcomes: ['University of Iowa Modern Marvels presentation'],
    sources: [researchResume],
  },
  {
    id: 'digit-recognition',
    title: 'Handwritten digit recognition',
    subtitle: 'A focused machine-learning experiment.',
    summary: 'A TensorFlow neural-network classifier developed during a 70-hour hackathon.',
    category: 'Research & IoT',
    context: 'Academic',
    organization: 'Hackathon project',
    period: 'Student project',
    tech: ['TensorFlow', 'Neural networks'],
    contributions: ['Trained a classifier for handwritten-digit recognition.'],
    outcomes: ['Hackathon runner-up, as recorded in the research resume'],
    sources: [researchResume],
  },
  {
    id: 'gerontology-chatbot',
    title: 'Gerontology research chatbot',
    subtitle: 'Helping researchers access knowledge.',
    summary:
      'A generative AI chatbot developed to support a gerontology research group’s access to scientific information.',
    category: 'AI & LLM Systems',
    context: 'Research',
    organization: 'University of Iowa',
    period: 'Aug–Nov 2024',
    tech: ['Generative AI', 'Chatbots'],
    contributions: [
      'Led development of a chatbot for the research group.',
      'Worked with faculty on tools supporting scientific knowledge access.',
    ],
    outcomes: ['Research-focused AI application'],
    sources: [resume, researchResume],
  },
  {
    id: 'manufacturing-execution',
    title: 'Manufacturing execution system',
    subtitle: 'Tracking the path from materials to goods.',
    summary:
      'A manufacturing tracking application using a Java desktop interface, barcode technology, and a cloud SQL database.',
    category: 'Automation & Data',
    context: 'Professional',
    organization: 'Simplex Metal Processors',
    period: 'Jun–Aug 2019',
    tech: ['Java Swing', 'Google Cloud SQL', 'Barcodes'],
    contributions: [
      'Developed raw-material-to-finished-goods tracking.',
      'Combined a Swing GUI with barcode-based workflows and cloud SQL storage.',
    ],
    outcomes: ['Digitized manufacturing tracking workflows'],
    sources: [researchResume],
  },
  {
    id: 'simplex-website',
    title: 'Simplex company website',
    subtitle: 'An interactive view of manufacturing.',
    summary:
      'A custom WordPress website featuring interactive 3D models, annotations, maps, and multimedia.',
    category: 'Web Development',
    context: 'Professional',
    organization: 'Simplex Metal Processors',
    period: 'Aug 2019–May 2020',
    tech: ['WordPress', 'PHP', 'CSS', '3D models', 'Google Maps'],
    contributions: [
      'Developed a custom child theme.',
      'Integrated interactive 3D models, annotations, and Google Maps.',
    ],
    outcomes: ['A custom company web presence'],
    sources: [resume, researchResume],
  },
  {
    id: 'chetaru-websites',
    title: 'Client website development',
    subtitle: 'Practical web delivery for businesses.',
    summary: 'WordPress website development and ongoing updates for client businesses at Chetaru.',
    category: 'Web Development',
    context: 'Professional',
    organization: 'Chetaru Web Link',
    period: 'Jun–Aug 2019',
    tech: ['WordPress', 'PHP', 'WooCommerce', 'Elementor', 'Jetpack'],
    contributions: [
      'Built custom templates and plugins.',
      'Maintained weekly updates across client websites.',
    ],
    outcomes: ['Contributed to 10+ client sites'],
    sources: [resume],
  },
  {
    id: 'pocket-desk',
    title: 'Pocket Desk',
    subtitle: 'An early foundation in web applications.',
    summary:
      'A Java social-networking web-service project developed during an early web-development role.',
    category: 'Full-Stack Applications',
    context: 'Professional',
    organization: 'Ypsilon IT Solutions',
    period: 'Dec 2018–Jan 2019',
    tech: ['Java', 'Web development'],
    contributions: ['Created a social-networking web service using Java.'],
    outcomes: ['Early application-development experience'],
    sources: [researchResume],
  },
]
export const featuredProjects = projects.filter((p) => p.featured)
export function filterProjects(query: string, category: string, context: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return projects.filter(
    (p) =>
      (category === 'All work' || p.category === category) &&
      (context === 'All contexts' || p.context === context) &&
      terms.every((term) =>
        [p.title, p.summary, p.organization, p.category, ...p.tech]
          .join(' ')
          .toLowerCase()
          .includes(term),
      ),
  )
}
