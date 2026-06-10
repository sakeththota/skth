"use client";

import { useEffect, useState } from "react";
import type { Headcount as HeadcountData } from "@/lib/rsvpCore";

// Live "settlers" count — reads GET /api/rsvp (Astro DB).
export function Headcount({ capacity }: { capacity?: number }) {
  const [data, setData] = useState<HeadcountData | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/rsvp");
      if (res.ok) setData((await res.json()).headcount);
    } catch {
      /* ignore transient errors */
    }
  }

  useEffect(() => {
    refresh();
    const onSubmitted = () => refresh();
    window.addEventListener("rsvp:submitted", onSubmitted);
    const id = setInterval(refresh, 15000);
    return () => {
      window.removeEventListener("rsvp:submitted", onSubmitted);
      clearInterval(id);
    };
  }, []);

  const guests = data?.guests ?? 0;
  const maybe = data?.maybe ?? 0;
  const cap = capacity ?? 0;
  const pips = cap > 0 ? Array.from({ length: cap }, (_, i) => i < guests) : [];

  return (
    <div className="gn-card p-5 flex flex-col gap-4">
      <div className="flex gap-8">
        <div>
          <div className="gn-stat-num">{guests}</div>
          <div className="gn-stat-key">Confirmed</div>
        </div>
        <div>
          <div className="gn-stat-num">{maybe}</div>
          <div className="gn-stat-key">Maybe</div>
        </div>
      </div>

      {cap > 0 && (
        <div>
          <div className="gn-meter">
            {pips.map((on, i) => (
              <span key={i} className={`gn-pip ${on ? "gn-pip--on" : ""}`} />
            ))}
          </div>
          <p className="gn-stat-key mt-2">{guests} of {cap} seats at the table</p>
        </div>
      )}
    </div>
  );
}
