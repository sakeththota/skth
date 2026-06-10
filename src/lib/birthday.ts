// Single source of truth for the invite's content.
// Editing this file is how you iterate on the party details.

export type Resource = "brick" | "wood" | "wool" | "wheat" | "ore" | "sea" | "desert";

export interface Activity {
  name: string;
  resource: Resource;
  /** Catan number-token shown on the card (6 & 8 render "hot"/red). */
  token: number;
  blurb: string;
  /** Marks the headline event (gets the crown). */
  crown?: boolean;
}

export interface EventConfig {
  /** Stable id for the event. */
  slug: string;
  /** The birthday this celebrates. */
  occasion: string;
  /** Big wordmark. */
  title: string;
  /** Regal subtitle. */
  tagline: string;
  /** ISO 8601. Rendered for display and (later) used for durable reminder timers. */
  dateTime: string;
  location: string;
  /** ISO 8601 date by which guests should RSVP. */
  rsvpDeadline: string;
  /** Optional max total headcount. When set, the store rejects RSVPs that exceed it. */
  capacity?: number;
  blurb: string;
  activities: Activity[];
}

export const event: EventConfig = {
  slug: "saketh-game-night-2026",
  occasion: "Saketh's Birthday",
  title: "Game Night",
  tagline: "Crown the Catan King",
  // Lands mid-2026 World Cup group stage — matches will be on between turns.
  dateTime: "2026-06-20T19:00:00-05:00",
  location: "1062 N Ashland Ave #203, Chicago",
  rsvpDeadline: "2026-06-13T23:59:00-05:00",
  capacity: 20,
  blurb:
    "It's a birthday, so we're settling some islands. Two tribes face off across the Catan board " +
    "to crown a King — and between turns there's Switch, World Cup matches on the big screen, " +
    "drinking card games, snacks, and good company. Roll up.",
  activities: [
    {
      name: "Catan",
      resource: "brick",
      token: 8,
      crown: true,
      blurb: "Two tribes, one board. Build, trade, and backstab your way to the crown. The last settler standing is named Catan King.",
    },
    {
      name: "Switch",
      resource: "wood",
      token: 6,
      blurb: "Mario Kart, Smash, and party games on the big screen for everyone waiting on a turn.",
    },
    {
      name: "World Cup",
      resource: "sea",
      token: 5,
      blurb: "It's a World Cup summer — we'll have the matches live in the background all night.",
    },
    {
      name: "Card Games",
      resource: "wheat",
      token: 9,
      blurb: "Drinking games and questionable decisions. Bring your poker face and your forfeits.",
    },
    {
      name: "Food & Drinks",
      resource: "wool",
      token: 4,
      blurb: "Snacks, pizza, and a stocked fridge. Fuel for the conquest — BYO favorite to share.",
    },
  ],
};

/** Helpers shared by the page and API. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
