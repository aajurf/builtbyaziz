"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  col: number;
  pulse: number;
  out: number[];
};

type Edge = { a: number; b: number; heat: number };

type Packet = { e: number; t: number; speed: number; hot: boolean };

const COLORS = {
  rule: "rgba(30,44,61,1)",
  node: "rgba(116,135,158,1)",
  live: [70, 227, 176] as const,
  heat: [255, 122, 92] as const,
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

/** Cached radial glow sprite — far cheaper than shadowBlur per frame. */
function makeGlow(rgb: readonly number[], size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.55)`);
  grad.addColorStop(0.4, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.14)`);
  grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function PipelineCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let packets: Packet[] = [];
    let spawnClock = 0;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999 };

    const glowLive = makeGlow(COLORS.live, 120);
    const glowHeat = makeGlow(COLORS.heat, 120);

    /** Build a directed left-to-right graph: the shape of a pipeline. */
    function build() {
      nodes = [];
      edges = [];
      packets = [];

      const cols = W < 640 ? 4 : W < 1100 ? 5 : 7;
      const marginX = W * (W < 640 ? 0.1 : 0.07);
      const usableW = W - marginX * 2;
      const colGap = usableW / (cols - 1);
      const byCol: number[][] = [];

      for (let c = 0; c < cols; c++) {
        const count = c === 0 || c === cols - 1 ? 2 : Math.round(rand(2, 4));
        const ids: number[] = [];
        for (let i = 0; i < count; i++) {
          const bandH = H * 0.72;
          const top = H * 0.14;
          const slot = bandH / count;
          nodes.push({
            x: marginX + c * colGap + rand(-colGap * 0.1, colGap * 0.1),
            y: top + slot * i + slot / 2 + rand(-slot * 0.22, slot * 0.22),
            col: c,
            pulse: 0,
            out: [],
          });
          ids.push(nodes.length - 1);
        }
        byCol.push(ids);
      }

      for (let c = 0; c < byCol.length - 1; c++) {
        for (const a of byCol[c]) {
          const targets = [...byCol[c + 1]].sort(() => Math.random() - 0.5);
          const n = Math.random() < 0.45 ? 2 : 1;
          for (const b of targets.slice(0, Math.min(n, targets.length))) {
            edges.push({ a, b, heat: 0 });
            nodes[a].out.push(edges.length - 1);
          }
        }
        // guarantee every node in the next column has an inbound edge
        for (const b of byCol[c + 1]) {
          if (!edges.some((e) => e.b === b)) {
            const a = byCol[c][Math.floor(Math.random() * byCol[c].length)];
            edges.push({ a, b, heat: 0 });
            nodes[a].out.push(edges.length - 1);
          }
        }
      }
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) {
        for (const n of nodes) n.pulse = Math.random() < 0.35 ? 0.7 : 0.12;
        for (const e of edges) e.heat = Math.random() < 0.3 ? 0.5 : 0.08;
        draw();
      }
    }

    function spawn() {
      const sources = nodes.filter((n) => n.col === 0);
      if (!sources.length) return;
      const src = sources[Math.floor(Math.random() * sources.length)];
      if (!src.out.length) return;
      const e = src.out[Math.floor(Math.random() * src.out.length)];
      packets.push({
        e,
        t: 0,
        speed: rand(0.32, 0.55),
        hot: Math.random() < 0.18,
      });
    }

    function step(dt: number) {
      spawnClock += dt;
      const interval = 0.42;
      while (spawnClock > interval) {
        spawnClock -= interval;
        if (packets.length < 34) spawn();
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed * dt;
        const edge = edges[p.e];
        edge.heat = Math.min(1, edge.heat + dt * 1.4);

        if (p.t >= 1) {
          const arrived = nodes[edge.b];
          arrived.pulse = 1;
          packets.splice(i, 1);
          if (arrived.out.length) {
            const next =
              arrived.out[Math.floor(Math.random() * arrived.out.length)];
            packets.push({
              e: next,
              t: 0,
              speed: rand(0.32, 0.55),
              hot: p.hot,
            });
          }
        }
      }

      for (const n of nodes) n.pulse = Math.max(0, n.pulse - dt * 1.5);
      for (const e of edges) e.heat = Math.max(0.06, e.heat - dt * 0.55);
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // edges
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const mx = (a.x + b.x) / 2;
        const near =
          Math.hypot(mouse.x - mx, mouse.y - (a.y + b.y) / 2) < 170 ? 0.28 : 0;
        const alpha = 0.1 + e.heat * 0.42 + near;
        ctx!.strokeStyle = `rgba(70,227,176,${Math.min(alpha, 0.72)})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        // gentle S-curve reads as routing, not a wire diagram
        const cp = (b.x - a.x) * 0.5;
        ctx!.bezierCurveTo(a.x + cp, a.y, b.x - cp, b.y, b.x, b.y);
        ctx!.stroke();
      }

      // packets
      for (const p of packets) {
        const e = edges[p.e];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const cp = (b.x - a.x) * 0.5;
        const t = p.t;
        const mt = 1 - t;
        const x =
          mt * mt * mt * a.x +
          3 * mt * mt * t * (a.x + cp) +
          3 * mt * t * t * (b.x - cp) +
          t * t * t * b.x;
        const y =
          mt * mt * mt * a.y +
          3 * mt * mt * t * a.y +
          3 * mt * t * t * b.y +
          t * t * t * b.y;

        const g = p.hot ? glowHeat : glowLive;
        ctx!.globalAlpha = 0.9;
        ctx!.drawImage(g, x - 30, y - 30, 60, 60);
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = p.hot
          ? "rgba(255,122,92,1)"
          : "rgba(150,255,222,1)";
        ctx!.fillRect(x - 1.5, y - 1.5, 3, 3);
      }

      // nodes — squares, not circles: the vernacular is a canvas, not a network
      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        const prox = d < 150 ? 1 - d / 150 : 0;
        const lit = Math.max(n.pulse, prox * 0.7);
        const s = 7 + lit * 3;

        if (lit > 0.05) {
          ctx!.globalAlpha = lit * 0.8;
          ctx!.drawImage(glowLive, n.x - 45, n.y - 45, 90, 90);
          ctx!.globalAlpha = 1;
        }

        ctx!.fillStyle = `rgba(14,22,34,1)`;
        ctx!.fillRect(n.x - s / 2, n.y - s / 2, s, s);
        ctx!.strokeStyle = `rgba(${70 + lit * 80},${135 + lit * 92},${
          158 + lit * 18
        },${0.5 + lit * 0.5})`;
        ctx!.lineWidth = 1;
        ctx!.strokeRect(n.x - s / 2, n.y - s / 2, s, s);

        if (lit > 0.35) {
          ctx!.fillStyle = `rgba(70,227,176,${lit})`;
          ctx!.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
        }
      }
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() {
      mouse.x = mouse.y = -9999;
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduced) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="canvas" aria-hidden="true" />;
}
