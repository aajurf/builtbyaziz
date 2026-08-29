"use client";

import { useMemo, useState } from "react";
import {
  CAPS,
  AREA_LABEL,
  PROOF_LABEL,
  type Area,
  type Capability,
} from "./work";

const FILTERS: {
  key: string;
  label: string;
  match: (c: Capability) => boolean;
}[] = [
  { key: "all", label: "All", match: () => true },
  ...(Object.keys(AREA_LABEL) as Area[]).map((a) => ({
    key: a,
    label: AREA_LABEL[a],
    match: (c: Capability) => c.area === a,
  })),
];

export default function Systems() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];

  const shown = useMemo(
    () => CAPS.map((c, i) => ({ c, i })).filter(({ c }) => active.match(c)),
    [active]
  );

  return (
    <>
      <div className="filters">
        <div className="filter-row">
          {FILTERS.map((f) => {
            const n = CAPS.filter(f.match).length;
            if (!n) return null;
            return (
              <button
                key={f.key}
                type="button"
                className={f.key === filter ? "chipbtn is-on" : "chipbtn"}
                onClick={() => {
                  setFilter(f.key);
                  setOpen(null);
                }}
                aria-pressed={f.key === filter}
              >
                {f.label}
                <em>{n}</em>
              </button>
            );
          })}
        </div>
        <span className="filter-count">
          {shown.length} shown / {CAPS.length} total
        </span>
      </div>

      <div className="grid">
        {shown.map(({ c, i }) => {
          const isOpen = open === c.title;

          return (
            <article
              key={c.title}
              className={isOpen ? "tile is-open" : "tile"}
            >
              <button
                type="button"
                className="tile-hit"
                onClick={() => setOpen(isOpen ? null : c.title)}
                aria-expanded={isOpen}
              >
                <span className="tile-bar">
                  <span className={`tile-state is-${c.proof}`}>
                    <span className="led-sm" aria-hidden="true" />
                    {PROOF_LABEL[c.proof]}
                  </span>
                  <span className="tile-idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <span className="tile-title">{c.title}</span>

                <span className="tile-outcome">{c.outcome}</span>

                {!isOpen && (
                  <span className="tile-area">{AREA_LABEL[c.area]}</span>
                )}

                <span className="tile-toggle" aria-hidden="true">
                  {isOpen ? "Collapse —" : "What you get +"}
                </span>
              </button>

              {isOpen && (
                <div className="tile-detail">
                  <p className="detail-lead">What you get</p>
                  <ul className="delivers">
                    {c.delivers.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>

                  <dl className="tel">
                    <div className="tel-row">
                      <dt>Area</dt>
                      <dd>{AREA_LABEL[c.area]}</dd>
                    </div>
                    {c.provenIn ? (
                      <div className="tel-row is-outcome">
                        <dt>Proven in</dt>
                        <dd>{c.provenIn}</dd>
                      </div>
                    ) : (
                      <div className="tel-row">
                        <dt>Status</dt>
                        <dd>
                          Built to order. No public example to point at yet.
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
