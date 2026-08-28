"use client";

import { useEffect, useState } from "react";

const CAL = "https://cal.com/contactlnp/30min";

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={solid ? "topbar is-solid" : "topbar"}>
      <a className="mark" href="#top">
        <span className="mark-dot" aria-hidden="true" />
        AZIZ ELJURF
      </a>
      <nav className="topnav">
        <a href="#work">Work</a>
        <a href="#terms">How it works</a>
      </nav>
      <a
        className="topcta"
        href={CAL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a call
      </a>
    </header>
  );
}
