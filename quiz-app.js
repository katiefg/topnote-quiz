/* Top Note Scent Quiz — render + interaction. Vanilla. */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCL2u0BRiMfk3V0CmySScHl8_WPMwcyz7zHyHqxXduS1tThgtDpjNz3E5cZS9AnDHbkw/exec"; // ← paste your Apps Script web-app URL here to enable email delivery

const state = { phase: "intro", idx: 0, name: "", email: "", vibes: {}, scent: {}, impressions: {}, chemistry: {}, emailSent: false };

const $ = (id) => document.getElementById(id);
const app = () => $("app");

function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

/* editorial page-margin labels */
function setFrame(left, center, right) {
  $("fLeft").textContent = left || "Top Note";
  $("fCenter").textContent = center || "";
  $("fRight").textContent = right || "";
}

function introReady() {
  return state.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email.trim());
}

const DOMAIN_TYPOS = {
  // gmail
  "gmial.com":"gmail.com", "gmai.com":"gmail.com", "gmal.com":"gmail.com",
  "gamil.com":"gmail.com", "gnail.com":"gmail.com", "gmail.co":"gmail.com",
  "gmail.cm":"gmail.com", "gmaill.com":"gmail.com", "gmali.com":"gmail.com",
  "gmill.com":"gmail.com", "gmil.com":"gmail.com", "gmaul.com":"gmail.com",
  "gmale.com":"gmail.com", "gemail.com":"gmail.com", "gmaik.com":"gmail.com",
  "gmaio.com":"gmail.com", "gmaiil.com":"gmail.com", "gamial.com":"gmail.com",
  "gimail.com":"gmail.com", "gmail.con":"gmail.com",
  "gmail.om":"gmail.com", "gmail.vom":"gmail.com", "gmail.xom":"gmail.com",
  "gmail.comm":"gmail.com", "gmaol.com":"gmail.com",
  "gmqil.com":"gmail.com", "gmeil.com":"gmail.com",
  // yahoo
  "yahooo.com":"yahoo.com", "yaho.com":"yahoo.com", "yaoo.com":"yahoo.com",
  "yahoo.co":"yahoo.com", "yhaoo.com":"yahoo.com", "yshoo.com":"yahoo.com",
  "yahho.com":"yahoo.com", "yahpp.com":"yahoo.com", "yahpo.com":"yahoo.com",
  "yahooo.com":"yahoo.com", "yhoo.com":"yahoo.com", "yahooi.com":"yahoo.com",
  "yahoo.con":"yahoo.com", "yahoo.cm":"yahoo.com", "yahoo.om":"yahoo.com",
  "yahoo.comm":"yahoo.com", "tahoo.com":"yahoo.com", "uahoo.com":"yahoo.com",
  "yaboo.com":"yahoo.com", "yanoo.com":"yahoo.com", "yaho.com":"yahoo.com",
  "yahhoo.com":"yahoo.com", "yahool.com":"yahoo.com",
  // hotmail
  "hotmal.com":"hotmail.com", "hotmial.com":"hotmail.com", "hotmai.com":"hotmail.com",
  "hotmail.co":"hotmail.com", "hotamil.com":"hotmail.com", "hotmali.com":"hotmail.com",
  "hotmaill.com":"hotmail.com", "hotmil.com":"hotmail.com", "hotmaol.com":"hotmail.com",
  "hotmail.con":"hotmail.com", "hotmail.cm":"hotmail.com", "hotmale.com":"hotmail.com",
  "hotmsil.com":"hotmail.com", "jotmail.com":"hotmail.com", "hitmail.com":"hotmail.com",
  "hotail.com":"hotmail.com", "hotmaik.com":"hotmail.com",
  // outlook
  "outlok.com":"outlook.com", "outloo.com":"outlook.com", "outlool.com":"outlook.com",
  "outlook.co":"outlook.com", "outllook.com":"outlook.com", "outlokk.com":"outlook.com",
  "outloook.com":"outlook.com", "ourlook.com":"outlook.com", "oitlook.com":"outlook.com",
  "outlook.con":"outlook.com", "outlook.cm":"outlook.com", "putlook.com":"outlook.com",
  "outlookk.com":"outlook.com", "outllok.com":"outlook.com", "outluk.com":"outlook.com",
  // icloud
  "iclould.com":"icloud.com", "icloud.co":"icloud.com", "iclod.com":"icloud.com",
  "icoud.com":"icloud.com", "icload.com":"icloud.com", "iclould.com":"icloud.com",
  "icloud.con":"icloud.com", "icloud.cm":"icloud.com", "iclould.com":"icloud.com",
  "iclud.com":"icloud.com", "icloudd.com":"icloud.com", "icolud.com":"icloud.com",
  // aol
  "aol.co":"aol.com", "aol.con":"aol.com", "aol.cm":"aol.com",
  "aol.comm":"aol.com", "ail.com":"aol.com", "apl.com":"aol.com",
  // protonmail
  "protonmal.com":"protonmail.com", "protonmial.com":"protonmail.com",
  "protonmail.con":"protonmail.com", "protonmail.co":"protonmail.com",
  // common TLD typos for any domain
  "me.co":"me.com",
};

function checkEmailTypo(email) {
  const domain = email.trim().split("@")[1];
  if (!domain) return null;
  const suggestion = DOMAIN_TYPOS[domain.toLowerCase()];
  if (suggestion) return email.trim().split("@")[0] + "@" + suggestion;
  return null;
}

function render(soft) {
  const el = app();
  if (soft) {
    el.classList.add("fading-out");
    setTimeout(() => {
      el.classList.remove("fading-out");
      el.classList.remove("fade"); void el.offsetWidth; el.classList.add("fade");
      renderPhase(el);
    }, 300);
  } else {
    el.classList.remove("fading-out");
    el.classList.remove("fade"); void el.offsetWidth; el.classList.add("fade");
    renderPhase(el);
  }
}

function renderPhase(el) {
  switch (state.phase) {
    case "intro":                  return renderIntro(el);
    case "vibes":                  return renderVibes(el);
    case "interstitial":           return renderInterstitial(el);
    case "scent":                  return renderScent(el);
    case "impressions-interstitial": return renderImpressionsInterstitial(el);
    case "impressions":            return renderImpressions(el);
    case "chemistry-interstitial": return renderChemistryInterstitial(el);
    case "chemistry":              return renderChemistry(el);
    case "results":                return renderResults(el);
  }
}

function renderIntro(el) {
  setFrame("Top Note", "Fragrance Curators", "Est. SF");
  el.innerHTML = `
    <div class="cover">
      <div class="cover-bloom" aria-hidden="true"></div>
      <div class="cover-copy">
        <p class="eyebrow">Your Fragrance Profile Diagnostic</p>
        <h1>Find your<br>signature.</h1>
      </div>
    </div>
    <div class="divider"></div>
    <label class="field-label" for="nameInput">Your name</label>
    <input class="text-input" type="text" placeholder="Enter your name" id="nameInput" value="${esc(state.name)}">
    <label class="field-label" for="emailInput" style="margin-top:16px;">Your email</label>
    <input class="text-input" type="email" placeholder="your@email.com" id="emailInput" value="${esc(state.email)}">
    <p class="email-note">We'll send your scent profile results here.</p>
    <div id="emailHint"></div>
    <div class="nav">
      <span></span>
      <button class="btn-primary" id="startBtn" ${introReady() ? "" : "disabled"}>Begin</button>
    </div>
  `;
  const updateStart = () => {
    $("startBtn").disabled = !introReady();
    const hint = $("emailHint");
    const suggestion = checkEmailTypo(state.email);
    if (suggestion) {
      hint.innerHTML = '<p class="email-typo">Did you mean <a href="#" id="fixEmail">' + esc(suggestion) + '</a>?</p>';
      $("fixEmail").addEventListener("click", e => {
        e.preventDefault();
        state.email = suggestion;
        $("emailInput").value = suggestion;
        updateStart();
      });
    } else {
      hint.innerHTML = '';
    }
  };
  $("nameInput").addEventListener("input", e => { state.name = e.target.value; updateStart(); });
  $("emailInput").addEventListener("input", e => { state.email = e.target.value; updateStart(); });
  $("emailInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && introReady()) $("startBtn").click();
  });
  $("nameInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && introReady()) $("startBtn").click();
  });
  $("startBtn").addEventListener("click", () => { state.phase = "vibes"; state.idx = 0; render(true); });
}

function optionList(opts, getSel, onPick) {
  const box = $("options");
  let picked = false;
  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (getSel() === opt ? " selected" : "");
    btn.innerHTML = `<span class="mk"></span>${esc(opt)}`;
    btn.addEventListener("click", () => {
      if (picked) return;
      picked = true;
      box.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      setTimeout(() => onPick(opt), 320);
    });
    box.appendChild(btn);
  });
}

function renderVibes(el) {
  const q = VIBES_QUESTIONS[state.idx];
  const pct = ((state.idx + 1) / VIBES_QUESTIONS.length) * 100;
  setFrame("Top Note", "Part I · Vibes", "");
  el.innerHTML = `
    <div class="progress-head">
      <span class="progress-text">Vibes Diagnostic</span>
      <span class="progress-text">${state.idx+1} of ${VIBES_QUESTIONS.length}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <p class="q-index">No. ${String(state.idx+1).padStart(2,"0")}</p>
    <p class="question-text">${esc(q.text)}</p>
    <div id="options"></div>
    <div class="nav">
      ${state.idx > 0 ? '<button class="btn-back" id="backBtn">&larr; Back</button>' : "<span></span>"}
      <span></span>
    </div>
  `;
  optionList(q.options, () => state.vibes[q.id], (opt) => {
    state.vibes[q.id] = opt;
    if (state.idx < VIBES_QUESTIONS.length - 1) state.idx++;
    else { state.phase = "interstitial"; state.idx = 0; }
    render(true);
  });
  if ($("backBtn")) $("backBtn").addEventListener("click", () => { state.idx--; render(true); });
}

function renderInterstitial(el) {
  setFrame("Top Note", "Intermission", "");
  el.innerHTML = `
    <div class="interstitial">
      <image-slot id="tn-hero-mid-2" class="hero hero-mid" shape="circle"
        src="assets/scent-profile-3.jpg" placeholder="Drop an image"></image-slot>
      <div class="section-num">Part II</div>
      <h2>The Scent<br>Profile</h2>
      <p>Tell us how much you enjoy each of these fifty scents. There may be scents that you love in the wild, but might not want to smell like — in that case, err on the side of dislike.</p>
      <button class="btn-primary" id="continueBtn">Continue</button>
      <div style="margin-top:20px;">
        <button class="btn-back" id="backBtn">&larr; Back</button>
      </div>
    </div>
  `;
  $("backBtn").addEventListener("click", () => { state.phase = "vibes"; state.idx = VIBES_QUESTIONS.length - 1; render(true); });
  $("continueBtn").addEventListener("click", () => { state.phase = "scent"; state.idx = 0; render(true); });
}

function renderScent(el) {
  const q = SCENT_QUESTIONS[state.idx];
  const pct = ((state.idx + 1) / SCENT_QUESTIONS.length) * 100;
  setFrame("Top Note", "Part II · Scent Profile", "");
  el.innerHTML = `
    <div class="progress-head">
      <span class="progress-text">Scent Profile</span>
      <span class="progress-text">${state.idx+1} of ${SCENT_QUESTIONS.length}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <p class="q-index">No. ${String(state.idx+1).padStart(2,"0")}</p>
    <p class="question-text">${esc(q.text)}</p>
    <div id="options"></div>
    <div class="nav">
      <button class="btn-back" id="backBtn">&larr; Back</button>
      <span class="answered-count">${state.idx+1} / ${SCENT_QUESTIONS.length}</span>
    </div>
  `;
  const opts = q.spectrum ? q.spectrum.map(s => s.label) : SCENT_OPTIONS;
  optionList(opts, () => state.scent[q.id], (opt) => {
    state.scent[q.id] = opt;
    if (state.idx < SCENT_QUESTIONS.length - 1) state.idx++;
    else { state.phase = "impressions-interstitial"; state.idx = 0; }
    render(true);
  });
  $("backBtn").addEventListener("click", () => {
    if (state.idx > 0) state.idx--;
    else { state.phase = "interstitial"; state.idx = 0; }
    render(true);
  });
}

function renderImpressionsInterstitial(el) {
  setFrame("Top Note", "Intermission", "");
  el.innerHTML = `
    <div class="interstitial">
      <div class="dot" style="margin-bottom:30px;"></div>
      <div class="section-num">Part III</div>
      <h2>Impressions</h2>
      <p>Choose the image that speaks to you most in each set. Go with your gut.</p>
      <button class="btn-primary" id="continueBtn">Continue</button>
      <div style="margin-top:20px;">
        <button class="btn-back" id="backBtn">&larr; Back</button>
      </div>
    </div>
  `;
  $("backBtn").addEventListener("click", () => { state.phase = "scent"; state.idx = SCENT_QUESTIONS.length - 1; render(true); });
  $("continueBtn").addEventListener("click", () => { state.phase = "impressions"; state.idx = 0; render(true); });
}

function renderImpressions(el) {
  const q = IMPRESSION_QUESTIONS[state.idx];
  const pct = ((state.idx + 1) / IMPRESSION_QUESTIONS.length) * 100;
  setFrame("Top Note", "Part III · Impressions", "");
  el.innerHTML = `
    <div class="progress-head">
      <span class="progress-text">Impressions</span>
      <span class="progress-text">${state.idx+1} of ${IMPRESSION_QUESTIONS.length}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <p class="q-index">No. ${String(state.idx+1).padStart(2,"0")}</p>
    <p class="question-text">${esc(q.text)}</p>
    <div class="img-grid" id="imgGrid"></div>
    <div class="nav">
      <button class="btn-back" id="backBtn">&larr; Back</button>
      <span class="answered-count">${state.idx+1} / ${IMPRESSION_QUESTIONS.length}</span>
    </div>
  `;
  const grid = $("imgGrid");
  let picked = false;
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "img-option" + (state.impressions[q.id] === i ? " selected" : "");
    btn.innerHTML = `<img src="${opt.img}" alt="Option ${i+1}">`;
    btn.addEventListener("click", () => {
      if (picked) return;
      picked = true;
      grid.querySelectorAll(".img-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.impressions[q.id] = i;
      setTimeout(() => {
        if (state.idx < IMPRESSION_QUESTIONS.length - 1) state.idx++;
        else { state.phase = "chemistry-interstitial"; state.idx = 0; }
        render(true);
      }, 400);
    });
    grid.appendChild(btn);
  });
  $("backBtn").addEventListener("click", () => {
    if (state.idx > 0) state.idx--;
    else { state.phase = "impressions-interstitial"; state.idx = 0; }
    render(true);
  });
}

function renderChemistryInterstitial(el) {
  setFrame("Top Note", "Intermission", "");
  el.innerHTML = `
    <div class="interstitial">
      <div class="dot" style="margin-bottom:30px;"></div>
      <div class="section-num">Part IV</div>
      <h2>Chemistry</h2>
      <p>A few quick questions about how fragrances interact with your skin. This helps us fine-tune our recommendations.</p>
      <button class="btn-primary" id="continueBtn">Continue</button>
      <div style="margin-top:20px;">
        <button class="btn-back" id="backBtn">&larr; Back</button>
      </div>
    </div>
  `;
  $("backBtn").addEventListener("click", () => { state.phase = "impressions"; state.idx = IMPRESSION_QUESTIONS.length - 1; render(true); });
  $("continueBtn").addEventListener("click", () => { state.phase = "chemistry"; state.idx = 0; render(true); });
}

function renderChemistry(el) {
  const q = CHEMISTRY_QUESTIONS[state.idx];
  const pct = ((state.idx + 1) / CHEMISTRY_QUESTIONS.length) * 100;
  setFrame("Top Note", "Part IV · Chemistry", "");
  const inputHtml = q.type === "text"
    ? '<textarea class="text-area-input" id="chemText" placeholder="Describe any sensitivities or type \'None\'" rows="4">' + esc(state.chemistry[q.id] || "") + '</textarea>'
      + '<div class="nav"><button class="btn-back" id="backBtn">&larr; Back</button>'
      + '<button class="btn-primary" id="nextBtn">Finish</button></div>'
    : '<div id="options"></div>'
      + '<div class="nav"><button class="btn-back" id="backBtn">&larr; Back</button>'
      + '<span class="answered-count">' + (state.idx+1) + ' / ' + CHEMISTRY_QUESTIONS.length + '</span></div>';
  el.innerHTML = `
    <div class="progress-head">
      <span class="progress-text">Chemistry</span>
      <span class="progress-text">${state.idx+1} of ${CHEMISTRY_QUESTIONS.length}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <p class="q-index">No. ${String(state.idx+1).padStart(2,"0")}</p>
    <p class="question-text">${esc(q.text)}</p>
    ${inputHtml}
  `;
  if (q.type === "text") {
    $("chemText").addEventListener("input", e => { state.chemistry[q.id] = e.target.value; });
    $("nextBtn").addEventListener("click", () => {
      state.phase = "results";
      render(true);
    });
  } else {
    optionList(q.options, () => state.chemistry[q.id], (opt) => {
      state.chemistry[q.id] = opt;
      if (state.idx < CHEMISTRY_QUESTIONS.length - 1) state.idx++;
      else state.phase = "results";
      render(true);
    });
  }
  $("backBtn").addEventListener("click", () => {
    if (state.idx > 0) state.idx--;
    else { state.phase = "chemistry-interstitial"; state.idx = 0; }
    render(true);
  });
}

function renderResults(el) {
  setFrame("Top Note", "Signature Profile", esc(state.name || ""));
  $("fCenter").style.color = "var(--red-deep)";
  const results = calcResults(state.scent);

  const vibesHtml = VIBES_QUESTIONS.map(q =>
    `<div class="vibes-row"><span class="q">${esc(q.text)}</span> <span class="a">${esc(state.vibes[q.id] || "\u2014")}</span></div>`
  ).join("");

  const slidersHtml = results.map(r => {
    const mid = 50, dot = r.pct;
    const scoreStr = (r.score > 0 ? "+" : "") + r.score;
    const line = dot < mid
      ? `<div class="slider-line slider-line-neg" style="left:${dot}%;width:${mid-dot}%"></div>`
      : `<div class="slider-line slider-line-pos" style="left:${mid}%;width:${dot-mid}%"></div>`;
    return `
    <div class="cat-row">
      <div class="cat-label"><span class="cat-ico">${CAT_ICON[r.key] || ""}</span><span class="cat-name">${esc(r.name)}</span></div>
      <div class="slider-track">
        <div class="slider-center"></div>
        ${line}
        <div class="slider-dot" style="left:${dot}%;background:${lerpColor(dot)}"></div>
      </div>
      <div class="score-label">${r.label}</div>
    </div>`;
  }).join("");

  const top3 = [...results].filter(r => r.key !== "smoky").sort((a, b) => b.score - a.score).slice(0, 3).map(r => r.name).join(" · ");

  const emailSection = SCRIPT_URL
    ? `<div class="email-box"><div id="statusMsg" class="status-msg sending">Sending your results to ${esc(state.email)}…</div></div>`
    : `<div class="email-box"><p class="status-msg" style="color:var(--ink-dim)">A curator will follow up with hand-picked recommendations.</p></div>`;

  el.innerHTML = `
    <div class="cover">
      <div class="cover-bloom" aria-hidden="true"></div>
      <div class="cover-copy">
        <h1>${esc(state.name || "Your")}\u2019s<br>scent map.</h1>
        <p class="subtitle">Your strongest affinities lean toward <em>${esc(top3)}</em>. Below, your
        coordinates across thirteen scent families show what notes you're more or less likely to enjoy.</p>
      </div>
    </div>

    <div class="vibes-box">
      <div class="vibes-title">Vibes Diagnostic</div>
      ${vibesHtml}
    </div>

    <div class="frame-head"><span class="frame-label">The Scent Map</span></div>
    <div class="axis-labels"><span>Less Likely</span><span>Neutral</span><span>More Likely</span></div>
    ${slidersHtml}

    ${emailSection}

    <div style="margin-top:40px;">
      <button class="btn-back" id="retakeBtn">&larr; Retake the quiz</button>
    </div>
  `;

  if (SCRIPT_URL) submitResults(results);
  $("retakeBtn").addEventListener("click", () => {
    Object.assign(state, { phase: "intro", idx: 0, name: "", email: "", vibes: {}, scent: {}, impressions: {}, chemistry: {}, emailSent: false });
    render(true);
  });
}

function buildAllResponses() {
  var responses = [];
  VIBES_QUESTIONS.forEach(function(q) {
    responses.push({ section: "Vibes", question: q.text, answer: state.vibes[q.id] || "—" });
  });
  SCENT_QUESTIONS.forEach(function(q) {
    responses.push({ section: "Scent Profile", question: q.text, answer: state.scent[q.id] || "—" });
  });
  IMPRESSION_QUESTIONS.forEach(function(q) {
    var picked = state.impressions[q.id];
    responses.push({ section: "Impressions", question: q.text, answer: picked != null ? "Image " + (picked + 1) : "—" });
  });
  CHEMISTRY_QUESTIONS.forEach(function(q) {
    responses.push({ section: "Chemistry", question: q.text, answer: state.chemistry[q.id] || "—" });
  });
  return responses;
}

async function submitResults(results) {
  if (state.emailSent) return;
  state.emailSent = true;
  const statusMsg = $("statusMsg");
  if (!statusMsg) return;
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ name: state.name, email: state.email, vibes: state.vibes, results, leather: state.scent.s46, impressions: calcImpressions(state.impressions), chemistry: state.chemistry, allResponses: buildAllResponses() }) });
  } catch (e) { /* no-cors: opaque, assume ok */ }
  statusMsg.className = "status-msg success";
  statusMsg.innerHTML = "Results sent to " + esc(state.email) + " \u2014 check your inbox.<br><span style='font-size:14px;color:var(--ink-dim)'>If you don\u2019t see it, check your spam or junk folder.</span>";
}

render();
