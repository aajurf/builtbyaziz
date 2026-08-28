"use client";

import { useEffect, useState } from "react";

function clock(tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  });
}

const HERE = clock("Africa/Casablanca");
const THERE = clock("America/New_York");

/** Overlap with 9am–6pm US Eastern, computed from the same instant. */
function easternHour(d: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: "America/New_York",
  }).formatToParts(d);
  const h = parts.find((p) => p.type === "hour")?.value;
  return h ? Number(h) % 24 : 0;
}

export default function StatusRail() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Deliberate: `now` stays null through SSR and the hydrating render so the
    // server and client markup match, then fills in once we are on the client.
    // Runs once on mount, so there is no render cascade for the rule to catch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const online = now ? easternHour(now) >= 9 && easternHour(now) < 18 : false;

  return (
    <div className="rail" role="status" aria-label="Availability">
      <span className="rail-item">
        <span className="led" aria-hidden="true" />
        {online ? "Online now" : "Available"}
      </span>

      <span className="rail-sep" aria-hidden="true" />

      <span className="rail-item">
        Tangier <b suppressHydrationWarning>{now ? HERE.format(now) : "--:--"}</b>
      </span>

      <span className="rail-item">
        New York <b suppressHydrationWarning>{now ? THERE.format(now) : "--:--"}</b>
      </span>

      <span className="rail-spacer" aria-hidden="true" />

      <span className="rail-item">
        Booking <b>September</b>
      </span>
    </div>
  );
}
