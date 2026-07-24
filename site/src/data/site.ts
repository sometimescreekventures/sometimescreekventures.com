/**
 * Single source of truth for all site content.
 * The contact email is defined here and nowhere else.
 * Every fact traces to Sean's own resumes, brag docs, and repos — nothing invented.
 */

export const site = {
  name: 'Sometimes Creek Ventures',
  legalName: 'Sometimes Creek Ventures LLC',
  url: 'https://sometimescreekventures.com',
  description:
    'Sean Denton — engineer. I take systems from nothing to production and run them. Rocket telemetry, drive-thru voice AI, HIPAA cardiac monitoring, fracking pumps, 250K-player games. It’s just me. That’s the point.',
} as const;

export const person = {
  name: 'Sean Denton',
  location: 'Georgetown, TX · works everywhere',
  patent: 'US 8,887,290 B1 — content protection for browser-based viewers',
  education: 'B.S. Petroleum Engineering, The University of Texas at Austin',
} as const;

export const contact = {
  email: 'sean@sometimescreekventures.com',
  github: 'https://github.com/sometimescreekventures',
  linkedin: 'https://www.linkedin.com/in/sean-denton-ba02433/',
} as const;

/** The ticker: twenty-plus years of subject matter. */
export const ticker = [
  'Rocket telemetry',
  'Drive-thru voice AI',
  'Human hearts',
  'Fracking pumps',
  'Military radios',
  'Grain carts',
  'TSA PreCheck',
  '250K-player games',
  'AI agent fleets',
  'SMS dungeon crawlers',
  'Local speech AI',
] as const;

/**
 * The List — real things, told straight. Names appear only where Sean's own
 * public materials name them; everyone else stays anonymous on purpose.
 */
export const stories = [
  {
    hook: 'Rocket data',
    story:
      'Built the backend that ingests and processes Blue Origin’s proprietary rocket test telemetry — real-time, large-scale, locked down.',
  },
  {
    hook: 'A drive-thru that listens',
    story:
      'R&D for Chick-fil-A: a voice-ordering system built in Swift on OpenAI and open-source LLMs, backend on Kubernetes — plus AI and VR prototypes for visualizing the store itself.',
  },
  {
    hook: 'Human hearts',
    story:
      'A HIPAA cardiovascular remote-monitoring platform: five production Go services, device telemetry streaming through Redis hot storage into S3 archive, live clinical dashboards — designed, built, and operated in production alone. Deploys never blip a live monitoring session.',
  },
  {
    hook: 'The 36-second request',
    story:
      'A mobile-ordering API was timing out for one request in ten. Built the k6 load-test platform and Grafana observability from scratch, found the thread-pool starvation, and drove p95s from 36 seconds to 95 milliseconds — proven against baselines before every merge.',
  },
  {
    hook: '220 days → 43',
    story:
      'A client had a 220-dev-day estimate on the table. Audited what already existed before writing anything new — the real number was 23–43 days, validated by their own engineers.',
  },
  {
    hook: 'A Fortune-5 paved road',
    story:
      'At CVS Health, leading the squad building the platform that provisions Google Cloud services with zero manual steps — security by default, 15+ engineers shipping it.',
  },
  {
    hook: 'The FBI is on line one',
    story:
      'For CLEAR: the microservice line that registers travelers for TSA PreCheck, integrating with the FBI through a third-party vendor — deployed to AWS GovCloud.',
  },
  {
    hook: 'Fracking pumps over RS-232',
    story:
      'Petroleum engineer by degree, so: rescued a buggy fracking-truck pump-control system — rewrote the Java agents talking to hardware over UDP, RS-232, and TCP.',
  },
  {
    hook: 'Tractors on the internet',
    story:
      'Grain carts run embedded Linux with no connectivity — so built the iOS app that finds them over Bluetooth LE and shares the iPad’s connection with the tractor.',
  },
  {
    hook: 'Radios for soldiers',
    story:
      'For Harris: the app a soldier uses to configure a truckload of military radios at once instead of one at a time — wrote the entire UI.',
  },
  {
    hook: '250,000 players',
    story:
      'As CTO of a gaming startup, took a prototype to production: a real-time multiplayer social game sustaining 250K+ users and hundreds of simultaneous games.',
  },
  {
    hook: 'Survives AWS going down',
    story:
      'For Comcast: a device-telemetry microservice designed to finish its job even while the cloud under it is failing — plus CI/CD where entire environments are created and destroyed in minutes.',
  },
  {
    hook: 'Days of HR work → one click',
    story:
      'For Zappos: a one-source-of-truth system wiring HR, IT, payroll, and billing together — onboarding an employee went from days of emails to a single action.',
  },
  {
    hook: 'A dungeon crawler over SMS',
    story:
      'Built a serverless AI assistant that lives entirely in text messages — including a full roguelike dungeon crawler you play by SMS, powered by Claude on Amazon Bedrock.',
  },
  {
    hook: 'Talking instead of typing',
    story:
      'Built and released blurt and yap: push-to-talk dictation for macOS and Linux that runs entirely on-device, sub-second, no cloud — because talking to AI is half the job now and typing is the bottleneck.',
  },
] as const;

/** The operating method, in his words. */
export const method = {
  loop: ['Baseline', 'Change', 'Load test', 'Prove', 'Promote'],
  lines: [
    'Measure before and after touching anything. Flag guesses as guesses.',
    'AI-augmented delivery, with accountability: I direct the agents, run the tests, and own every commit.',
    'Audit what exists before estimating what doesn’t.',
  ],
} as const;

/** Stack, grouped the way he actually reaches for it. */
export const stack = [
  {
    label: 'Languages',
    note: 'Right tool, right layer — comfortable owning all of them at once.',
    items: ['Go', 'TypeScript', 'Python', 'Java / Spring Boot', 'Swift', 'Node.js'],
  },
  {
    label: 'Cloud',
    note: 'AWS deep since before CDK existed; GCP at Fortune-5 scale; GovCloud when it has to be.',
    items: [
      'AWS (CDK, IoT Core, ECS/Fargate, Lambda, DynamoDB, VPC & Client VPN, Step Functions, Cognito, GovCloud)',
      'Google Cloud (GKE, Vertex AI, PubSub)',
      'Azure DevOps · AKS',
    ],
  },
  {
    label: 'Infrastructure as code',
    note: 'If it isn’t in code, it doesn’t exist.',
    items: ['CDK', 'Terraform', 'CDKTF', 'Kubernetes (EKS · AKS · GKE)', 'Docker', 'ArgoCD'],
  },
  {
    label: 'AI',
    note: 'Cloud APIs to fully local models — shipped, not demoed.',
    items: [
      'OpenAI & open-source LLMs',
      'Amazon Bedrock (Claude)',
      'On-device speech (MLX, Parakeet, ONNX)',
      'Multi-agent orchestration',
    ],
  },
  {
    label: 'Reliability & proof',
    note: 'Every claim measured: load tests, dashboards, baselines.',
    items: ['k6', 'Grafana + InfluxDB', 'OpenTelemetry', 'Temporal', 'p95/p99 tail analysis', 'SLOs'],
  },
  {
    label: 'Data & realtime',
    note: 'MQTT to Redis to S3 — hot paths and cold storage.',
    items: ['MQTT', 'Redis', 'DynamoDB', 'Postgres', 'WebSockets / SSE', 'gRPC', 'Spark'],
  },
] as const;

/** What's on the bench right now. */
export const now = [
  { what: 'Leading platform automation for CVS Health’s Google Cloud transformation' },
  { what: 'Running a production HIPAA cardiac-monitoring platform, solo' },
  {
    what: 'Open source: blurt (macOS) and yap (Linux) — local push-to-talk dictation',
    links: [
      { label: 'blurt', href: 'https://github.com/sometimescreekventures/blurt' },
      { label: 'yap', href: 'https://github.com/sometimescreekventures/yap' },
    ],
  },
  {
    what: 'The home lab: local video generation, full-duplex voice models, real-time sound classification, a fleet of orchestrated coding agents',
  },
] as const;

/** Names from Sean's own public materials. */
export const clients = [
  'Blue Origin',
  'CVS Health',
  'Chick-fil-A',
  'Comcast',
  'General Motors',
  'Clear',
  'Amtrak',
  'Kubota',
  'Harris',
  'Zappos',
  'Walmart',
  'T-Mobile',
  'Trane',
  'iMemories',
  'Cardio',
  'Zonal',
] as const;
