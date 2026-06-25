// ─── CONFIG ─────────────────────────────────────────────────────────────────
// Change this to whoever should receive a copy of every quiz result.
// When you're done testing, swap in your colleague's email.

const CONFIG = {
  OWNER_EMAIL: "youremail@gmail.com",  // ← change this to your email
  OWNER_NAME: "Signature Profile",
  QUIZ_NAME: "Signature Profile",
};

// ─── WEB APP ENTRY POINT ────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, vibes, results, leather, impressions, chemistry, allResponses } = data;

    if (!name || !email || !results) {
      return jsonResponse({ success: false, error: "Missing required fields" });
    }

    const subjectForTaker = `Your Scent Profile Results — ${CONFIG.QUIZ_NAME}`;
    const subjectForOwner = `New Quiz Result: ${name} — ${CONFIG.QUIZ_NAME}`;

    const htmlBody = buildEmailHtml(name, vibes, results);
    const ownerHtml = htmlBody + buildConsultantNotes(leather, results, impressions, chemistry, email, allResponses);

    // Send to quiz taker
    GmailApp.sendEmail(email, subjectForTaker, "", {
      htmlBody: htmlBody,
      name: CONFIG.OWNER_NAME,
    });

    // Send copy to owner with consultant notes
    GmailApp.sendEmail(CONFIG.OWNER_EMAIL, subjectForOwner, "", {
      htmlBody: ownerHtml,
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

  var top3 = results.slice().filter(function(r) { return r.key !== "smoky"; }).sort(function(a, b) { return b.score - a.score; }).slice(0, 3).map(function(r) { return r.name; }).join(" · ");

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
    <p style="margin:0;font-family:' + SERIF + ';font-size:17px;font-weight:400;font-style:italic;color:' + INK_MID + ';line-height:1.55;" class="ink-mid">Your strongest affinities lean toward <em>' + esc(top3) + '</em>. Below, your coordinates across thirteen scent families show what notes you’re more or less likely to enjoy.</p>\
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
        <td style="font-family:' + SANS + ';font-size:9px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';" class="ink-dim">Your Fragrance Profile Diagnostic</td>\
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

function buildConsultantNotes(leather, results, impressions, chemistry, clientEmail, allResponses) {
  var PAPER   = "#e7e0d0";
  var INK     = "#221e18";
  var INK_MID = "#6a6053";
  var INK_DIM = "#9a8f7d";
  var RULE    = "#d2c8b2";
  var SERIF   = "'Cormorant', Georgia, 'Times New Roman', serif";
  var SANS    = "'Syne', 'Helvetica Neue', Arial, sans-serif";

  var interpretation = leather ? 'Response did not match a known option.' : 'No leather response recorded.';
  if (leather === 'I don’t enjoy leather at all') {
    interpretation = 'Strong negative — Musk direction. Rules out Magnetic profile.';
  } else if (leather === 'Soft and powdery suede') {
    interpretation = 'Leans musk — clean and minimalist lean.';
  } else if (leather === 'Classic clean leather') {
    interpretation = 'Balanced — no strong directional signal.';
  } else if (leather === 'Rich, smoky tanned leather') {
    interpretation = 'Leans feral — Magnetic or Smoky/Leathery lean.';
  } else if (leather === 'Intensely animalic raw hide') {
    interpretation = 'Strong feral — confirms Magnetic profile.';
  }

  var ranked = results.slice().sort(function(a, b) { return b.score - a.score; });
  var tableRows = ranked.map(function(r, i) {
    return '\
      <tr>\
        <td style="padding:5px 10px;font-family:' + SANS + ';font-size:13px;color:' + INK + ';border-bottom:1px solid ' + RULE + ';text-align:center;">' + (i + 1) + '</td>\
        <td style="padding:5px 10px;font-family:' + SERIF + ';font-size:14px;color:' + INK + ';border-bottom:1px solid ' + RULE + ';">' + esc(r.name) + '</td>\
        <td style="padding:5px 10px;font-family:' + SANS + ';font-size:13px;color:' + INK + ';border-bottom:1px solid ' + RULE + ';text-align:center;">' + r.score.toFixed(2) + '</td>\
        <td style="padding:5px 10px;font-family:' + SANS + ';font-size:13px;color:' + INK + ';border-bottom:1px solid ' + RULE + ';text-align:center;">' + r.pct + '%</td>\
        <td style="padding:5px 10px;font-family:' + SANS + ';font-size:13px;color:' + INK_MID + ';border-bottom:1px solid ' + RULE + ';">' + esc(r.label) + '</td>\
      </tr>';
  }).join('');

  var gap = ranked.length >= 2 ? (ranked[0].score - ranked[1].score) : 0;
  var gapText = 'Gap #1 vs #2: ' + gap.toFixed(2) + ' — ' + (gap > 0.5 ? 'Clear dominant signal' : 'Blended profile — review top 3');

  var impressionRows = '';
  if (impressions && impressions.length) {
    impressionRows = impressions.map(function(a) {
      return '\
        <tr>\
          <td style="padding:5px 10px;font-family:' + SERIF + ';font-size:14px;color:' + INK + ';border-bottom:1px solid ' + RULE + ';">' + esc(a.axis) + '</td>\
          <td style="padding:5px 10px;font-family:' + SANS + ';font-size:13px;color:' + INK + ';border-bottom:1px solid ' + RULE + ';text-align:center;">' + a.score.toFixed(2) + '</td>\
          <td style="padding:5px 10px;font-family:' + SANS + ';font-size:12px;color:' + INK_MID + ';border-bottom:1px solid ' + RULE + ';">' + esc(a.neg) + '</td>\
          <td style="padding:5px 10px;font-family:' + SANS + ';font-size:12px;color:' + INK_MID + ';border-bottom:1px solid ' + RULE + ';">' + esc(a.pos) + '</td>\
        </tr>';
    }).join('');
  }

  return '\
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:' + PAPER + ';">\
<tr><td align="center" style="padding:0 20px 48px;">\
<table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">\
  <tr><td style="border-top:2px solid ' + RULE + ';padding-top:28px;">\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:16px;">Consultant Notes</div>\
    <div style="font-family:' + SERIF + ';font-size:15px;color:' + INK_MID + ';margin-bottom:4px;">Results sent to: <span style="color:' + INK + ';font-weight:500;">' + esc(clientEmail) + '</span></div>\
  </td></tr>\
\
  <tr><td style="padding-bottom:20px;">\
    <div style="font-family:' + SERIF + ';font-size:15px;font-weight:500;color:' + INK + ';margin-bottom:4px;">Leather / Feral–Musk Spectrum</div>\
    <div style="font-family:' + SERIF + ';font-size:15px;font-style:italic;color:' + INK_MID + ';">Response: ' + esc(leather || '—') + '</div>\
    <div style="font-family:' + SERIF + ';font-size:15px;color:' + INK + ';margin-top:8px;">' + interpretation + '</div>\
  </td></tr>\
\
  <tr><td style="padding-bottom:20px;">\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:12px;">Category Rankings</div>\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">\
      <tr style="background:' + RULE + ';">\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:center;">Rank</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">Category</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:center;">Score</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:center;">Strength</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">Label</th>\
      </tr>\
      ' + tableRows + '\
    </table>\
  </td></tr>\
\
  <tr><td style="padding-bottom:20px;">\
    <div style="font-family:' + SERIF + ';font-size:15px;font-weight:500;color:' + INK + ';">' + gapText + '</div>\
  </td></tr>\
\
  <tr><td style="padding-bottom:12px;">\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:12px;">Impressions — Vibe Axes</div>\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">\
      <tr style="background:' + RULE + ';">\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">Axis</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:center;">Score</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">− Pole</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">+ Pole</th>\
      </tr>\
      ' + impressionRows + '\
    </table>\
  </td></tr>\
\
  <tr><td style="padding-top:8px;padding-bottom:20px;">\
    ' + buildProfileMatch(impressions, SERIF, SANS, INK, INK_MID, INK_DIM, RULE) + '\
  </td></tr>\
\
  <tr><td style="padding-bottom:12px;">\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:12px;">Chemistry — Skin Profile</div>\
    ' + buildChemistryRows(chemistry, SERIF, SANS, INK, INK_MID, RULE) + '\
  </td></tr>\
\
  <tr><td style="padding-bottom:12px;">\
    ' + buildResponseLog(allResponses, SERIF, SANS, INK, INK_MID, INK_DIM, RULE) + '\
  </td></tr>\
</table>\
</td></tr>\
</table>';
}

function buildProfileMatch(impressions, SERIF, SANS, INK, INK_MID, INK_DIM, RULE) {
  if (!impressions || !impressions.length) return '';

  var PROFILES = [
    { name:'Clean and minimalist', L:[0,2], S:[0,2], P:[-2,0], T:[0,2], notes:'ANIMALIC / Musk · ATMOSPHERIC · WOODY dry' },
    { name:'Bright and cheerful', L:[1,2], S:[-1,1], P:[0,2], T:[0,2], notes:'CITRUS · FRUITY · FLORAL fruity-floral' },
    { name:'Aromatic and fresh', L:[0,2], S:[-2,0], P:[-1,1], T:[-1,1], notes:'GREEN camphoraceous · GREEN herbal · ATMOSPHERIC' },
    { name:'Romantic and soft', L:[-1,0], S:[-2,0], P:[-2,-1], T:[-2,0], notes:'FLORAL rose + powdery · ANIMALIC musk' },
    { name:'Soft and ambery', L:[-1,0], S:[-2,-1], P:[-2,-1], T:[-2,-1], notes:'RESINOUS amber · FLORAL powdery · ANIMALIC musk' },
    { name:'Magnetic', L:[-1,1], S:[0,2], P:[1,2], T:[0,2], notes:'ANIMALIC feral + leather · FLORAL indolic · SPICY' },
    { name:'Smoky and leathery', L:[-2,-1], S:[-1,1], P:[0,1], T:[-2,-1], notes:'SMOKY · ANIMALIC leather · AGRESTIC · WOODY smoky' },
    { name:'Opulent and resinous', L:[-2,-1], S:[-1,1], P:[1,2], T:[-2,-1], notes:'RESINOUS incense + amber · SPICY · EARTHY' },
    { name:'Warm and edible', L:[0,1], S:[-2,-1], P:[-2,-1], T:[-2,-1], notes:'GOURMAND sweet + roasted · RESINOUS amber' },
    { name:'Nature — earthy and woodsy', L:[-1,0], S:[-2,-1], P:[-1,0], T:[-2,-1], notes:'EARTHY · WOODY · AGRESTIC · GREEN sharp' },
    { name:'Nature — sea and sky', L:[0,2], S:[-1,1], P:[0,1], T:[0,2], notes:'ATMOSPHERIC marine + ozonic · GREEN · CITRUS' },
  ];

  var client = {};
  impressions.forEach(function(a) { client[a.code] = a.score; });

  var distances = PROFILES.map(function(p) {
    var midL = (p.L[0] + p.L[1]) / 2;
    var midS = (p.S[0] + p.S[1]) / 2;
    var midP = (p.P[0] + p.P[1]) / 2;
    var midT = (p.T[0] + p.T[1]) / 2;
    var d = Math.abs(client.L - midL) + Math.abs(client.S - midS) + Math.abs(client.P - midP) + Math.abs(client.T - midT);
    return { name: p.name, notes: p.notes, distance: Math.round(d * 100) / 100 };
  });

  distances.sort(function(a, b) { return a.distance - b.distance; });
  var primary = distances[0];
  var secondary = distances[1];

  return '\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:12px;">Impressions — Profile Match</div>\
    <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid ' + RULE + ';">\
      <div style="font-family:' + SANS + ';font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';margin-bottom:4px;">Primary Profile</div>\
      <div style="font-family:' + SERIF + ';font-size:18px;font-weight:500;color:' + INK + ';">' + esc(primary.name) + '</div>\
      <div style="font-family:' + SERIF + ';font-size:14px;font-style:italic;color:' + INK_MID + ';margin-top:4px;">' + esc(primary.notes) + '</div>\
      <div style="font-family:' + SANS + ';font-size:11px;color:' + INK_MID + ';margin-top:4px;">Distance: ' + primary.distance.toFixed(2) + '</div>\
    </div>\
    <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid ' + RULE + ';">\
      <div style="font-family:' + SANS + ';font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';margin-bottom:4px;">Secondary Profile</div>\
      <div style="font-family:' + SERIF + ';font-size:18px;font-weight:500;color:' + INK + ';">' + esc(secondary.name) + '</div>\
      <div style="font-family:' + SERIF + ';font-size:14px;font-style:italic;color:' + INK_MID + ';margin-top:4px;">' + esc(secondary.notes) + '</div>\
      <div style="font-family:' + SANS + ';font-size:11px;color:' + INK_MID + ';margin-top:4px;">Distance: ' + secondary.distance.toFixed(2) + '</div>\
    </div>';
}

function buildChemistryRows(chemistry, SERIF, SANS, INK, INK_MID, RULE) {
  if (!chemistry) return '';
  var questions = [
    { id:'c1', label:'Longevity' },
    { id:'c2', label:'Skin Type' },
    { id:'c3', label:'Citrus Behavior' },
    { id:'c4', label:'Sweetness Amplification' },
    { id:'c5', label:'Sensitivities' },
  ];
  var insights = {
    c1: function(ans) {
      var opts = ['They fade within an hour or two','They last a little less than I’d expect','They last about as long as advertised','They last a bit longer than expected','They last all day or longer'];
      var idx = opts.indexOf(ans);
      if (idx <= 1) return 'Alkaline skin likely. Recommend moisturizer on damp skin before application, emphasize strong base notes, higher concentrations.';
      if (idx >= 3) return 'Likely acidic/oily skin — ideal for perfume. Light scents work well.';
      return 'Neutral longevity — no specific adjustment needed.';
    },
    c2: function(ans) {
      var opts = ['Very dry — often feels tight, rarely gets shiny','Somewhat dry — occasionally needs moisture','Balanced — neither oily nor dry','Somewhat oily — gets a little shiny by midday','Very oily — noticeably shiny within a few hours'];
      var idx = opts.indexOf(ans);
      if (idx <= 1) return 'Dry skin: avoid citrus-led, recommend higher concentrations. Lean toward resins, woods, spices, vanilla.';
      if (idx >= 3) return 'Oily skin: fresh, citrus, aquatic, woody fragrances work well.';
      return 'Balanced skin — no specific adjustment needed.';
    },
    c3: function(ans) {
      var opts = ['Much sharper or more aggressive than I’d expect','Slightly sharper than on the strip or bottle','About the same as on the strip or bottle','Slightly softer or more muted on me','I haven’t worn citrus scents'];
      var idx = opts.indexOf(ans);
      if (idx <= 1) return 'Skin may be alkaline. Recommend hydrating before application, steer away from citrus-led fragrances, lean toward bergamot over lemon/lime.';
      if (idx === 4) return 'No citrus experience to reference.';
      if (idx === 3) return 'Citrus is softened on skin — may need brighter citrus formulations.';
      return 'Citrus behaves normally on skin.';
    },
    c4: function(ans) {
      var opts = ['Always — everything smells much sweeter on me','Often — I notice this regularly','Sometimes — it depends on the fragrance','Rarely — scents smell close to how I expect','Never — scents smell the same or drier on me'];
      var idx = opts.indexOf(ans);
      if (idx <= 1) return 'Sweetness amplification detected. Recommend moisturizing and hydrating before application. Consider applying on clothes or hair rather than skin. Avoid gourmand-on-skin combinations.';
      if (idx >= 3) return 'No sweetness amplification — gourmand and sweet notes perform as expected.';
      return 'Occasional sweetness amplification — monitor with specific fragrances.';
    },
    c5: function(ans) {
      if (!ans || !ans.trim()) return 'No sensitivities reported.';
      return 'Flag for review before session. Common watch items: synthetic musks (Iso E Super), oakmoss/IFRA-restricted materials, high-pitched florals triggering headaches.';
    },
  };
  return questions.map(function(q) {
    var answer = chemistry[q.id] || '—';
    var insight = insights[q.id] ? insights[q.id](answer) : '';
    return '\
    <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid ' + RULE + ';">\
      <div style="font-family:' + SANS + ';font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';margin-bottom:4px;">' + esc(q.label) + '</div>\
      <div style="font-family:' + SERIF + ';font-size:15px;font-style:italic;color:' + INK_MID + ';margin-bottom:6px;">Response: ' + esc(answer) + '</div>\
      <div style="font-family:' + SERIF + ';font-size:14px;color:' + INK + ';">' + esc(insight) + '</div>\
    </div>';
  }).join('');
}

function buildResponseLog(allResponses, SERIF, SANS, INK, INK_MID, INK_DIM, RULE) {
  if (!allResponses || !allResponses.length) return '';
  var lastSection = '';
  var rows = allResponses.map(function(r, i) {
    var sectionCell = '';
    if (r.section !== lastSection) {
      var count = 0;
      for (var j = i; j < allResponses.length && allResponses[j].section === r.section; j++) count++;
      sectionCell = '<td rowspan="' + count + '" style="padding:6px 10px;font-family:' + SANS + ';font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:' + INK + ';border-bottom:1px solid ' + RULE + ';vertical-align:top;white-space:nowrap;">' + esc(r.section) + '</td>';
      lastSection = r.section;
    }
    return '\
      <tr>\
        ' + sectionCell + '\
        <td style="padding:6px 10px;font-family:' + SERIF + ';font-size:13px;color:' + INK_MID + ';border-bottom:1px solid ' + RULE + ';vertical-align:top;">' + esc(r.question) + '</td>\
        <td style="padding:6px 10px;font-family:' + SERIF + ';font-size:13px;font-weight:500;color:' + INK + ';border-bottom:1px solid ' + RULE + ';vertical-align:top;">' + esc(r.answer) + '</td>\
      </tr>';
  }).join('');
  return '\
    <div style="font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:' + INK_DIM + ';margin-bottom:12px;">All Responses</div>\
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">\
      <tr style="background:' + RULE + ';">\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">Section</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">Question</th>\
        <th style="padding:6px 10px;font-family:' + SANS + ';font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:' + INK + ';text-align:left;">Response</th>\
      </tr>\
      ' + rows + '\
    </table>';
}

function esc(s) {
  if (!s) return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
