// ─── CONFIG ─────────────────────────────────────────────────────────────────
// Change this to whoever should receive a copy of every quiz result.
// When you're done testing, swap in your colleague's email.

const CONFIG = {
  OWNER_EMAIL: "youremail@gmail.com",  // ← change this to your email
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

function lerpColor(pct) {
  var lo  = [126, 138, 145];
  var mid = [199, 188, 162];
  var hi  = [184, 125, 34];
  var r, g, b;
  if (pct <= 50) {
    var t = pct / 50;
    r = Math.round(lo[0] + (mid[0]-lo[0])*t); g = Math.round(lo[1] + (mid[1]-lo[1])*t); b = Math.round(lo[2] + (mid[2]-lo[2])*t);
  } else {
    var t2 = (pct-50)/50;
    r = Math.round(mid[0] + (hi[0]-mid[0])*t2); g = Math.round(mid[1] + (hi[1]-mid[1])*t2); b = Math.round(mid[2] + (hi[2]-mid[2])*t2);
  }
  return "rgb(" + r + "," + g + "," + b + ")";
}

function buildEmailHtml(name, vibes, results) {
  var PAPER   = "#e7e0d0";
  var PAPER2  = "#ded4c0";
  var INK     = "#221e18";
  var INK_MID = "#6a6053";
  var INK_DIM = "#9a8f7d";
  var RULE    = "#d2c8b2";
  var RED_DEEP= "#9c2a1c";
  var SERIF   = "'Cormorant', Georgia, 'Times New Roman', serif";
  var SANS    = "'Syne', 'Helvetica Neue', Arial, sans-serif";

  var top3 = results.slice().sort(function(a, b) { return b.score - a.score; }).slice(0, 3).map(function(r) { return r.name; }).join(" · ");

  var vibesRows = [
    { id: "v1", q: "Looking for a scent for…" },
    { id: "v2", q: "Scent should be…" },
    { id: "v3", q: "Fragrance style…" },
    { id: "v4", q: "Fragrance personality…" },
    { id: "v5", q: "Scent presence…" },
  ].map(function(v) { return '\
    <tr>\
      <td style="padding:6px 0;font-family:' + SERIF + ';font-size:15px;font-style:italic;color:' + INK_MID + ';vertical-align:top;" class="ink-mid">' + v.q + '</td>\
      <td style="padding:6px 0 6px 12px;font-family:' + SERIF + ';font-size:15px;font-weight:400;color:' + INK + ';vertical-align:top;" class="ink">' + esc(vibes[v.id] || "—") + '</td>\
    </tr>';
  }).join("");

  var sliderRows = results.map(function(r) {
    var pct = Math.max(3, Math.min(97, r.pct));
    var scoreStr = (r.score > 0 ? "+" : "") + r.score;
    var dotColor = lerpColor(pct);
    return '\
    <tr>\
      <td style="padding:7px 14px 7px 0;text-align:right;font-family:' + SERIF + ';font-size:16px;font-weight:500;color:' + INK + ';width:120px;vertical-align:middle;" class="ink">\
        ' + esc(r.name) + '\
      </td>\
      <td style="padding:7px 0;vertical-align:middle;">\
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">\
          <tr>\
            <td style="width:' + pct + '%;height:3px;background:' + RULE + ';"></td>\
            <td style="width:12px;vertical-align:middle;">\
              <div style="width:12px;height:12px;border-radius:6px;background:' + dotColor + ';border:2px solid ' + PAPER + ';" class="dot-border"></div>\
            </td>\
            <td style="height:3px;background:' + RULE + ';"></td>\
          </tr>\
        </table>\
      </td>\
      <td style="padding:7px 0 7px 14px;font-family:' + SANS + ';font-size:9px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:' + INK_MID + ';width:90px;vertical-align:middle;white-space:nowrap;" class="ink-mid">\
        ' + r.label + '\
      </td>\
    </tr>';
  }).join("");

  return '\
<!DOCTYPE html>\
<html>\
<head>\
<meta charset="utf-8">\
<meta name="color-scheme" content="light dark">\
<meta name="supported-color-schemes" content="light dark">\
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..600;1,300..600&family=Syne:wght@400..800&display=swap" rel="stylesheet">\
<style>\
  :root { color-scheme: light dark; }\
  @media (prefers-color-scheme: dark) {\
    body, .bg { background: #111111 !important; }\
    h1, .ink { color: #e7e0d0 !important; }\
    .ink-mid { color: #9a8f7d !important; }\
    .ink-dim { color: #7a7060 !important; }\
    .rule { border-color: #3a3530 !important; }\
    .dot-border { border-color: #111111 !important; }\
  }\
</style>\
</head>\
<body style="margin:0;padding:0;background:' + PAPER + ';font-family:' + SERIF + ';color:' + INK + ';" class="bg">\
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:' + PAPER + ';" class="bg">\
<tr><td align="center" style="padding:48px 20px;">\
<table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">\
\
  <!-- Top frame label -->\
  <tr><td style="padding-bottom:40px;">\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\
      <tr>\
        <td style="font-family:' + SANS + ';font-size:10px;font-weight:500;letter-spacing:0.34em;text-transform:uppercase;color:' + INK_MID + ';" class="ink-mid">Top Note</td>\
        <td style="text-align:center;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:' + RED_DEEP + ';">Signature Profile</td>\
        <td style="text-align:right;font-family:' + SANS + ';font-size:10px;font-weight:500;letter-spacing:0.34em;text-transform:uppercase;color:' + INK_MID + ';" class="ink-mid">' + esc(name) + '</td>\
      </tr>\
    </table>\
  </td></tr>\
\
  <!-- Headline -->\
  <tr><td style="padding-bottom:8px;">\
    <h1 style="margin:0;font-family:' + SERIF + ';font-size:36px;font-weight:500;line-height:1.0;color:' + INK + ';">' + esc(name) + '’s<br>scent map.</h1>\
  </td></tr>\
  <tr><td style="padding-bottom:40px;">\
    <p style="margin:0;font-family:' + SERIF + ';font-size:17px;font-weight:400;font-style:italic;color:' + INK_MID + ';line-height:1.55;" class="ink-mid">Your strongest affinities lean toward <em>' + esc(top3) + '</em>. Below, your coordinates across twelve scent families show what notes you’re more or less likely to enjoy.</p>\
  </td></tr>\
\
  <!-- Vibes Diagnostic -->\
  <tr><td style="border-top:1px solid ' + RULE + ';border-bottom:1px solid ' + RULE + ';padding:22px 0;margin-bottom:40px;" class="rule">\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:16px;" class="ink-dim">Vibes Diagnostic</div>\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\
      ' + vibesRows + '\
    </table>\
  </td></tr>\
\
  <tr><td style="height:40px;"></td></tr>\
\
  <!-- Scent Map header -->\
  <tr><td style="padding-bottom:20px;">\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';" class="ink-dim">The Scent Map</div>\
  </td></tr>\
\
  <!-- Axis labels -->\
  <tr><td>\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\
      <tr>\
        <td width="120" style="padding-right:14px;"></td>\
        <td style="font-family:' + SANS + ';font-size:8px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:' + INK_DIM + ';padding-bottom:18px;">\
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\
            <tr>\
              <td style="text-align:left;">Less Likely</td>\
              <td style="text-align:right;">More Likely</td>\
            </tr>\
          </table>\
        </td>\
        <td width="90"></td>\
      </tr>\
    </table>\
  </td></tr>\
\
  <!-- Sliders -->\
  <tr><td>\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\
      ' + sliderRows + '\
    </table>\
  </td></tr>\
\
  <!-- Footer -->\
  <tr><td style="padding-top:68px;">\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\
      <tr>\
        <td style="font-family:' + SANS + ';font-size:9px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';" class="ink-dim">A Signature Scent Diagnostic</td>\
        <td style="text-align:right;font-family:' + SANS + ';font-size:9px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';" class="ink-dim">Top Note</td>\
      </tr>\
    </table>\
  </td></tr>\
\
</table>\
</td></tr>\
</table>\
</body>\
</html>';
}

function esc(s) {
  if (!s) return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
