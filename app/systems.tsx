"use client";

import { useMemo, useState } from "react";
import { MODS, STATE_LABEL, type Mod } from "./work";

const FILTERS: { key: string; label: string; match: (m: Mod) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "live", label: "Production", match: (m) => m.state === "live" },
  { key: "shipped", label: "Shipped", match: (m) => m.state === "shipped" },
  { key: "building", label: "In build", match: (m) => m.state === "building" },
  { key: "rnd", label: "Research", match: (m) => m.state === "rnd" },
];

export default function Systems() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];

  const shown = useMemo(
    () => MODS.map((m, i) => ({ m, i })).filter(({ m }) => active.match(m)),
    [active]
  );

  return (
    <>
      <div className="filters">
        <div className="filter-row">
          {FILTERS.map((f) => {
            const n = MODS.filter(f.match).length;
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
          {shown.length} shown / {MODS.length} total
        </span>
      </div>

      <div className="grid">
        {shown.map(({ m, i }) => {
          const isOpen = open === m.title;
          const preview = m.pipeline.slice(0, 3);
          const rest = m.pipeline.length - preview.length;

          return (
            <article
              key={m.title}
              className={isOpen ? "tile is-open" : "tile"}
            >
              <button
                type="button"
                className="tile-hit"
                onClick={() => setOpen(isOpen ? null : m.title)}
                aria-expanded={isOpen}
              >
                <span className="tile-bar">
                  <span
                    className={
                      m.state === "live" ? "tile-state is-live" : "tile-state"
                    }
                  >
                    <span className="led-sm" aria-hidden="true" />
                    {STATE_LABEL[m.state]}
                  </span>
                  <span className="tile-idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <span className="tile-title">{m.title}</span>

                {!isOpen && (
                  <>
                    <span className="tile-flow">
                      {preview.map((s, k) => (
                        <span key={s}>
                          {s}
                          {k < preview.length - 1 && (
                            <i aria-hidden="true">&rsaquo;</i>
                          )}
                        </span>
                      ))}
                      {rest > 0 && <em>+{rest}</em>}
                    </span>
                    <span className="tile-stack">
                      {m.runtime.slice(0, 4).join(" · ")}
                    </span>
                  </>
                )}

                <span className="tile-toggle" aria-hidden="true">
                  {isOpen ? "Collapse —" : "Detail +"}
                </span>
              </button>

              {isOpen && (
                <div className="tile-detail">
                  {m.body.map((para) => (
                    <p key={para.slice(0, 20)}>{para}</p>
                  ))}

                  <div className="pipe" aria-label="System flow">
                    {m.pipeline.map((step) => (
                      <span className="node" key={step}>
                        <b>{step}</b>
                        <i aria-hidden="true">&rarr;</i>
                      </span>
                    ))}
                  </div>

                  <dl className="tel">
                    <div className="tel-row">
                      <dt>Runtime</dt>
                      <dd className="stackline">{m.runtime.join("  ·  ")}</dd>
                    </div>
                    <div className="tel-row is-outcome">
                      <dt>Outcome</dt>
                      <dd>{m.outcome}</dd>
                    </div>
                    {m.scope ? (
                      <div className="tel-row">
                        <dt>Scope</dt>
                        <dd>{m.scope}</dd>
                      </div>
                    ) : null}
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
