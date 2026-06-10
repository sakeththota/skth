// ───────────────────────────────────────────────────────────────────────────
// RSVP store, backed by Astro DB (libSQL). Deploys alongside the Astro site
// (e.g. on Vercel) — local dev uses a file-backed SQLite automatically; in
// production it connects to a remote libSQL via ASTRO_DB_REMOTE_URL / _APP_TOKEN.
//
// Pure types/helpers live in `rsvpCore.ts` and are reused here over DB rows.
// ───────────────────────────────────────────────────────────────────────────

import { db, eq, Rsvp as RsvpTable } from "astro:db";
import { event } from "@/lib/birthday";
import {
  assignGroups,
  computeHeadcount,
  confirmedInOrder,
  wouldExceedCapacity,
  type CatanGroups,
  type Headcount,
  type Rsvp,
  type RsvpStore,
  type SubmitResult,
} from "@/lib/rsvpCore";

export type {
  Attending,
  CatanGroups,
  GroupMember,
  Headcount,
  Rsvp,
  RsvpStore,
  SubmitResult,
} from "@/lib/rsvpCore";

interface Row {
  email: string;
  name: string;
  attending: string;
  partySize: number;
  dietary: string | null;
  note: string | null;
  song: string | null;
  submittedAt: string;
}

function rowToRsvp(r: Row): Rsvp {
  return {
    email: r.email,
    name: r.name,
    attending: r.attending as Rsvp["attending"],
    partySize: r.partySize,
    dietary: r.dietary ?? undefined,
    note: r.note ?? undefined,
    song: r.song ?? undefined,
    submittedAt: r.submittedAt,
  };
}

async function all(): Promise<Rsvp[]> {
  const rows = (await db.select().from(RsvpTable)) as Row[];
  return rows.map(rowToRsvp);
}

class AstroDbStore implements RsvpStore {
  async submit(rsvp: Rsvp): Promise<SubmitResult> {
    const key = rsvp.email.trim().toLowerCase();

    if (typeof event.capacity === "number" && rsvp.attending === "yes") {
      const { exceeds, spotsLeft, requested } = wouldExceedCapacity(
        await all(),
        { ...rsvp, email: key },
        event.capacity,
      );
      if (exceeds) {
        return {
          ok: false,
          reason:
            spotsLeft === 0
              ? "Sorry — the party is full."
              : `Only ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left; you requested ${requested}.`,
        };
      }
    }

    const values = {
      email: key,
      name: rsvp.name,
      attending: rsvp.attending,
      partySize: Math.max(1, rsvp.partySize),
      dietary: rsvp.dietary ?? null,
      note: rsvp.note ?? null,
      song: rsvp.song ?? null,
      submittedAt: new Date().toISOString(),
    };

    const existing = ((await db.select().from(RsvpTable).where(eq(RsvpTable.email, key))) as Row[]).at(0);
    if (existing) {
      // Preserve the original timestamp so edits don't reshuffle group seeding.
      await db
        .update(RsvpTable)
        .set({ ...values, submittedAt: existing.submittedAt })
        .where(eq(RsvpTable.email, key));
    } else {
      await db.insert(RsvpTable).values(values);
    }

    return { ok: true, headcount: computeHeadcount(await all(), event.capacity) };
  }

  async headcount(): Promise<Headcount> {
    return computeHeadcount(await all(), event.capacity);
  }

  async list(): Promise<Rsvp[]> {
    return (await all()).sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
  }

  async groups(): Promise<CatanGroups> {
    return assignGroups(confirmedInOrder(await all()));
  }
}

export const store: RsvpStore = new AstroDbStore();
