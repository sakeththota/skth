import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^\d{10}$/),
  message: z.string().min(20),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = formSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.flatten() }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { firstName, lastName, email, phoneNumber, message } = result.data;

    console.log("sending email")

    await resend.emails.send({
      from: 'Tutoring Request <tutor@skth.dev>',
      to: 'sakeththota01@outlook.com',
      subject: `Incoming Tutoring Request: ${firstName} ${lastName}`,
      replyTo: email,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phoneNumber}

        Message: ${message}
      `,
    });

    console.log("sent email")
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};