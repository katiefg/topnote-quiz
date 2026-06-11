# Top Note — Signature Scent Discovery Quiz

A single-page fragrance-discovery quiz that maps everyday smell preferences to
twelve scent families. Vintage perfume-magazine aesthetic — warm ivory paper,
classical serif display, a translucent red poppy, self-hosted fonts.

## Hosting on GitHub Pages

This folder is fully self-contained — no build step, no dependencies, no network
calls. To publish:

1. Put these files at the **root of your repo** (so `index.html` is at the top).
2. In your repo: **Settings → Pages → Build and deployment → Source: Deploy from
   a branch**, pick your branch and `/ (root)`, save.
3. Your quiz goes live at `https://<you>.github.io/<repo>/`.

## Files

```
index.html              the page (open this)
quiz.css                all styling
quiz-data.js            questions, categories, scoring
quiz-app.js             render + interaction logic
image-slot.js           the drag-to-fill image component
assets/
  poppy-float4.png      the cover poppy graphic
  scent-profile-2.jpg   Part II hero photo
  fonts/                Syne + Cormorant (self-hosted, OFL 1.1)
```

## Email delivery (optional)

Results email is stubbed off by default. To enable it, paste your Google Apps
Script web-app URL into `SCRIPT_URL` at the top of `quiz-app.js`.

## Fonts

Syne and Cormorant are bundled under `assets/fonts/` and licensed under the SIL
Open Font License 1.1 (see the `*-OFL.txt` files).
