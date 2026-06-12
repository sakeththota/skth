import { db, Rsvp } from "astro:db";

// Initial guests: just the two hosts (you + your girlfriend) → "2 confirmed".
// Names/emails are NOT shown on the invite (only the headcount is) — edit freely.
// Runs automatically for the local dev DB. To apply the same to a remote
// production DB once, run: astro db execute ./db/seed.ts --remote
export default async function seed() {
  const now = new Date().toISOString();
  await db.insert(Rsvp).values([
    { email: "saketh@skth.dev", name: "Saketh", attending: "yes", partySize: 1, submittedAt: now },
    { email: "annasuleebub@outlook.com", name: "Anna Lee", attending: "yes", partySize: 1, partyOf: "saketh@skth.dev", submittedAt: now },
  ]);
}
