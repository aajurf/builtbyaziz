import crypto from "node:crypto";
import { bookingEmail } from "./email";

/** Needs the Node runtime for crypto.timingSafeEqual. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CalAttendee = { name?: string; email?: string; timeZone?: string };

type CalPayload = {
  title?: string;
  startTime?: string;
  endTime?: string;
  attendees?: CalAttendee[];
  organizer?: { name?: string; email?: string; timeZone?: string };
  uid?: string;
  videoCallData?: { url?: string };
  location?: string;
};

type CalEvent = {
  triggerEvent?: string;
  payload?: CalPayload;
};

/**
 * Constant-time compare of two hex digests. Returns false rather than
 * throwing when the lengths differ, since timingSafeEqual requires equal
 * lengths and a length mismatch is just a failed signature.
 */
function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length || ab.length === 0) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM;

  // Fail closed. Without a secret we cannot tell Cal apart from anyone
  // else who found this URL, and this endpoint sends mail.
  if (!secret || !apiKey || !from) {
    console.error("cal webhook: missing env", {
      hasSecret: Boolean(secret),
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
    });
    return new Response("not configured", { status: 500 });
  }

  // The signature covers the exact bytes Cal sent, so verify before parsing.
  const raw = await req.text();
  const sent = req.headers.get("x-cal-signature-256") ?? "";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");

  if (!safeEqualHex(sent, expected)) {
    return new Response("bad signature", { status: 401 });
  }

  let event: CalEvent;
  try {
    event = JSON.parse(raw) as CalEvent;
  } catch {
    return new Response("bad json", { status: 400 });
  }

  // Only the events we actually send mail for. Everything else is a 200 so
  // Cal does not queue retries for things we deliberately ignore.
  const trigger = event.triggerEvent;
  if (
    trigger !== "BOOKING_CREATED" &&
    trigger !== "BOOKING_RESCHEDULED" &&
    trigger !== "BOOKING_CANCELLED"
  ) {
    return Response.json({ ok: true, ignored: trigger ?? null });
  }

  const p = event.payload ?? {};
  const attendee = p.attendees?.[0];
  const to = attendee?.email;

  if (!to) {
    return Response.json({ ok: true, skipped: "no attendee email" });
  }

  const { subject, html, text } = bookingEmail({
    trigger,
    name: attendee?.name,
    title: p.title,
    startTime: p.startTime,
    timeZone: attendee?.timeZone,
    joinUrl: p.videoCallData?.url ?? p.location,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Cal retries on failure; this stops a retry sending a second copy.
      ...(p.uid ? { "Idempotency-Key": `${trigger}:${p.uid}` } : {}),
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: "aziz@builtbyaziz.com",
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("resend send failed", res.status, detail);
    // 502 so Cal retries — the booking is real, the mail is what failed.
    return new Response("send failed", { status: 502 });
  }

  const sentMail = (await res.json()) as { id?: string };
  return Response.json({ ok: true, id: sentMail.id ?? null });
}
