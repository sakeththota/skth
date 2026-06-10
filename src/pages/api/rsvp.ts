import type { APIRoute } from "astro";
import { store, type Rsvp } from "@/lib/rsvp";
import { rsvpSchema } from "@/lib/rsvpSchema";
import { notifyHostsOfRsvp } from "@/lib/notify";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// POST /api/rsvp — validate + store. Mirrors skth's /api/contact.ts pattern.
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return json({ error: result.error.flatten() }, 400);
    }

    const data = result.data;
    const rsvp: Rsvp = {
      name: data.name,
      email: data.email,
      attending: data.attending,
      partySize: data.attending === "yes" ? data.partySize : 1,
      dietary: data.dietary || undefined,
      note: data.note || undefined,
      song: data.song || undefined,
    };

    const outcome = await store.submit(rsvp);
    if (!outcome.ok) {
      // Capacity rejection from the store.
      return json({ error: outcome.reason }, 409);
    }

    // Text the host(s) about this RSVP (no-op without env config).
    await notifyHostsOfRsvp(rsvp, outcome.headcount);

    return json({ success: true, headcount: outcome.headcount });
  } catch (err) {
    console.error(err);
    return json({ error: "Internal Server Error" }, 500);
  }
};

// GET /api/rsvp — live headcount + Catan group seeding (full list when ?list=1).
export const GET: APIRoute = async ({ url }) => {
  try {
    const [headcount, groups] = await Promise.all([store.headcount(), store.groups()]);
    if (url.searchParams.get("list") === "1") {
      return json({ headcount, groups, guests: await store.list() });
    }
    return json({ headcount, groups });
  } catch (err) {
    console.error(err);
    return json({ error: "Internal Server Error" }, 500);
  }
};
