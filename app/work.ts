export type Area = "automation" | "ai" | "product" | "vision";

/**
 * "proven" means there is delivered work behind it and the entry names it.
 * "ready" means I build it but have nothing public to point at yet — the
 * distinction is deliberate, so nothing here reads as a claim it isn't.
 */
export type Proof = "proven" | "ready";

export type Capability = {
  area: Area;
  proof: Proof;
  title: string;
  /** The sell: what the client ends up with. */
  outcome: string;
  /** Concrete deliverables, shown when the tile opens. */
  delivers: string[];
  /** The real build behind it. Only set when proof is "proven". */
  provenIn?: string;
};

export const AREA_LABEL: Record<Area, string> = {
  automation: "Automation",
  ai: "AI and agents",
  product: "Full-stack product",
  vision: "Vision",
};

export const PROOF_LABEL: Record<Proof, string> = {
  proven: "Built and running",
  ready: "Built to order",
};

export const CAPS: Capability[] = [
  // ---------- automation ----------
  {
    area: "automation",
    proof: "proven",
    title: "Lead capture and response",
    outcome:
      "Every enquiry scored, logged and answered before your competitor picks up the phone.",
    delivers: [
      "One intake path for every form, inbox and channel you use",
      "Scoring on service type, budget signal and completeness",
      "Branded auto-reply to the lead, scored alert to your team",
      "Duplicate protection, so a retry never doubles a record",
    ],
    provenIn:
      "A live lead pipeline that took response time from hours to under thirty seconds.",
  },
  {
    area: "automation",
    proof: "proven",
    title: "Onboarding and handoff sequences",
    outcome:
      "The same fifteen steps run themselves every time, without anyone remembering to start them.",
    delivers: [
      "One approval fires the whole downstream sequence",
      "Records created with every field carried across",
      "Personalised client welcome and an internal brief",
      "Safe to re-run — each step closes itself out",
    ],
    provenIn:
      "An onboarding autopilot that cut three hours of manual work per client to fifteen minutes of review.",
  },
  {
    area: "automation",
    proof: "ready",
    title: "Back-office and reporting runs",
    outcome:
      "Recurring reports, reconciliations and data moves happen on schedule instead of on someone's to-do list.",
    delivers: [
      "Scheduled pulls from the systems you already pay for",
      "Reconciliation with the mismatches flagged, not buried",
      "Reports delivered where the team already looks",
      "Retries and alerting, so a silent failure stays impossible",
    ],
  },

  // ---------- ai and agents ----------
  {
    area: "ai",
    proof: "proven",
    title: "Customer-facing support assistants",
    outcome:
      "Your support queue answered in seconds, around the clock, without a bot inventing your policy.",
    delivers: [
      "Grounded in your knowledge base, not the open internet",
      "Memory across a conversation, not one-shot replies",
      "Says it does not know instead of inventing an answer",
      "Escalation to a person before replying when it matters",
    ],
    provenIn:
      "A support assistant on self-hosted inference — grounded answers, human handoff, no per-message fee.",
  },
  {
    area: "ai",
    proof: "proven",
    title: "The knowledge layer agents run on",
    outcome:
      "The plumbing every other agent depends on: one store your team and your tools both write to.",
    delivers: [
      "Multi-tenant store the team edits in a normal notes app",
      "Two-way sync between local machines and the server",
      "Agent read and write access over a protocol layer",
      "Reachable over a private network, not the public internet",
    ],
    provenIn:
      "Command Vault — people and agents on one source of truth, syncing both ways every two minutes.",
  },
  {
    area: "ai",
    proof: "proven",
    title: "Lead triage that reads the free text",
    outcome:
      "Every enquiry scored, summarised and routed the moment it lands, from the prose a prospect actually typed.",
    delivers: [
      "Scored and summarised before a rep opens the record",
      "Reads whichever fields already hold your unstructured text",
      "Routing rules you change without a deployment",
      "Your provider account and your key — the inference bill stays yours",
    ],
    provenIn:
      "AI Lead Triage — the Industry field empty on every demo record, and it still knew which one was an eleven-practice dental group against a compliance deadline.",
  },
  {
    area: "ai",
    proof: "ready",
    title: "Document and intake processing",
    outcome:
      "Structured data pulled out of PDFs, forms and inboxes and written straight into your systems.",
    delivers: [
      "Extraction from scans, PDFs and email attachments",
      "Validation against the rules your business actually runs on",
      "Low-confidence items routed to a person, not pushed through",
      "Written into your CRM or database as finished records",
    ],
  },

  {
    area: "ai",
    proof: "ready",
    title: "Voice agents that answer the phone",
    outcome:
      "The calls nobody picks up answered, qualified and booked, instead of a voicemail no one returns.",
    delivers: [
      "Answers every call on the first ring, including out of hours",
      "Qualifies against your criteria, not a generic script",
      "Books straight into the calendar the team already uses",
      "Hands to a person mid-call when it should, context attached",
    ],
  },

  // ---------- full-stack product ----------
  {
    area: "product",
    proof: "proven",
    title: "Booking and marketplace platforms",
    outcome:
      "Availability, payment and an operator view over the whole portfolio in one system.",
    delivers: [
      "Guest-facing browsing and real availability",
      "Booking and confirmation end to end",
      "Admin dashboard across every unit and listing",
      "Calendar, pricing, guest records and the revenue view",
    ],
    provenIn:
      "Mustaqir SA — guest booking and full portfolio administration in a single platform.",
  },
  {
    area: "product",
    proof: "proven",
    title: "Payments and money movement",
    outcome:
      "Money routed and recorded end to end, without your business taking custody of it.",
    delivers: [
      "Direct payer-to-payee routing on connected accounts",
      "A ledger that records every movement",
      "Payouts that do not sit in a third party's float",
      "Compliance deadlines tracked against each record",
    ],
    provenIn:
      "A brokerage platform moving rent straight from tenant to owner with zero custody of funds.",
  },
  {
    area: "product",
    proof: "proven",
    title: "Client portals and dashboards",
    outcome:
      "The one screen your client logs into instead of emailing you for an update.",
    delivers: [
      "Role-aware access for owners, staff and clients",
      "Live reporting against real data, not a monthly export",
      "Background queues so long jobs never block the interface",
      "Usage metered per operation where that is the model",
    ],
    provenIn:
      "Owner portals and the Pinnaclicks platform — queue architecture, credit metering and live reporting.",
  },

  // ---------- vision ----------
  {
    area: "vision",
    proof: "proven",
    title: "Video processing at scale",
    outcome:
      "Footage reframed, cut and captioned automatically, with no per-minute vendor bill.",
    delivers: [
      "Speaker tracking with the crop window following them",
      "Vertical reframing that never cuts the head off",
      "Scene detection for natural cut points",
      "Styled captions burned in, word by word",
    ],
    provenIn:
      "A processing microservice doing face-tracked reframing and five caption styles at no per-minute cost.",
  },
  {
    area: "vision",
    proof: "proven",
    title: "Detection models on your own hardware",
    outcome:
      "Inference that runs on site, so footage never leaves the premises.",
    delivers: [
      "Models running locally on your own machines",
      "An ensemble that votes across models rather than trusting one",
      "A rules layer written to your operating standards",
      "Per-deployment licensing and update path",
    ],
    provenIn:
      "Qamara Intel — detection and spatial anchoring, deployed and running on site.",
  },
  {
    area: "vision",
    proof: "proven",
    title: "Camera and sensor system design",
    outcome:
      "The right sensors, placement and hardware specified before anyone writes a line of code.",
    delivers: [
      "Sensor selection against the actual detection job",
      "Multi-sensor rig specification and placement",
      "Compute sized to the models it has to run",
      "Georeferencing and anchoring where position matters",
    ],
    provenIn:
      "Hardware specification and sensor selection for multi-sensor rigs, built in-house.",
  },
];

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
