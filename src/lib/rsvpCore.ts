// ───────────────────────────────────────────────────────────────────────────
// Pure RSVP core: types + deterministic helpers shared by the Astro DB store and
// the API route.
// ───────────────────────────────────────────────────────────────────────────

export type Attending = "yes" | "no" | "maybe";

export interface Rsvp {
  name: string;
  email: string;
  attending: Attending;
  /** Total people in this party, including the responder. Ignored when not attending. */
  partySize: number;
  dietary?: string;
  note?: string;
  song?: string;
  /** Set by the store/workflow on write. */
  submittedAt?: string;
}

export interface Headcount {
  /** Number of responses with attending === "yes". */
  yes: number;
  /** Number of responses with attending === "maybe". */
  maybe: number;
  /** Number of responses with attending === "no". */
  no: number;
  /** Total confirmed headcount: sum of partySize across "yes" responses. */
  guests: number;
  /** Remaining capacity, or null when the event has no capacity cap. */
  remaining: number | null;
}

/** One named seat in a Catan group (the responder; +guests rendered as a badge). */
export interface GroupMember {
  name: string;
  partySize: number;
}

/** The two Catan tables, balanced by head count. */
export interface CatanGroups {
  A: GroupMember[];
  B: GroupMember[];
}

export type SubmitResult =
  | { ok: true; headcount: Headcount }
  | { ok: false; reason: string };

/** Store contract — implemented over Astro DB (see lib/rsvp.ts). */
export interface RsvpStore {
  submit(rsvp: Rsvp): Promise<SubmitResult>;
  headcount(): Promise<Headcount>;
  list(): Promise<Rsvp[]>;
  groups(): Promise<CatanGroups>;
}

export function computeHeadcount(rsvps: Rsvp[], capacity?: number): Headcount {
  let yes = 0;
  let maybe = 0;
  let no = 0;
  let guests = 0;
  for (const r of rsvps) {
    if (r.attending === "yes") {
      yes += 1;
      guests += Math.max(1, r.partySize);
    } else if (r.attending === "maybe") {
      maybe += 1;
    } else {
      no += 1;
    }
  }
  const remaining = typeof capacity === "number" ? Math.max(0, capacity - guests) : null;
  return { yes, maybe, no, guests, remaining };
}

/** Confirmed "yes" RSVPs in submission order — the stable input to seeding. */
export function confirmedInOrder(rsvps: Rsvp[]): Rsvp[] {
  return rsvps
    .filter((r) => r.attending === "yes")
    .sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
}

/**
 * Greedy, deterministic seeding into two balanced Catan tables. Walk confirmed
 * guests in submission order; each joins whichever group currently has fewer
 * heads (ties → A). Pure → safe in a Query handler and reusable in the file store.
 */
export function assignGroups(confirmed: Rsvp[]): CatanGroups {
  const groups: CatanGroups = { A: [], B: [] };
  const heads = { A: 0, B: 0 };
  for (const r of confirmed) {
    const size = Math.max(1, r.partySize);
    const target = heads.A <= heads.B ? "A" : "B";
    groups[target].push({ name: r.name, partySize: size });
    heads[target] += size;
  }
  return groups;
}

/**
 * Would accepting this "yes" push confirmed headcount over capacity? Excludes the
 * responder's own previous contribution (they may be editing).
 */
export function wouldExceedCapacity(
  existing: Rsvp[],
  candidate: Rsvp,
  capacity: number,
): { exceeds: boolean; spotsLeft: number; requested: number } {
  const key = candidate.email.toLowerCase();
  const others = existing.filter((r) => r.email.toLowerCase() !== key);
  const othersGuests = computeHeadcount(others).guests;
  const requested = Math.max(1, candidate.partySize);
  const spotsLeft = Math.max(0, capacity - othersGuests);
  return { exceeds: othersGuests + requested > capacity, spotsLeft, requested };
}
