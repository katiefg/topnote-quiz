// ─── CONFIG ─────────────────────────────────────────────────────────────────
// Change this to whoever should receive a copy of every quiz result.
// When you're done testing, swap in your colleague's email.

const CONFIG = {
  OWNER_EMAIL: "you@example.com",  // ← change this to your email
  OWNER_NAME: "Scent Consultant",
  QUIZ_NAME: "Signature Scent Discovery Quiz",
};

// ─── WEB APP ENTRY POINT ────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, vibes, results } = data;

    if (!name || !email || !results) {
      return jsonResponse({ success: false, error: "Missing required fields" });
    }

    const subjectForTaker = `Your Scent Profile Results — ${CONFIG.QUIZ_NAME}`;
    const subjectForOwner = `New Quiz Result: ${name} — ${CONFIG.QUIZ_NAME}`;

    const htmlBody = buildEmailHtml(name, vibes, results);

    // Send to quiz taker
    GmailApp.sendEmail(email, subjectForTaker, "", {
      htmlBody: htmlBody,
      name: CONFIG.OWNER_NAME,
    });

    // Send copy to owner
    GmailApp.sendEmail(CONFIG.OWNER_EMAIL, subjectForOwner, "", {
      htmlBody: htmlBody,
      name: CONFIG.QUIZ_NAME,
      replyTo: email,
    });

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// Handle CORS preflight
function doGet(e) {
  return jsonResponse({ status: "ok", message: "Scent Quiz API is running" });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── EMAIL TEMPLATE ─────────────────────────────────────────────────────────

function buildEmailHtml(name, vibes, results) {
  const vibesRows = [
    { id: "v1", q: "Looking for a scent for…" },
    { id: "v2", q: "Scent should be…" },
    { id: "v3", q: "Fragrance style…" },
    { id: "v4", q: "Fragrance personality…" },
    { id: "v5", q: "Scent presence…" },
  ].map(v => `
    <tr>
      <td style="padding:4px 8px;color:#888888;font-size:13px;">${v.q}</td>
      <td style="padding:4px 8px;font-size:13px;font-weight:600;">${esc(vibes[v.id] || "—")}</td>
    </tr>
  `).join("");

  const sliderRows = results.map(r => {
    // Build a simple slider using a 3-cell table
    // Left spacer (pct width) | dot | right spacer
    const pct = Math.max(2, Math.min(98, r.pct)); // clamp so dot stays visible
    const scoreStr = (r.score > 0 ? "+" : "") + r.score;

    return `
    <tr>
      <td style="padding:6px 12px 6px 0;text-align:right;font-size:13px;font-weight:500;width:130px;vertical-align:middle;">
        ${esc(r.name)}
      </td>
      <td style="padding:6px 0;vertical-align:middle;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
          <tr>
            <td style="width:${pct}%;height:6px;background:#eeeeee;"></td>
            <td style="width:14px;vertical-align:middle;">
              <div style="width:14px;height:14px;border-radius:7px;background:#333333;"></div>
            </td>
            <td style="height:6px;background:#eeeeee;"></td>
          </tr>
        </table>
      </td>
      <td style="padding:6px 0 6px 12px;font-size:12px;color:#666666;width:100px;vertical-align:middle;white-space:nowrap;">
        ${scoreStr} · ${r.label}
      </td>
    </tr>`;
  }).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#222222;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="padding:32px 16px;">
<table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">

  <!-- Header -->
  <tr><td style="padding-bottom:4px;">
    <h1 style="margin:0;font-size:22px;font-weight:700;">Scent Profile: ${esc(name)}</h1>
  </td></tr>
  <tr><td style="padding-bottom:24px;font-size:14px;color:#666666;">
    Your signature scent coordinates across 12 categories.
  </td></tr>

  <!-- Vibes Diagnostic -->
  <tr><td style="padding-bottom:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="background:#f9f9f9;border-radius:8px;">
      <tr><td style="padding:16px;">
        <div style="font-weight:600;font-size:14px;margin-bottom:8px;">Vibes Diagnostic</div>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          ${vibesRows}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- Axis labels -->
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td width="130" style="padding-right:12px;"></td>
        <td style="font-size:11px;color:#999999;padding-bottom:12px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="text-align:left;">Less Likely</td>
              <td style="text-align:center;">Neutral</td>
              <td style="text-align:right;">More Likely</td>
            </tr>
          </table>
        </td>
        <td width="100"></td>
      </tr>
    </table>
  </td></tr>

  <!-- Sliders -->
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      ${sliderRows}
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding-top:32px;font-size:12px;color:#999999;border-top:1px solid #eeeeee;margin-top:24px;">
    Generated by ${esc(CONFIG.QUIZ_NAME)}
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function esc(s) {
  if (!s) return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
