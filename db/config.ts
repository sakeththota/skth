import { defineDb, defineTable, column } from "astro:db";

// One row per guest, keyed by lowercased email (last write wins).
const Rsvp = defineTable({
  columns: {
    email: column.text({ primaryKey: true }),
    name: column.text(),
    attending: column.text(), // "yes" | "no" | "maybe"
    partySize: column.number({ default: 1 }),
    dietary: column.text({ optional: true }),
    note: column.text({ optional: true }),
    song: column.text({ optional: true }),
    submittedAt: column.text(), // ISO 8601
  },
});

export default defineDb({ tables: { Rsvp } });
