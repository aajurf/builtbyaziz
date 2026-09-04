"use client";

import { useState } from "react";

type Scenario = {
  id: string;
  /** How the reader recognises their own situation. */
  entry: string;
  /** The state they are in now, in their words. */
  problem: string;
  steps: string[];
  outcome: string;
  /**
   * "proven" must name the delivered build in `from`. "ready" says plainly
   * that there is nothing public to point at — no scenario here implies work
   * that does not exist.
   */
  proof: "proven" | "ready";
  from?: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "leads",
    entry: "Leads piling up",
    problem:
      "Enquiries land in an inbox and sit there. Some get answered in hours, some never get logged at all.",
    steps: ["Form submit", "Validate", "Score", "Write to CRM", "Auto-reply", "Team alert"],
    outcome: "Every lead answered in under thirty seconds, scored before anyone opens it.",
    proof: "proven",
    from: "Lead capture and response",
  },
  {
    id: "triage",
    entry: "Leads nobody has read",
    problem:
      "Every enquiry arrives as a paragraph of prose. Somebody has to read all of them to find the three worth calling today.",
    steps: ["Lead lands", "Read the text", "Score", "Summarise", "Route", "Rep opens it"],
    outcome:
      "The three worth calling sit at the top, with the reason written underneath them.",
    proof: "proven",
    from: "Lead triage that reads the free text",
  },
  {
    id: "video",
    entry: "Hours of raw video",
    problem:
      "One long recording should become twenty pieces of content. By hand it costs most of a working day.",
    steps: ["Ingest", "Transcribe", "Find moments", "Reframe 9:16", "Burn captions", "Clips out"],
    outcome: "A day of editing becomes a queue that runs itself, with no per-minute vendor bill.",
    proof: "proven",
    from: "Video processing at scale",
  },
  {
    id: "onboarding",
    entry: "Manual onboarding",
    problem:
      "The same fifteen steps every time a client signs. Copy the details, write the welcome, tell the team, remember to close it out.",
    steps: ["Approve", "Create record", "Carry fields", "Welcome", "Internal brief", "Close out"],
    outcome: "Three hours of manual work per client down to fifteen minutes of review.",
    proof: "proven",
    from: "Onboarding and handoff sequences",
  },
  {
    id: "saas",
    entry: "A SaaS to build",
    problem:
      "You have the product and the customers. What you do not have is the platform underneath — accounts, billing, and the long jobs that must not block the interface.",
    steps: ["Sign up", "Workspace", "Billing", "Job queue", "Usage meter", "Dashboard"],
    outcome:
      "A product your customers log into, metered per use, with the heavy work off the critical path.",
    proof: "proven",
    from: "Pinnaclicks — queue architecture, credit metering and multi-platform publishing",
  },
  {
    id: "bookings",
    entry: "Bookings in spreadsheets",
    problem:
      "Listings sit on one site, the calendar on another, guest messages in a third. Nobody sees the whole portfolio at once, and every property gets run one browser tab at a time.",
    steps: ["Browse", "Live availability", "Book", "Confirm", "Portfolio view"],
    outcome:
      "Guests book themselves in while you run every unit in the portfolio from one screen.",
    proof: "proven",
    from: "Mustaqir SA — a short-stay platform for the Saudi market, guest booking and full portfolio administration in one system",
  },
  {
    id: "agents",
    entry: "Agents that must act",
    problem:
      "An agent that only chats is a demo. To be worth anything it has to read your real material and write back into the systems your team already uses.",
    steps: ["Ground", "Retrieve", "Reason", "Act", "Write back", "Escalate"],
    outcome:
      "Agents working from one source of truth, acting in your systems, handing to a person when it matters.",
    proof: "proven",
    from: "Command Vault — people and agents on one source of truth",
  },
  {
    id: "payments",
    entry: "Money to move",
    problem:
      "Funds move through your business and you carry the liability for money you never wanted to hold in the first place.",
    steps: ["Payer", "Route", "Payee account", "Ledger", "Reconcile", "Report"],
    outcome: "Money routed and recorded end to end, without your business taking custody of it.",
    proof: "proven",
    from: "A brokerage platform moving rent straight from tenant to owner",
  },
  {
    id: "cameras",
    entry: "Cameras on site",
    problem:
      "The footage cannot leave the premises. Data residency, patchy connectivity and latency all rule out a cloud API.",
    steps: ["Camera", "Edge inference", "Ensemble vote", "Rules layer", "Anchor", "Alert"],
    outcome: "Detection running on your own hardware. Footage never leaves the building.",
    proof: "proven",
    from: "Qamara Intel — detection and spatial anchoring, running on site",
  },
  {
    id: "documents",
    entry: "Documents to key in",
    problem:
      "PDFs, forms and email attachments arrive, and somebody retypes them into a system by hand every single day.",
    steps: ["Intake", "Extract", "Validate", "Route the unsure", "Write record"],
    outcome:
      "Structured records straight into your systems, with only the uncertain ones sent to a person.",
    proof: "ready",
  },
  {
    id: "releases",
    entry: "Releases breaking things",
    problem:
      "Every deploy is a held breath. Something that worked last week quietly stops working, and a customer finds it before you do.",
    steps: ["Commit", "Build", "Test suite", "Smoke run", "Gate", "Deploy"],
    outcome: "A pipeline that blocks the release, instead of a customer finding the bug for you.",
    proof: "ready",
  },
];

/**
 * Connector between two steps: a vertical trace with a rounded jog, the way
 * a board routes around a pad. pathLength=1 lets the draw animation use a
 * dasharray of 1 regardless of the path's real length.
 */
function Connector({ flip }: { flip: boolean }) {
  const d = flip
    ? "M 30 0 L 30 14 Q 30 22 38 22 L 62 22 Q 70 22 70 30 L 70 48"
    : "M 70 0 L 70 14 Q 70 22 62 22 L 38 22 Q 30 22 30 30 L 30 48";

  return (
    <svg
      className="trace-link"
      viewBox="0 0 100 48"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="trace-link-path" d={d} pathLength={1} />
    </svg>
  );
}

export default function Trace() {
  const [active, setActive] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0];

  return (
    <div className="trace">
      <div className="trace-pick">
        <span className="trace-pick-label">Start where you are</span>
        <div className="trace-pick-row">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={s.id === active ? "tracebtn is-on" : "tracebtn"}
              onClick={() => setActive(s.id)}
              aria-pressed={s.id === active}
            >
              {s.entry}
            </button>
          ))}
        </div>
      </div>

      {/* Keyed on the scenario so switching remounts the list and the draw
          animation replays from the top instead of sitting finished. */}
      <div className="trace-run" key={scenario.id}>
        <p className="trace-problem">{scenario.problem}</p>

        <ol className="trace-steps">
          {scenario.steps.map((step, i) => (
            <li
              className="trace-step"
              key={step}
              style={{ "--i": i } as React.CSSProperties}
            >
              {i > 0 && <Connector flip={i % 2 === 1} />}
              <span className="trace-node">
                <span className="trace-dot" aria-hidden="true" />
                <span className="trace-label">{step}</span>
                <span className="trace-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div
          className="trace-out"
          style={{ "--i": scenario.steps.length } as React.CSSProperties}
        >
          <span className="trace-out-tag">Outcome</span>
          <p className="trace-out-text">{scenario.outcome}</p>
          <p className="trace-out-from">
            {scenario.proof === "proven"
              ? `Drawn from a build that shipped — ${scenario.from}.`
              : "Built to order. No public example to point at yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
