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
  /** The delivered build this pipeline is drawn from. */
  from: string;
};

/**
 * Every pipeline here is a real one. Nothing in this section describes a
 * system that has not been built and run.
 */
const SCENARIOS: Scenario[] = [
  {
    id: "leads",
    entry: "Leads piling up",
    problem:
      "Enquiries land in an inbox and sit there. Some get answered in hours, some never get logged at all.",
    steps: ["Form submit", "Validate", "Score", "Write to CRM", "Auto-reply", "Team alert"],
    outcome: "Every lead answered in under thirty seconds, scored before anyone opens it.",
    from: "Lead capture and response",
  },
  {
    id: "video",
    entry: "Hours of raw video",
    problem:
      "One long recording should become twenty pieces of content. By hand it costs most of a working day.",
    steps: ["Ingest", "Transcribe", "Find moments", "Reframe 9:16", "Burn captions", "Clips out"],
    outcome: "A day of editing becomes a queue that runs itself, with no per-minute vendor bill.",
    from: "Video processing at scale",
  },
  {
    id: "onboarding",
    entry: "Manual onboarding",
    problem:
      "The same fifteen steps every time a client signs. Copy the details, write the welcome, tell the team, remember to close it out.",
    steps: ["Approve", "Create record", "Carry fields", "Welcome", "Internal brief", "Close out"],
    outcome: "Three hours of manual work per client down to fifteen minutes of review.",
    from: "Onboarding and handoff sequences",
  },
  {
    id: "cameras",
    entry: "Cameras on site",
    problem:
      "The footage cannot leave the premises. Data residency, patchy connectivity and latency all rule out a cloud API.",
    steps: ["Camera", "Edge inference", "Ensemble vote", "Rules layer", "Anchor", "Alert"],
    outcome: "Detection running on your own hardware. Footage never leaves the building.",
    from: "Detection models on your own hardware",
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
            Drawn from a build that shipped — {scenario.from}.
          </p>
        </div>
      </div>
    </div>
  );
}
