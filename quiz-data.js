/* Top Note Scent Quiz — data + scoring. Vanilla, no deps. */

const VIBES_QUESTIONS = [
  { id: "v1", text: "I\u2019m looking for a scent for\u2026", options: ["Daytime", "Nighttime", "Something that can do both", "Doesn\u2019t matter"] },
  { id: "v2", text: "I want my scent to be\u2026", options: ["Feminine", "Masculine", "Unisex", "Doesn\u2019t matter"] },
  { id: "v3", text: "I\u2019m looking for a fragrance that is\u2026", options: ["Classic", "On the cutting edge of trends", "Something no one else is wearing", "Just something I like"] },
  { id: "v4", text: "I want my fragrance to say I\u2019m\u2026", options: ["Fun and vibrant", "Mysterious and challenging", "Sexy and magnetic", "Elegant and sophisticated", "Soft and calm", "Cool and chic", "Authoritative and worldly", "I don\u2019t care how others perceive it"] },
  { id: "v5", text: "I want my scent to be\u2026", options: ["Something people notice when I walk into a room", "Something subtle \u2014 a reward for intimacy", "Something elusive that lingers in the air when I pass", "Don\u2019t care, as long as I like it"] },
];

const SCENT_OPTIONS = ["Love it", "Like it", "Neutral", "Dislike it", "Hate it"];
const SCORE_VALUES = { "Love it": 2, "Like it": 1, "Neutral": 0, "Dislike it": -1, "Hate it": -2 };

const SCENT_QUESTIONS = [
  { id:"s1",  text:"Do you like the smell of freshly cut grass?", cat:{ green:1 } },
  { id:"s2",  text:"Do you enjoy the smell of being outside right after it rains?", cat:{ green:0.7, aquatic:0.3 } },
  { id:"s3",  text:"Do you like the smell of fresh herbs like basil or mint leaves?", cat:{ green:1 } },
  { id:"s4",  text:"Do you enjoy the smell of freshly-cut green plant stems?", cat:{ green:1 } },
  { id:"s5",  text:"Do you like sharp, fresh aromas like eucalyptus or tea tree oil?", cat:{ green:0.6, aquatic:0.4 } },
  { id:"s6",  text:"Do you enjoy fragrant white flowers like jasmine or gardenia?", cat:{ floral:1 } },
  { id:"s7",  text:"Do you like the smell of roses?", cat:{ floral:1 } },
  { id:"s8",  text:"Do you enjoy the soft, powdery smell of lipstick and makeup?", cat:{ floral:1 } },
  { id:"s9",  text:"Do you like relaxing \u201cspa\u201d herbs such as lavender and rosemary?", cat:{ floral:1 } },
  { id:"s10", text:"Do you enjoy flowering trees, such as orange blossom or magnolia?", cat:{ floral:1 } },
  { id:"s11", text:"Do you enjoy the smell of sunscreen?", cat:{ floral:0.4, fruity:0.3, aquatic:0.3 } },
  { id:"s12", text:"Do you like peeling a fresh orange or zesting a lemon?", cat:{ citrus:1 } },
  { id:"s13", text:"Do you enjoy the smell of lemon-lime soda?", cat:{ citrus:1 } },
  { id:"s14", text:"Do you enjoy fresh grapefruit, or a cocktail with grapefruit juice?", cat:{ citrus:1 } },
  { id:"s15", text:"Do you like the smell of ripe peaches or nectarines?", cat:{ fruity:1 } },
  { id:"s16", text:"Do you enjoy red berries, like strawberries or raspberries?", cat:{ fruity:1 } },
  { id:"s17", text:"Do you like tropical fruits like pineapple, mango, or coconut?", cat:{ fruity:1 } },
  { id:"s18", text:"Do you enjoy fruity drinks, like sangria or fruit punch?", cat:{ fruity:1 } },
  { id:"s19", text:"Do you like the smell of trees and earth, or walking in a forest?", cat:{ green:0.6, woody:0.4 } },
  { id:"s20", text:"Do you enjoy dry wood, like a sauna or chopped firewood?", cat:{ woody:1 } },
  { id:"s21", text:"Do you like warm wood, like a wooden cabin or polished furniture?", cat:{ woody:1 } },
  { id:"s22", text:"Do you enjoy the smell of a smoky fireplace or campfire?", cat:{ woody:0.5, leather_tobacco:0.5 } },
  { id:"s23", text:"Do you like the smell of moss, or damp earth after rain?", cat:{ green:1 } },
  { id:"s24", text:"Do you enjoy the vanilla-y smell of baking cake or cookies?", cat:{ gourmand:1 } },
  { id:"s25", text:"Do you enjoy the smell of chocolate or cocoa powder?", cat:{ gourmand:1 } },
  { id:"s26", text:"Do you like nutty smells, like almonds or hazelnuts?", cat:{ gourmand:1 } },
  { id:"s27", text:"Do you enjoy the aroma of freshly brewed coffee?", cat:{ gourmand:1 } },
  { id:"s28", text:"Do you like the smell of fresh cream?", cat:{ gourmand:1 } },
  { id:"s29", text:"Do you enjoy warm spices like cinnamon or clove?", cat:{ spicy:1 } },
  { id:"s30", text:"Do you like bright spices like ginger or cardamom?", cat:{ spicy:1 } },
  { id:"s31", text:"Do you enjoy the smell of incense or old churches?", cat:{ spicy:0.6, amber:0.4 } },
  { id:"s32", text:"Do you like the smell of fresh, clean laundry?", cat:{ musk:1 } },
  { id:"s33", text:"Do you enjoy the smell of classic soaps or shampoos?", cat:{ musk:1 } },
  { id:"s34", text:"Do you like the smell of ocean air or sea breeze?", cat:{ aquatic:1 } },
  { id:"s35", text:"Do you enjoy a fresh mountain stream or clean running water?", cat:{ aquatic:1 } },
  { id:"s36", text:"Do you like the smell of cold winter air?", cat:{ aquatic:1 } },
  { id:"s37", text:"Do you enjoy the smell of leather, like a jacket or purse?", cat:{ leather_tobacco:1 } },
  { id:"s38", text:"Do you like the smell of old books or aged paper?", cat:{ woody:0.5, amber:0.25, leather_tobacco:0.25 } },
  { id:"s39", text:"Do you like the smell of whiskey or aged barrel spirits?", cat:{ leather_tobacco:1 } },
  { id:"s40", text:"Do you enjoy tobacco, like loose leaves or unlit cigars?", cat:{ leather_tobacco:1 } },
  { id:"s41", text:"Do you like the smell of burning candle wax?", cat:{ amber:0.7, gourmand:0.3 } },
  { id:"s42", text:"Do you enjoy the smell of honey or golden syrup?", cat:{ gourmand:0.7, amber:0.3 } },
  { id:"s43", text:"Do you like cozy fabrics like wool or cashmere?", cat:{ musk:1 } },
  { id:"s44", text:"Do you enjoy the smell of clean, damp skin after a shower?", cat:{ musk:1 } },
  { id:"s45", text:"Do you like the smell of warm skin after exercise?", cat:{ musk:0.5, animalic:0.5 } },
  { id:"s46", text:"Do you enjoy the smell of soft animal fur?", cat:{ musk:0.6, animalic:0.4 } },
  { id:"s47", text:"Do you like the smell of horses, stables, or worn saddles?", cat:{ leather_tobacco:0.5, animalic:0.3, woody:0.2 } },
  { id:"s48", text:"Do you enjoy the smell of fruit pies, jam, or preserves?", cat:{ fruity:1 } },
  { id:"s49", text:"Do you like Earl Grey, or fragrant citrus-y tea blends?", cat:{ citrus:0.7, green:0.3 } },
  { id:"s50", text:"Do you like the smell of fresh-brewed tea?", cat:{ green:0.5, woody:0.25, citrus:0.25 } },
];

const CATEGORIES = [
  { key:"green", label:"Green" },
  { key:"floral", label:"Floral" },
  { key:"fruity", label:"Fruity" },
  { key:"citrus", label:"Citrus" },
  { key:"woody", label:"Woody" },
  { key:"aquatic", label:"Aquatic" },
  { key:"gourmand", label:"Gourmand" },
  { key:"spicy", label:"Spicy" },
  { key:"amber", label:"Amber" },
  { key:"leather_tobacco", label:"Leather / Tobacco" },
  { key:"musk", label:"Musk" },
  { key:"animalic", label:"Animalic" },
];

const BOOST = new Set(["green","citrus","floral","fruity","aquatic"]);
const PRIMARY = new Set(["green","floral","fruity","citrus","woody","aquatic","gourmand","spicy","leather_tobacco","musk"]);

/* icons — warm ink stroke for light ground */
const IC = "#6a6053";
const I = (d) => `<svg class="cat-icon" width="13" height="13" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">${d}</svg>`;
const CAT_ICON = {
  green:           I(`<path d="M7 2C5 4 4 6.5 4.5 9c.3 1.5 1.3 2.5 2.5 3 1.2-.5 2.2-1.5 2.5-3C10 6.5 9 4 7 2z" fill="${IC}"/><line x1="7" y1="5" x2="7" y2="12" stroke="${IC}" stroke-width="0.8"/>`),
  floral:          I(`<circle cx="7" cy="7" r="2" fill="${IC}"/><circle cx="7" cy="2.5" r="1.5" fill="${IC}" opacity="0.6"/><circle cx="7" cy="11.5" r="1.5" fill="${IC}" opacity="0.6"/><circle cx="2.5" cy="7" r="1.5" fill="${IC}" opacity="0.6"/><circle cx="11.5" cy="7" r="1.5" fill="${IC}" opacity="0.6"/>`),
  fruity:          I(`<circle cx="7" cy="8" r="4.5" fill="${IC}"/><path d="M7 3.5C6 2 8 1 8.5 2.5" stroke="${IC}" stroke-width="0.8" fill="none"/>`),
  citrus:          I(`<circle cx="7" cy="7" r="5" fill="none" stroke="${IC}" stroke-width="0.9"/><line x1="7" y1="2" x2="7" y2="7" stroke="${IC}" stroke-width="0.8"/><line x1="3" y1="10" x2="7" y2="7" stroke="${IC}" stroke-width="0.8"/><line x1="11" y1="10" x2="7" y2="7" stroke="${IC}" stroke-width="0.8"/>`),
  woody:           I(`<circle cx="7" cy="7" r="5" fill="none" stroke="${IC}" stroke-width="0.9"/><circle cx="7" cy="7" r="3" fill="none" stroke="${IC}" stroke-width="0.8"/><circle cx="7" cy="7" r="1" fill="${IC}"/>`),
  aquatic:         I(`<path d="M1 6c2-3 4-3 6 0s4 3 6 0" fill="none" stroke="${IC}" stroke-width="0.9"/><path d="M1 9.5c2-3 4-3 6 0s4 3 6 0" fill="none" stroke="${IC}" stroke-width="0.8"/>`),
  gourmand:        I(`<path d="M7 1.5C5 4.5 4 7 4 9c0 2 1.3 3.5 3 3.5s3-1.5 3-3.5c0-2-1-4.5-3-7.5z" fill="${IC}"/>`),
  spicy:           I(`<path d="M7 1C5 4 4 6.5 4 8.5c0 2.2 1.3 4 3 4s3-1.8 3-4C10 6.5 9 4 7 1z" fill="${IC}"/>`),
  amber:           I(`<path d="M7 1L2.5 7 7 13 11.5 7z" fill="${IC}"/>`),
  leather_tobacco: I(`<rect x="2.5" y="3.5" width="9" height="7" rx="0.5" fill="none" stroke="${IC}" stroke-width="0.9"/><line x1="2.5" y1="6.5" x2="11.5" y2="6.5" stroke="${IC}" stroke-width="0.8"/>`),
  musk:            I(`<circle cx="7" cy="7" r="2.5" fill="${IC}"/><circle cx="7" cy="7" r="4.5" fill="none" stroke="${IC}" stroke-width="0.8" stroke-dasharray="2 2"/>`),
  animalic:        I(`<path d="M4 5c0-2 1-3.5 2-3.5M10 5c0-2-1-3.5-2-3.5" stroke="${IC}" stroke-width="0.9" fill="none"/><path d="M3.5 5.5c0 4 1.5 6.5 3.5 7.5 2-1 3.5-3.5 3.5-7.5z" fill="${IC}" opacity="0.7"/>`),
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
  const sums = {}, wts = {};
  CATEGORIES.forEach(c => { sums[c.key] = 0; wts[c.key] = 0; });
  SCENT_QUESTIONS.forEach(q => {
    const a = scent[q.id];
    if (a == null) return;
    const v = SCORE_VALUES[a];
    for (const [k, w] of Object.entries(q.cat)) { sums[k] += v * w; wts[k] += w; }
  });
  const scores = {};
  CATEGORIES.forEach(c => { scores[c.key] = wts[c.key] > 0 ? sums[c.key] / wts[c.key] : 0; });
  BOOST.forEach(k => { scores[k] *= 1.1; });
  const maxP = Math.max(...[...PRIMARY].map(k => Math.abs(scores[k])));
  const cap = maxP * 0.6;
  ["amber","animalic"].forEach(k => { if (Math.abs(scores[k]) > cap) scores[k] = Math.sign(scores[k]) * cap; });
  CATEGORIES.forEach(c => { scores[c.key] = Math.max(-2, Math.min(2, scores[c.key])); });
  return CATEGORIES.map(c => {
    const s = scores[c.key];
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
