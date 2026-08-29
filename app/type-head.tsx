"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Section number, e.g. "S01". Rendered as the beeping terminal chip. */
  idx: string;
  /** Heading text, typed out one character at a time. */
  text: string;
  /** Right-aligned meta line. Not animated. */
  meta?: string;
};

/**
 * Section heading that types itself when it scrolls into view.
 *
 * `shown` starts empty so the server and the hydrating render agree; the
 * full string is always in the DOM for screen readers and crawlers, so the
 * animation is decoration only. Width is reserved in `ch` up front, which
 * keeps the rule under the heading from twitching as characters land.
 */
export default function TypeHead({ idx, text, meta }: Props) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Nothing to do under reduced motion: the stylesheet drops the animated
    // span and promotes the static copy, so bailing here leaves the heading
    // fully readable without running a single timer.
    if (reduced) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let i = 0;

    const type = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        return;
      }
      // A touch of jitter reads as a person at a keyboard, not a metronome.
      timer = setTimeout(type, 34 + Math.random() * 46);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        timer = setTimeout(type, 140);
      },
      { threshold: 0.4 }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [text]);

  return (
    <div className="sec-head" ref={ref}>
      <span className="sec-idx">{idx}</span>

      <h2 className="sec-type">
        <span className="sr-only">{text}</span>
        <span
          aria-hidden="true"
          className="sec-type-vis"
          style={{ minWidth: `${text.length}ch` }}
        >
          {shown}
          <i className={done ? "caret is-done" : "caret"} />
        </span>
      </h2>

      {meta ? <span className="sec-meta">{meta}</span> : null}
    </div>
  );
}
