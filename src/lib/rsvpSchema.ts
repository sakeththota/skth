import { z } from "zod";

// Shared between the client form (react-hook-form resolver) and the API route
// (server-side safeParse). No node-only imports here so it's safe in the browser.
// Party size only matters when attending "yes"; the API route normalizes it to
// 1 otherwise, so the schema just validates the raw range.
export const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  attending: z.enum(["yes", "no", "maybe"], {
    errorMap: () => ({ message: "Let us know if you can make it" }),
  }),
  partySize: z.coerce
    .number()
    .int("Whole numbers only")
    .min(1, "At least 1")
    .max(10, "Max 10 — message the host for bigger groups"),
  dietary: z.string().max(280).optional().or(z.literal("")),
  note: z.string().max(500).optional().or(z.literal("")),
  song: z.string().max(120).optional().or(z.literal("")),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
