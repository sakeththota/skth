// ───────────────────────────────────────────────────────────────────────────
// Host RSVP notification — a formatted HTML email to the host(s) on each RSVP,
// sent via Resend (same setup as the contact form). Gated on the Resend key, so
// it's a no-op (and never throws) without it.
//
// Env (all optional — sensible defaults baked in):
//   RESEND_API_TOKEN / RESEND_API_KEY   your Resend key
//   RSVP_FROM         from-address on a Resend-verified domain
//   RSVP_NOTIFY_TO    comma-separated recipient(s)
// ───────────────────────────────────────────────────────────────────────────

import type { Headcount, Rsvp } from "@/lib/rsvpCore";

const FROM = import.meta.env.RSVP_FROM ?? "Saketh's Game Night <rsvp@skth.dev>";
const TO = (import.meta.env.RSVP_NOTIFY_TO ?? "sakeththota01@gmail.com, annasuleebub@outlook.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const STATUS: Record<Rsvp["attending"], { word: string; label: string; color: string; bg: string }> = {
  yes: { word: "Coming", label: "🎉 Coming", color: "#2E6B3C", bg: "#E6F0DD" },
  maybe: { word: "Maybe", label: "🤔 Maybe", color: "#A9781F", bg: "#FBEFD2" },
  no: { word: "Can't make it", label: "Can't make it", color: "#8A4026", bg: "#F4E2DA" },
};

function esc(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

function buildEmail(rsvp: Rsvp, hc: Headcount): { subject: string; html: string; text: string } {
  const s = STATUS[rsvp.attending];
  const subject = `🎲 ${rsvp.name} RSVP'd — ${s.word} · Game Night`;

  const row = (k: string, v: string) =>
    `<tr><td style="padding:5px 0;color:#7A6249;width:120px;vertical-align:top;">${k}</td>` +
    `<td style="padding:5px 0;color:#2C1B0E;font-weight:bold;">${esc(v)}</td></tr>`;
  const detailRows = [
    rsvp.attending === "yes" ? row("Party size", String(rsvp.partySize)) : "",
    rsvp.dietary ? row("Dietary", rsvp.dietary) : "",
    rsvp.song ? row("Song", rsvp.song) : "",
    rsvp.note ? row("Note", rsvp.note) : "",
  ].join("");

  const stat = (label: string, n: number | string) =>
    `<td align="center" width="33%" style="font-family:Helvetica,Arial,sans-serif;">` +
    `<div style="font-size:30px;font-weight:bold;color:#C0573A;line-height:1;">${n}</div>` +
    `<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#7A6249;margin-top:4px;">${label}</div></td>`;
  const seatsLeft = hc.remaining;

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#EFE6CE;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE6CE;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;background:#FBF7EC;border:1px solid #E0CBA0;border-radius:14px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">
        <tr><td style="background:#C0573A;padding:22px 28px;">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#F6E3C7;">New RSVP &middot; Game Night</div>
          <div style="font-size:26px;font-weight:bold;color:#FBF7EC;margin-top:6px;">&#128081; Crown the Catan King</div>
        </td></tr>
        <tr><td style="padding:26px 28px 6px;">
          <div style="font-size:23px;font-weight:bold;color:#2C1B0E;">${esc(rsvp.name)}</div>
          <div style="font-size:14px;color:#7A6249;margin-top:3px;">${esc(rsvp.email)}</div>
          <div style="margin-top:14px;"><span style="display:inline-block;padding:6px 16px;border-radius:999px;background:${s.bg};color:${s.color};font-size:14px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;">${s.label}</span></div>
        </td></tr>
        ${detailRows ? `<tr><td style="padding:14px 28px 2px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;font-size:14px;">${detailRows}</table></td></tr>` : ""}
        <tr><td style="padding:18px 28px 6px;">
          <div style="border-top:1px solid #E0CBA0;padding-top:16px;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A6249;margin-bottom:12px;font-family:Helvetica,Arial,sans-serif;">The tally so far</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              ${stat("Confirmed", hc.guests)}${stat("Maybe", hc.maybe)}${seatsLeft !== null ? stat("Seats left", seatsLeft) : ""}
            </tr></table>
          </div>
        </td></tr>
        <tr><td style="padding:18px 28px 26px;">
          <a href="https://skth.dev/birthday" style="color:#C0573A;font-family:Helvetica,Arial,sans-serif;font-size:13px;text-decoration:none;font-weight:bold;">View the invite &rarr;</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;

  const partyBit = rsvp.attending === "yes" ? ` (party of ${rsvp.partySize})` : "";
  const text = `${rsvp.name} — ${s.word}${partyBit}\n${rsvp.email}\n\nConfirmed: ${hc.guests} · Maybe: ${hc.maybe}${seatsLeft !== null ? ` · Seats left: ${seatsLeft}` : ""}\n\nhttps://skth.dev/birthday`;

  return { subject, html, text };
}

/** Email the host(s) about an RSVP. No-op (and never throws) without config. */
export async function notifyHostsOfRsvp(rsvp: Rsvp, headcount: Headcount): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_TOKEN ?? import.meta.env.RESEND_API_KEY;
  if (!apiKey || TO.length === 0) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { subject, html, text } = buildEmail(rsvp, headcount);
    const { data, error } = await resend.emails.send({ from: FROM, to: TO, subject, html, text });
    if (error) {
      console.error("[rsvp-email] Resend rejected the send:", JSON.stringify(error));
    } else {
      console.log(`[rsvp-email] sent (id ${data?.id}) to ${TO.join(", ")}`);
    }
  } catch (err) {
    // Never fail the RSVP because a notification failed.
    console.error("[rsvp-email] notify threw:", err);
  }
}
