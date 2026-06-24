/* Top Note Scent Quiz — data + scoring. Vanilla, no deps. */

const VIBES_QUESTIONS = [
  { id: "v1", text: "I\u2019m looking for a scent for\u2026", options: ["Daytime", "Nighttime", "Going from day to night", "Anytime, doesn\u2019t matter"] },
  { id: "v2", text: "I want my scent to be\u2026", options: ["Feminine", "Masculine", "Unisex", "Anything, doesn\u2019t matter to me"] },
  { id: "v3", text: "I\u2019m looking for a fragrance that is\u2026", options: ["Classic", "On the cutting edge of trends", "Something no one else is wearing", "Just something I like"] },
  { id: "v4", text: "I want my fragrance to say I\u2019m\u2026", options: ["Fun and vibrant", "Mysterious and challenging", "Sexy and magnetic", "Elegant and sophisticated", "Soft and calm", "Cool and chic", "Authoritative and worldly", "I don\u2019t care how others perceive it"] },
  { id: "v5", text: "I want my scent to be\u2026", options: ["Something people notice when I walk into a room", "Something subtle \u2014 a reward for intimacy", "Something elusive that lingers in the air when I pass", "Something that makes me happy \u2014 I don\u2019t care about anyone else"] },
];

const SCENT_OPTIONS = ["Love it", "Like it", "Neutral", "Dislike it", "Hate it"];
const SCORE_VALUES = { "Love it": 2, "Like it": 1, "Neutral": 0, "Dislike it": -1, "Hate it": -2 };

const SCENT_QUESTIONS = [
  { id:"s1",  text:"Do you like the smell of fresh squeezed lemon or lime?", cat:{ citrus:1 } },
  { id:"s2",  text:"Do you enjoy the slightly floral smell of bergamot, mandarin, or orange?", cat:{ citrus:0.8, floral:0.2 } },
  { id:"s3",  text:"Do you enjoy the slightly bitter, bright, and tart smell of fresh grapefruit?", cat:{ citrus:1 } },
  { id:"s4",  text:"Do you enjoy the smell of heady and fragrant white flowers like jasmine, gardenia, or orange blossom?", cat:{ floral:0.7, animalic:0.3 } },
  { id:"s5",  text:"Do you enjoy bright and effervescent scents that feel like freshly poured champagne?", cat:{ atmospheric:0.5, floral:0.3, animalic:0.2 } },
  { id:"s6",  text:"Do you enjoy the light, watery, and slightly green smell of a fresh, dewy rose?", cat:{ floral:0.7, green:0.3 } },
  { id:"s7",  text:"Do you like the rich and almost jammy smell of a deep, velvety rose?", cat:{ floral:0.7, resinous:0.3 } },
  { id:"s8",  text:"Do you enjoy rich, tropical florals like ylang ylang, osmanthus, or neroli which are heady and slightly fruity?", cat:{ floral:0.6, fruity:0.4 } },
  { id:"s9",  text:"Do you like the soft, powdery smell of lipstick or face powder?", cat:{ floral:0.6, animalic:0.4 } },
  { id:"s10", text:"Do you like the smell of freshly cut grass or snapped green plant stems?", cat:{ green:1 } },
  { id:"s11", text:"Do you enjoy the smell of fresh savory herbs like basil or thyme?", cat:{ green:1 } },
  { id:"s12", text:"Do you like sharp, medicinal fresh scents like eucalyptus or mint?", cat:{ green:0.7, atmospheric:0.3 } },
  { id:"s13", text:"Do you enjoy the fresh, powdery, and calming smell of lavender?", cat:{ green:0.5, floral:0.3, agrestic:0.2 } },
  { id:"s14", text:"Do you like the smell of green, sharp, and slightly bitter vegetables like kale or swiss chard?", cat:{ green:0.7, fruity:0.3 } },
  { id:"s15", text:"Do you like the smell of ripe peaches or nectarines?", cat:{ fruity:1 } },
  { id:"s16", text:"Do you like the smell of tropical fruits like pineapple, mango, or coconut?", cat:{ fruity:0.8, gourmand:0.2 } },
  { id:"s17", text:"Do you enjoy the smell of dark, tart berries like blackcurrant, blackberry, or raspberry?", cat:{ fruity:0.5, green:0.3, animalic:0.2 } },
  { id:"s18", text:"Do you enjoy the delicate, airy, and slightly floral smell of fruits like fresh pear or apple?", cat:{ fruity:0.7, floral:0.3 } },
  { id:"s19", text:"How do you generally prefer the scent of figs?", spectrum:[
    { label:"Fig leaf (green/sharp)", value:-2, cat:{ green:1 } },
    { label:"Leaning fig leaf", value:-1, cat:{ green:0.65, gourmand:0.20, woody:0.10, fruity:0.05 } },
    { label:"Creamy flesh", value:0, cat:{ green:0.15, gourmand:0.55, woody:0.35, fruity:0.05 } },
    { label:"Leaning ripe fig", value:1, cat:{ green:0.05, gourmand:0.20, woody:0.15, fruity:0.60 } },
    { label:"Ripe fig (jammy)", value:2, cat:{ fruity:1 } }
  ]},
  { id:"s20", text:"Do you enjoy warm spices like cinnamon, clove, or nutmeg?", cat:{ spicy:0.6, resinous:0.2, gourmand:0.2 } },
  { id:"s21", text:"Do you like the smell of bright spices like ginger, cardamom, or black pepper?", cat:{ spicy:0.7, green:0.3 } },
  { id:"s22", text:"Do you enjoy the smoky, resinous, and sacred smell of incense or old churches?", cat:{ resinous:0.6, smoky:0.4 } },
  { id:"s23", text:"Do you like the golden, balsamic, slightly sweet, and enveloping smell of warm amber or tree resin?", cat:{ resinous:0.6, gourmand:0.2, animalic:0.2 } },
  { id:"s24", text:"Do you enjoy the smell of baking cake or cookies?", cat:{ gourmand:1 } },
  { id:"s25", text:"Do you like the smell of chocolate or cocoa powder?", cat:{ gourmand:1 } },
  { id:"s26", text:"Do you enjoy the smell of freshly brewed coffee or roasted nuts like almonds and hazelnuts?", cat:{ gourmand:0.8, woody:0.2 } },
  { id:"s27", text:"Do you like the smell of fresh cream or butter?", cat:{ gourmand:0.7, woody:0.3 } },
  { id:"s28", text:"Do you enjoy the smell of caramel or golden syrup?", cat:{ gourmand:1 } },
  { id:"s29", text:"Do you like the smell of whiskey or aged, barrel-aged spirits?", cat:{ gourmand:0.5, woody:0.3, spicy:0.2 } },
  { id:"s30", text:"Do you like the smell of a smoky fireplace or campfire?", cat:{ smoky:0.5, woody:0.3, agrestic:0.2 } },
  { id:"s31", text:"Do you enjoy the almond-like smell of sun-warmed hay?", cat:{ agrestic:0.7, gourmand:0.3 } },
  { id:"s32", text:"Do you enjoy the damp, earthy, and slightly briney smell of oakmoss?", cat:{ agrestic:0.6, earthy:0.3, green:0.1 } },
  { id:"s33", text:"Do you enjoy the smell of tobacco, such as loose tobacco leaves or an unlit cigar?", cat:{ agrestic:0.8, woody:0.2 } },
  { id:"s34", text:"Do you like the smell of old books or aged paper?", cat:{ woody:0.5, floral:0.3, animalic:0.2 } },
  { id:"s35", text:"Do you like the smell of horses, stables, or worn leather saddles?", cat:{ animalic:0.7, earthy:0.3 } },
  { id:"s36", text:"Do you like the smell of damp earth while walking in a forest?", cat:{ earthy:0.6, green:0.2, agrestic:0.2 } },
  { id:"s37", text:"Do you like the smell of patchouli: dark, earthy, and slightly sweet with a hint of soil?", cat:{ earthy:0.6, resinous:0.3, agrestic:0.1 } },
  { id:"s38", text:"Do you enjoy the smell of a sauna or dry woods like pine, beech, or pencil shavings?", cat:{ woody:1 } },
  { id:"s39", text:"Do you enjoy the smell of smooth, creamy, and softly warm woods like sandalwood?", cat:{ woody:0.6, gourmand:0.4 } },
  { id:"s40", text:"Do you enjoy the smell of dry, sun-baked earth or warm stone?", cat:{ resinous:0.5, earthy:0.3, woody:0.2 } },
  { id:"s41", text:"Do you enjoy the light, vegetal, and slightly toasty smell of green tea or oolong tea?", cat:{ green:0.5, gourmand:0.3, woody:0.2 } },
  { id:"s42", text:"Do you like the smell of fresh clean laundry or freshly washed skin?", cat:{ animalic:1 } },
  { id:"s43", text:"Do you like the smell of burning candle wax?", cat:{ resinous:0.5, gourmand:0.3, smoky:0.2 } },
  { id:"s44", text:"Do you like intimate, human smells that aren\u2019t quite clean yet aren\u2019t unpleasant, such as warm skin after exercise?", cat:{ animalic:0.6, agrestic:0.4 } },
  { id:"s45", text:"Do you enjoy the smell of soft animal fur?", cat:{ animalic:1 } },
  { id:"s46", text:"How do you prefer the smell of leather?", cat:{ animalic:1 }, spectrum:[
    { label:"I don\u2019t enjoy leather at all", value:-2 },
    { label:"Soft and powdery suede", value:-1 },
    { label:"Classic clean leather", value:0 },
    { label:"Rich, smoky tanned leather", value:1 },
    { label:"Intensely animalic raw hide", value:2 }
  ]},
  { id:"s47", text:"Do you enjoy the earthy damp smell in the air after rainfall, also known as petrichor?", cat:{ atmospheric:0.5, earthy:0.3, green:0.2 } },
  { id:"s48", text:"Do you enjoy the salty smell of the ocean?", cat:{ atmospheric:1 } },
  { id:"s49", text:"Do you like the smell of cold, clean icy mountain air?", cat:{ atmospheric:0.7, green:0.3 } },
  { id:"s50", text:"Do you enjoy the smell of sunscreen?", cat:{ atmospheric:0.4, floral:0.3, citrus:0.3 } },
];

const CATEGORIES = [
  { key:"citrus", label:"Citrus" },
  { key:"floral", label:"Floral" },
  { key:"green", label:"Green" },
  { key:"fruity", label:"Fruity" },
  { key:"spicy", label:"Spicy" },
  { key:"resinous", label:"Resinous" },
  { key:"gourmand", label:"Gourmand" },
  { key:"smoky", label:"Smoky" },
  { key:"agrestic", label:"Agrestic" },
  { key:"earthy", label:"Earthy" },
  { key:"woody", label:"Woody" },
  { key:"animalic", label:"Animalic" },
  { key:"atmospheric", label:"Mineral / Airy" },
];

const TOTAL_WEIGHTS = {
  citrus:3.1, floral:5, green:6.43, fruity:4.04, spicy:1.5,
  resinous:3.0, gourmand:7.23, smoky:1.1, agrestic:3.2,
  earthy:2.4, woody:3.8, animalic:5.8, atmospheric:3.4
};

const BOOST_VALUES = {
  citrus:1.1, floral:1.1, green:1.1, fruity:1.1, spicy:1,
  resinous:1, gourmand:1, smoky:1, agrestic:1.1, earthy:1,
  woody:1, animalic:1, atmospheric:1.1
};

/* icons — warm ink stroke for light ground */
const IC = "#6a6053";
const I = (d) => `<svg class="cat-icon" width="13" height="13" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">${d}</svg>`;
const CAT_ICON = {
  citrus:          I(`<circle cx="7" cy="7" r="5" fill="none" stroke="${IC}" stroke-width="0.9"/><line x1="7" y1="2" x2="7" y2="7" stroke="${IC}" stroke-width="0.8"/><line x1="3" y1="10" x2="7" y2="7" stroke="${IC}" stroke-width="0.8"/><line x1="11" y1="10" x2="7" y2="7" stroke="${IC}" stroke-width="0.8"/>`),
  floral:          I(`<circle cx="7" cy="7" r="2" fill="${IC}"/><circle cx="7" cy="2.5" r="1.5" fill="${IC}" opacity="0.6"/><circle cx="7" cy="11.5" r="1.5" fill="${IC}" opacity="0.6"/><circle cx="2.5" cy="7" r="1.5" fill="${IC}" opacity="0.6"/><circle cx="11.5" cy="7" r="1.5" fill="${IC}" opacity="0.6"/>`),
  green:           I(`<path d="M7 2C5 4 4 6.5 4.5 9c.3 1.5 1.3 2.5 2.5 3 1.2-.5 2.2-1.5 2.5-3C10 6.5 9 4 7 2z" fill="${IC}"/><line x1="7" y1="5" x2="7" y2="12" stroke="${IC}" stroke-width="0.8"/>`),
  fruity:          I(`<circle cx="7" cy="8" r="4.5" fill="${IC}"/><path d="M7 3.5C6 2 8 1 8.5 2.5" stroke="${IC}" stroke-width="0.8" fill="none"/>`),
  spicy:           I(`<path d="M7 1C5 4 4 6.5 4 8.5c0 2.2 1.3 4 3 4s3-1.8 3-4C10 6.5 9 4 7 1z" fill="${IC}"/>`),
  resinous:        I(`<path d="M7 1L2.5 7 7 13 11.5 7z" fill="${IC}"/>`),
  gourmand:        I(`<path d="M7 1.5C5 4.5 4 7 4 9c0 2 1.3 3.5 3 3.5s3-1.5 3-3.5c0-2-1-4.5-3-7.5z" fill="${IC}"/>`),
  smoky:           I(`<path d="M5 12c0-3 2-4 2-6s-1-3-1-5" fill="none" stroke="${IC}" stroke-width="0.9"/><path d="M9 12c0-3-2-4-2-6s1-3 1-5" fill="none" stroke="${IC}" stroke-width="0.9" opacity="0.6"/>`),
  agrestic:        I(`<path d="M7 1v12" stroke="${IC}" stroke-width="0.8"/><path d="M7 4L4 6M7 6l3-2M7 8L4 10M7 10l3-2" stroke="${IC}" stroke-width="0.8" fill="none"/>`),
  earthy:          I(`<path d="M2 10h10M3 7.5h8M4 5h6" stroke="${IC}" stroke-width="1" opacity="0.7"/><circle cx="7" cy="3" r="1" fill="${IC}"/>`),
  woody:           I(`<circle cx="7" cy="7" r="5" fill="none" stroke="${IC}" stroke-width="0.9"/><circle cx="7" cy="7" r="3" fill="none" stroke="${IC}" stroke-width="0.8"/><circle cx="7" cy="7" r="1" fill="${IC}"/>`),
  animalic:        I(`<path d="M4 5c0-2 1-3.5 2-3.5M10 5c0-2-1-3.5-2-3.5" stroke="${IC}" stroke-width="0.9" fill="none"/><path d="M3.5 5.5c0 4 1.5 6.5 3.5 7.5 2-1 3.5-3.5 3.5-7.5z" fill="${IC}" opacity="0.7"/>`),
  atmospheric:     I(`<path d="M1 6c2-3 4-3 6 0s4 3 6 0" fill="none" stroke="${IC}" stroke-width="0.9"/><path d="M1 9.5c2-3 4-3 6 0s4 3 6 0" fill="none" stroke="${IC}" stroke-width="0.8"/>`),
};

function lerpColor(pct) {
  const lo  = [126, 138, 145];
  const mid = [199, 188, 162];
  const hi  = [184, 125, 34];
  let r, g, b;
  if (pct <= 50) {
    const t = pct / 50;
    r = Math.round(lo[0] + (mid[0]-lo[0])*t); g = Math.round(lo[1] + (mid[1]-lo[1])*t); b = Math.round(lo[2] + (mid[2]-lo[2])*t);
  } else {
    const t = (pct-50)/50;
    r = Math.round(mid[0] + (hi[0]-mid[0])*t); g = Math.round(mid[1] + (hi[1]-mid[1])*t); b = Math.round(mid[2] + (hi[2]-mid[2])*t);
  }
  return `rgb(${r},${g},${b})`;
}

function calcResults(scent) {
  const sums = {};
  CATEGORIES.forEach(c => { sums[c.key] = 0; });
  SCENT_QUESTIONS.forEach(q => {
    const a = scent[q.id];
    if (a == null) return;
    let v, cats;
    if (q.spectrum) {
      const match = q.spectrum.find(s => s.label === a);
      if (!match) return;
      if (match.cat) {
        v = Math.abs(match.value);
        cats = match.cat;
      } else {
        v = match.value;
        cats = q.cat;
      }
    } else {
      v = SCORE_VALUES[a];
      cats = q.cat;
    }
    for (const [k, w] of Object.entries(cats)) { sums[k] += v * w; }
  });
  return CATEGORIES.map(c => {
    const raw = sums[c.key];
    const normalized = TOTAL_WEIGHTS[c.key] > 0 ? raw / TOTAL_WEIGHTS[c.key] : 0;
    const s = Math.max(-2, Math.min(2, normalized * BOOST_VALUES[c.key]));
    const pct = ((s + 2) / 4) * 100;
    let label;
    if (s >= 1.5) label = "Strong Like";
    else if (s >= 0.5) label = "Like";
    else if (s > -0.5) label = "Neutral";
    else if (s > -1.5) label = "Dislike";
    else label = "Strong Dislike";
    return { key: c.key, name: c.label, score: Math.round(s*100)/100, pct: Math.round(pct), label };
  });
}

const IMPRESSION_QUESTIONS = [
  { id:"i1", text:"Which work of art do you prefer?", options:[
    { img:"assets/impressions-images/1.1.png", L:-2, S:-1, P:-1, T:-2 },
    { img:"assets/impressions-images/1.2.jpg", L:1, S:2, P:2, T:2 },
    { img:"assets/impressions-images/1.3.jpg", L:-1, S:-1, P:-2, T:-1 },
    { img:"assets/impressions-images/1.4.jpg", L:-1, S:-2, P:-1, T:-2 },
    { img:"assets/impressions-images/1.5.jpg", L:2, S:0, P:1, T:1 },
  ]},
  { id:"i2", text:"Which image do you prefer?", options:[
    { img:"assets/impressions-images/2.1.jpg", L:2, S:0, P:1, T:1 },
    { img:"assets/impressions-images/2.2.webp", L:1, S:1, P:-1, T:2 },
    { img:"assets/impressions-images/2.3.webp", L:-1, S:1, P:2, T:1 },
    { img:"assets/impressions-images/2.4.jpg", L:1, S:-1, P:-2, T:-2 },
    { img:"assets/impressions-images/2.5.avif", L:1, S:-1, P:0, T:-1 },
  ]},
  { id:"i3", text:"Which texture do you prefer?", options:[
    { img:"assets/impressions-images/3.1.jpg", L:0, S:-2, P:-2, T:-1 },
    { img:"assets/impressions-images/3.2.webp", L:-1, S:1, P:1, T:-1 },
    { img:"assets/impressions-images/3.3.jpg", L:-2, S:-1, P:0, T:-2 },
    { img:"assets/impressions-images/3.4.jpeg", L:2, S:1, P:1, T:2 },
    { img:"assets/impressions-images/3.5.jpg", L:1, S:-1, P:-1, T:0 },
  ]},
  { id:"i4", text:"Which architectural style do you prefer?", options:[
    { img:"assets/impressions-images/4.1.jpg", L:-1, S:0, P:2, T:-2 },
    { img:"assets/impressions-images/4.2.jpg", L:-1, S:-2, P:-1, T:-1 },
    { img:"assets/impressions-images/4.3.jpg", L:1, S:2, P:2, T:2 },
    { img:"assets/impressions-images/4.4.webp", L:-1, S:0, P:2, T:-1 },
    { img:"assets/impressions-images/4.5.jpg", L:2, S:1, P:1, T:1 },
  ]},
  { id:"i5", text:"Which environment would you prefer to visit on your weekends?", options:[
    { img:"assets/impressions-images/5.1.jpg", L:0, S:-2, P:-1, T:-2 },
    { img:"assets/impressions-images/5.2.jpg", L:1, S:0, P:0, T:1 },
    { img:"assets/impressions-images/5.3.avif", L:-2, S:-1, P:0, T:-2 },
    { img:"assets/impressions-images/5.4.avif", L:-1, S:2, P:-1, T:1 },
    { img:"assets/impressions-images/5.5.webp", L:-2, S:-1, P:-2, T:-2 },
  ]},
];

function calcImpressions(impressions) {
  const axes = { L:0, S:0, P:0, T:0 };
  let count = 0;
  IMPRESSION_QUESTIONS.forEach(q => {
    const picked = impressions[q.id];
    if (picked == null) return;
    const opt = q.options[picked];
    axes.L += opt.L;
    axes.S += opt.S;
    axes.P += opt.P;
    axes.T += opt.T;
    count++;
  });
  if (count > 0) {
    axes.L = Math.round((axes.L / count) * 100) / 100;
    axes.S = Math.round((axes.S / count) * 100) / 100;
    axes.P = Math.round((axes.P / count) * 100) / 100;
    axes.T = Math.round((axes.T / count) * 100) / 100;
  }
  return [
    { axis:"Luminosity", code:"L", score:axes.L, neg:"Dark & atmospheric", pos:"Bright & solar" },
    { axis:"Structure", code:"S", score:axes.S, neg:"Wild & organic", pos:"Sharp & architectural" },
    { axis:"Presence", code:"P", score:axes.P, neg:"Skin-close & intimate", pos:"Bold & projecting" },
    { axis:"Time", code:"T", score:axes.T, neg:"Ancient & rooted", pos:"Futuristic & clean" },
  ];
}

const CHEMISTRY_QUESTIONS = [
  { id:"c1", text:"How long do fragrances typically last on your skin?", type:"choice", options:[
    "They fade within an hour or two",
    "They last a little less than I’d expect",
    "They last about as long as advertised",
    "They last a bit longer than expected",
    "They last all day or longer",
  ]},
  { id:"c2", text:"How would you describe your skin throughout the day?", type:"choice", options:[
    "Very dry — often feels tight, rarely gets shiny",
    "Somewhat dry — occasionally needs moisture",
    "Balanced — neither oily nor dry",
    "Somewhat oily — gets a little shiny by midday",
    "Very oily — noticeably shiny within a few hours",
  ]},
  { id:"c3", text:"When you wear citrus scents, how do they smell on your skin?", type:"choice", options:[
    "Much sharper or more aggressive than I’d expect",
    "Slightly sharper than on the strip or bottle",
    "About the same as on the strip or bottle",
    "Slightly softer or more muted on me",
    "I haven’t worn citrus scents",
  ]},
  { id:"c4", text:"Do fragrances tend to smell sweeter on you than expected from the bottle?", type:"choice", options:[
    "Always — everything smells much sweeter on me",
    "Often — I notice this regularly",
    "Sometimes — it depends on the fragrance",
    "Rarely — scents smell close to how I expect",
    "Never — scents smell the same or drier on me",
  ]},
  { id:"c5", text:"Do you have any known sensitivities to fragrance ingredients — either by smell or skin reaction?", type:"text" },
];

const CHEMISTRY_INSIGHTS = {
  c1: function(ans) {
    var idx = CHEMISTRY_QUESTIONS[0].options.indexOf(ans);
    if (idx <= 1) return "Alkaline skin likely. Recommend moisturizer on damp skin before application, emphasize strong base notes, higher concentrations.";
    if (idx >= 3) return "Likely acidic/oily skin — ideal for perfume. Light scents work well.";
    return "Neutral longevity — no specific adjustment needed.";
  },
  c2: function(ans) {
    var idx = CHEMISTRY_QUESTIONS[1].options.indexOf(ans);
    if (idx <= 1) return "Dry skin: avoid citrus-led, recommend higher concentrations. Lean toward resins, woods, spices, vanilla.";
    if (idx >= 3) return "Oily skin: fresh, citrus, aquatic, woody fragrances work well.";
    return "Balanced skin — no specific adjustment needed.";
  },
  c3: function(ans) {
    var idx = CHEMISTRY_QUESTIONS[2].options.indexOf(ans);
    if (idx <= 1) return "Skin may be alkaline. Recommend hydrating before application, steer away from citrus-led fragrances, lean toward bergamot over lemon/lime.";
    if (idx === 4) return "No citrus experience to reference.";
    if (idx === 3) return "Citrus is softened on skin — may need brighter citrus formulations.";
    return "Citrus behaves normally on skin.";
  },
  c4: function(ans) {
    var idx = CHEMISTRY_QUESTIONS[3].options.indexOf(ans);
    if (idx <= 1) return "Sweetness amplification detected. Recommend moisturizing and hydrating before application. Consider applying on clothes or hair rather than skin. Avoid gourmand-on-skin combinations.";
    if (idx >= 3) return "No sweetness amplification — gourmand and sweet notes perform as expected.";
    return "Occasional sweetness amplification — monitor with specific fragrances.";
  },
  c5: function(ans) {
    if (!ans || !ans.trim()) return "No sensitivities reported.";
    return "Flag for review before session. Common watch items: synthetic musks (Iso E Super), oakmoss/IFRA-restricted materials, high-pitched florals triggering headaches.";
  },
};
