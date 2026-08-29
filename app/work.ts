export type Kind = "automation" | "ai" | "product" | "vision";

export type Mod = {
  /** Running state — drives the LED colour only, not the filters. */
  state: "live" | "shipped" | "building";
  /** What the build actually is — this is the filter axis. */
  kind: Kind;
  title: string;
  body: string[];
  pipeline: string[];
  runtime: string[];
  outcome: string;
  scope?: string;
};

export const STATE_LABEL: Record<Mod["state"], string> = {
  live: "Running in production",
  shipped: "Shipped",
  building: "In build",
};

export const KIND_LABEL: Record<Kind, string> = {
  automation: "Automation",
  ai: "AI and agents",
  product: "Full-stack product",
  vision: "Vision",
};

/** Areas I am building into next. Named by area, not by client or product. */
export const EXPLORING: { label: string; note: string }[] = [
  {
    label: "AR and spatial vision",
    note: "Detections anchored to real-world position and drawn in place on a live camera feed.",
  },
  {
    label: "3D digital twins",
    note: "Standing sites and facilities up as live models fed by their own sensors and cameras.",
  },
  {
    label: "Edge inference hardware",
    note: "Multi-sensor rigs that run their models on site, for work where footage cannot leave the premises.",
  },
  {
    label: "Custom model training",
    note: "Models trained on a client's own material rather than bent into shape with prompting.",
  },
];

export const MODS: Mod[] = [
  {
    state: "live",
    kind: "automation",
    title: "Lead capture, scoring and CRM pipeline",
    body: [
      "Inbound leads used to sit in an inbox until somebody got to them. Response times ran into hours and some leads were never logged at all.",
      "One webhook now catches every submission. A scoring step grades each lead on service type, budget signal and completeness, writes it to the CRM with the score attached, sends the lead a branded reply, and alerts the team with the score already applied. Duplicate protection on every write means retries never create a second record.",
    ],
    pipeline: ["Form submit", "Validate", "Score", "CRM", "Auto-reply", "Team alert"],
    runtime: ["n8n queue mode", "Postgres", "Redis", "Google Sheets", "SMTP"],
    outcome: "Response time from hours to under thirty seconds.",
  },
  {
    state: "live",
    kind: "automation",
    title: "Client onboarding autopilot",
    body: [
      "Onboarding meant the same fifteen manual steps every time. Copy the details across, write the welcome, notify the team, remember to mark it done.",
      "Approving a lead now fires the whole sequence. The record moves to the client roster with every field carried across, a personalised welcome goes out, the team gets an internal brief, and the source row is marked complete on the way out so the workflow is safe to re-run.",
    ],
    pipeline: ["Approve", "Create record", "Welcome", "Internal brief", "Close out"],
    runtime: ["n8n", "Sheets trigger", "SMTP", "Idempotent writes"],
    outcome: "Three hours of manual work per client down to fifteen minutes of review.",
  },
  {
    state: "live",
    kind: "ai",
    title: "Support chatbot on self-hosted inference",
    body: [
      "Off-the-shelf chatbots either invent answers about your business or meter you per message at a rate that breaks the moment volume arrives.",
      "This one is grounded in the company's own knowledge base and runs on a self-hosted inference backend. It holds memory across a session, answers from real content, says so when it does not know, and flags the conversation to a human before replying when a question needs one.",
    ],
    pipeline: ["Message", "Load context", "Inference", "Parse", "Escalate?", "Reply"],
    runtime: ["n8n", "Self-hosted inference", "Prompt construction", "Escalation routing"],
    outcome: "Grounded answers with a human handoff and no per-message fee.",
  },
  {
    state: "live",
    kind: "ai",
    title: "Command Vault — shared knowledge base for AI agents",
    body: [
      "An agent is only as useful as what it can read, and most teams keep their knowledge scattered across drives, inboxes and people's heads.",
      "This is a multi-tenant knowledge base that people and agents both write to. The team edits in a normal notes app on their own machines. Changes sync through Git to a server where the agent reads and writes the same files through a filesystem protocol layer. The dashboard runs as a managed service, reachable over a private network rather than the public internet.",
    ],
    pipeline: ["Edit local", "Git sync", "Server", "Agent read", "Agent write", "Team"],
    runtime: ["Obsidian", "Git", "DigitalOcean", "systemd", "MCP", "Tailscale"],
    outcome: "One source of truth for people and agents, syncing both ways every two minutes.",
  },
  {
    state: "building",
    kind: "product",
    title: "Property management platform for a California brokerage",
    body: [
      "Property software takes custody of rent. The money sits in a third party's account, payouts lag, and the brokerage carries liability for funds it never sees.",
      "Here rent moves straight from tenant to owner. The platform routes and records every transaction but never holds a dollar. Around that sits maintenance intake with vendor assignment, state compliance deadlines tracked per property, and an owner portal reporting against live market data. The referring agent is a first-class entity, so whoever brought the owner in stays attached to the relationship.",
    ],
    pipeline: ["Tenant pays", "Direct route", "Owner account", "Ledger", "Owner report"],
    runtime: ["Next.js", "TypeScript", "Prisma", "Supabase", "Stripe Connect"],
    outcome: "Direct tenant-to-owner rent flow with zero custody of funds.",
    scope: "Client engagement, in build.",
  },
  {
    state: "shipped",
    kind: "product",
    title: "Mustaqir SA — short-stay booking platform",
    body: [
      "Short-stay hosting runs on a patchwork of listing sites, spreadsheets and message threads. The operator never sees the whole portfolio in one place, and every property is managed one tab at a time.",
      "Mustaqir puts guest-facing booking and operator control in the same system. Guests browse properties, check real availability and book. Behind that sits an admin dashboard covering the whole portfolio: listings and pricing, the booking calendar, guest records and the revenue view, so the operator runs every unit from one screen instead of chasing each one separately.",
    ],
    pipeline: ["Browse", "Availability", "Book", "Confirm", "Admin dashboard"],
    runtime: ["Next.js", "TypeScript", "Supabase", "Stripe"],
    outcome: "Guest booking and full portfolio administration in a single platform.",
  },
  {
    state: "shipped",
    kind: "product",
    title: "Pinnaclicks — content repurposing platform",
    body: [
      "One long video should become twenty pieces of content. By hand that costs most of a working day.",
      "Users upload a video or connect a feed. The platform transcribes it, finds the strongest moments, cuts the clips and writes platform-specific copy for a dozen channels. Long renders run through a background queue so they never block the interface, and credits are metered per operation rather than per plan.",
    ],
    pipeline: ["Upload", "Transcribe", "Find moments", "Cut", "Write copy", "Queue"],
    runtime: ["Next.js", "Supabase", "BullMQ", "Claude API", "Whisper", "Railway"],
    outcome: "Queue architecture, credit metering and multi-platform publishing.",
  },
  {
    state: "shipped",
    kind: "vision",
    title: "Video processing microservice",
    body: [
      "Turning landscape video into vertical clips means either cropping blind and cutting the speaker's head off, or paying a vendor per minute of footage.",
      "This tracks the speaker frame by frame and moves the crop window to follow them, with smoothing on both the tracker and the crop so the frame never jitters. It compares frames to find natural cut points and burns styled captions from the transcript, including word-by-word highlighting. Runs as its own container, called over HTTP.",
    ],
    pipeline: ["Video in", "Track", "Reframe 9:16", "Scene cuts", "Captions", "Clips out"],
    runtime: ["Python", "Flask", "OpenCV", "FFmpeg", "Docker"],
    outcome: "Face-tracked reframing and five caption styles with no per-minute cost.",
  },
  {
    state: "live",
    kind: "vision",
    title: "Qamara Intel — computer vision at the edge",
    body: [
      "Some vision work cannot leave the site. Data residency, patchy connectivity and latency all rule out shipping frames to a cloud API.",
      "Detection models run locally on the customer's own hardware so footage never leaves the premises. Around the detection layer sits an ensemble that votes across models, a rules engine written to local operating standards, and per-deployment licensing. Includes a georeferenced AR overlay that renders buried utility lines in position on a live camera feed, plus sensor selection and hardware specification for multi-sensor rigs.",
    ],
    pipeline: ["Camera", "Edge inference", "Ensemble vote", "Rules", "Geo-anchor", "AR overlay"],
    runtime: ["Python", "YOLOv8", "Faster R-CNN", "OpenCV", "GPS anchoring", "Licensing"],
    outcome: "Detection, spatial anchoring and hardware specification, deployed and running on site.",
    scope: "My own venture, running in production.",
  },
];
