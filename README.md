# Signature Scent Discovery Quiz

A single-page quiz that maps everyday smell preferences to 12 fragrance categories. No fragrance knowledge required — users respond to familiar scents (fresh grass, coffee, leather, etc.) and get a personalized scent profile.

## How it works

- **5 Vibes Diagnostic questions** — recorded for the consultant, not scored
- **50 Scent Profile questions** — each rated Love it → Hate it (+2 to -2)
- **Weighted scoring** across 12 categories (Green, Floral, Fruity, Citrus, Woody, Aquatic, Gourmand, Spicy, Amber, Leather/Tobacco, Musk, Animalic)
- Results displayed as spectrum sliders from "Less Likely to Enjoy" to "More Likely to Enjoy"

## Running locally

Open `index.html` in a browser. 

## Hosting

Hosted via GitHub Pages. Push to `main` and enable Pages in repo settings.

**Live URL:** `[TODO: add URL once Pages is enabled]`

## Architecture

```
index.html          ← the entire quiz (single file, vanilla JS)
README.md
.gitignore
```

Email delivery of results is handled by a separate Google Apps Script that receives quiz results via POST and sends formatted reports through Gmail. (Not yet implemented.)


