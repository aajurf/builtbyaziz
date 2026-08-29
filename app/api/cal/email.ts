type Args = {
  trigger: "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
  name?: string;
  title?: string;
  startTime?: string;
  timeZone?: string;
  joinUrl?: string;
};

const VOID = "#070b12";
const PANEL = "#0e1622";
const RULE = "#1e2c3d";
const TEXT = "#dde6f0";
const DIM = "#74879e";
const LIVE = "#46e3b0";
const HEAT = "#ff7a5c";

const MONO =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const BODY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Formats the slot in the attendee's own zone. Cal sends UTC ISO strings,
 * so the zone has to be applied here or the reader gets my clock, not theirs.
 */
function formatSlot(startTime?: string, timeZone?: string) {
  if (!startTime) return null;
  const d = new Date(startTime);
  if (Number.isNaN(d.getTime())) return null;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timeZone || "UTC",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return d.toUTCString();
  }
}

const COPY = {
  BOOKING_CREATED: {
    subject: "Your call with Aziz is confirmed",
    tag: "Confirmed",
    lead: "You're booked in.",
    body: "I'll come prepared. Send over any scope, repo or context beforehand and I'll have read it before we speak — that way we spend the call on the decision, not the background.",
  },
  BOOKING_RESCHEDULED: {
    subject: "Your call with Aziz has moved",
    tag: "Rescheduled",
    lead: "New time locked in.",
    body: "Same plan, new slot. Anything you've already sent me still stands, so there's nothing to resend.",
  },
  BOOKING_CANCELLED: {
    subject: "Your call with Aziz is cancelled",
    tag: "Cancelled",
    lead: "That one's off the books.",
    body: "No problem at all. If you want to pick it up later the booking link still works, and you can reply straight to this email if it's easier.",
  },
} as const;

export function bookingEmail(a: Args) {
  const copy = COPY[a.trigger];
  const slot = formatSlot(a.startTime, a.timeZone);
  const who = a.name ? escapeHtml(a.name.split(" ")[0]) : "there";
  const cancelled = a.trigger === "BOOKING_CANCELLED";
  const accent = cancelled ? HEAT : LIVE;

  const rows: [string, string][] = [];
  if (a.title) rows.push(["Call", escapeHtml(a.title)]);
  if (slot) rows.push(["When", escapeHtml(slot)]);
  if (a.joinUrl && !cancelled && /^https?:\/\//.test(a.joinUrl)) {
    rows.push([
      "Join",
      `<a href="${escapeHtml(a.joinUrl)}" style="color:${LIVE};text-decoration:none">${escapeHtml(a.joinUrl)}</a>`,
    ]);
  }

  const rowsHtml = rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${DIM};width:88px;vertical-align:top">${k}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${BODY};font-size:15px;color:${TEXT};vertical-align:top">${v}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${escapeHtml(copy.subject)}</title></head>
<body style="margin:0;padding:0;background:${VOID};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(copy.lead)} ${slot ? escapeHtml(slot) : ""}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${VOID};padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${PANEL};border:1px solid ${RULE}">
        <tr><td style="padding:26px 28px 0">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="width:7px;height:7px;background:${accent};font-size:0;line-height:0">&nbsp;</td>
            <td style="padding-left:10px;font-family:${MONO};font-size:11px;letter-spacing:0.18em;color:${TEXT}">AZIZ ELJURF</td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:22px 28px 0">
          <span style="display:inline-block;font-family:${MONO};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${VOID};background:${accent};padding:4px 8px">${copy.tag}</span>
        </td></tr>

        <tr><td style="padding:16px 28px 0">
          <h1 style="margin:0;font-family:${BODY};font-size:24px;line-height:1.2;font-weight:700;color:${TEXT}">${escapeHtml(copy.lead)}</h1>
          <p style="margin:12px 0 0;font-family:${BODY};font-size:15px;line-height:1.65;color:${DIM}">Hi ${who} — ${escapeHtml(copy.body)}</p>
        </td></tr>

        ${
          rowsHtml
            ? `<tr><td style="padding:20px 28px 0">
                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${RULE}">${rowsHtml}</table>
               </td></tr>`
            : ""
        }

        <tr><td style="padding:24px 28px 30px">
          <p style="margin:0;font-family:${BODY};font-size:14px;line-height:1.6;color:${DIM}">
            Reply to this email and it comes straight to me.
          </p>
        </td></tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
        <tr><td style="padding:16px 4px 0;font-family:${MONO};font-size:10px;letter-spacing:0.12em;color:${DIM}">
          BUILTBYAZIZ.COM &nbsp;·&nbsp; AUTOMATION AND AI INFRASTRUCTURE
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const textLines = [
    copy.lead,
    "",
    `Hi ${a.name ? a.name.split(" ")[0] : "there"} — ${copy.body}`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v.replace(/<[^>]+>/g, "")}`),
    "",
    "Reply to this email and it comes straight to me.",
    "builtbyaziz.com",
  ];

  return { subject: copy.subject, html, text: textLines.join("\n") };
}
