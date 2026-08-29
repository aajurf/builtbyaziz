/**
 * Decorative board traces descending behind the Trace section.
 *
 * Server component, no JS, no state. The geometry is authored rather than
 * generated: anything using Math.random at module scope would render one
 * layout on the server and a different one on the client, which is a
 * hydration mismatch for the sake of noise nobody is looking at.
 */

type Line = {
  /** Start x in viewBox units. */
  x: number;
  /** How far down it runs, 0–1 of the field height. */
  len: number;
  /** Sideways jog, in viewBox units. 0 runs straight down. */
  jog: number;
  /** Where down the run the jog happens, 0–1. */
  at: number;
  /** Terminate in a pad. */
  dot: boolean;
};

const H = 420;

const LINES: Line[] = [
  { x: 24, len: 0.52, jog: 0, at: 0, dot: true },
  { x: 58, len: 0.78, jog: 22, at: 0.34, dot: true },
  { x: 92, len: 0.34, jog: 0, at: 0, dot: false },
  { x: 126, len: 0.92, jog: -18, at: 0.52, dot: true },
  { x: 168, len: 0.44, jog: 0, at: 0, dot: true },
  { x: 205, len: 0.68, jog: 26, at: 0.22, dot: false },
  { x: 246, len: 0.28, jog: 0, at: 0, dot: true },
  { x: 282, len: 0.86, jog: -24, at: 0.44, dot: true },
  { x: 324, len: 0.58, jog: 0, at: 0, dot: false },
  { x: 360, len: 0.74, jog: 20, at: 0.62, dot: true },
  { x: 402, len: 0.38, jog: 0, at: 0, dot: true },
  { x: 438, len: 0.64, jog: -20, at: 0.3, dot: false },
  { x: 478, len: 0.88, jog: 24, at: 0.48, dot: true },
  { x: 520, len: 0.46, jog: 0, at: 0, dot: true },
  { x: 556, len: 0.7, jog: -22, at: 0.26, dot: false },
  { x: 596, len: 0.32, jog: 0, at: 0, dot: true },
];

const R = 8;

function build(l: Line) {
  const end = H * l.len;
  if (!l.jog) return { d: `M ${l.x} 0 L ${l.x} ${end}`, ex: l.x, ey: end };

  const turn = H * l.len * l.at;
  const dir = Math.sign(l.jog);
  const ex = l.x + l.jog;
  // down, rounded corner out, across, rounded corner down, continue
  const d = [
    `M ${l.x} 0`,
    `L ${l.x} ${turn - R}`,
    `Q ${l.x} ${turn} ${l.x + dir * R} ${turn}`,
    `L ${ex - dir * R} ${turn}`,
    `Q ${ex} ${turn} ${ex} ${turn + R}`,
    `L ${ex} ${end}`,
  ].join(" ");
  return { d, ex, ey: end };
}

export default function TraceField() {
  return (
    <svg
      className="trace-field"
      viewBox={`0 0 620 ${H}`}
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      {LINES.map((l, i) => {
        const { d, ex, ey } = build(l);
        return (
          <g key={i}>
            <path d={d} />
            {l.dot && <circle cx={ex} cy={ey} r={2.6} />}
          </g>
        );
      })}
    </svg>
  );
}
