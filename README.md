# Pibbleology

A static fan-encyclopedia for **Pibbleology** — a homage to the classic
encyclopedia / reference-site layout, built with plain HTML, CSS, and a
small amount of vanilla JavaScript. No frameworks. No build step. No
dependencies. Open `index.html` in a browser and it works.

## What's in here

```
.
├── index.html          Main "Pibble" article (homepage)
├── characters.html     Character profiles
├── lore-timeline.html  Chronology of the archive
├── artifacts.html      Objects & artifacts catalog
├── glossary.html       Glossary of terms
├── style.css           Single stylesheet (themes + layout)
├── script.js           Theme toggle, anchors, filter, TOC
├── .nojekyll           Tells GitHub Pages to skip Jekyll processing
└── README.md           This file
```

## Features

- Encyclopedia-style layout: header, left navigation rail, article canvas, right-side infobox, references, categories, footer.
- Mobile responsive: rail collapses and the infobox moves below the lead.
- Dark mode toggle (preference stored in `localStorage`).
- Sticky table of contents on desktop with collapse/expand.
- Anchor links generated automatically on section headings.
- Search/filter box that filters rail links, cards, and highlights matching headings.
- Accessibility: skip link, visible focus states, semantic landmarks, alt-friendly content.

## Deploy to GitHub Pages

GitHub Pages serves static HTML, CSS, and JavaScript files directly from a
repository. `index.html` must be at the top level of the publishing source
(this is already the case here).

### Steps

1. **Create a GitHub repo.** On github.com click *New repository*, name it
   (e.g. `pibbleology`), and leave it empty (no README, no .gitignore).
2. **Upload these files.** Either drag-and-drop in the GitHub web UI, or
   from the command line:
   ```bash
   git init
   git add .
   git commit -m "Initial Pibbleology site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. **Open Settings → Pages** on the repository page.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **Branch: `main`** and **Folder: `/ (root)`**, then *Save*.

GitHub will publish the site at:

```
https://<your-username>.github.io/<repo>/
```

Your `index.html` is served at the root, so all the internal links (which
are relative) will work both locally and on Pages. The `.nojekyll` file
prevents GitHub from running the Jekyll preprocessor, so files and folders
beginning with an underscore (if you add any later) will still be served.

## Editing the lore

All content lives inside the `.html` files as plain text. To add or change
lore:

- Open the relevant page (`index.html`, `characters.html`, etc.) in any
  text editor.
- Find a `<section>` or `<h2>`/`<h3>` heading and edit between the tags.
- New sections should follow the existing pattern:
  ```html
  <h2 id="my-new-section">My new section</h2>
  <p>Lore goes here.</p>
  ```
  The `id` lets the table of contents, rail navigation, and `#anchor`
  links target it.
- Add a corresponding `<li>` in the rail navigation (`<ul class="rail-nav">`)
  and in the `<div class="toc">` block at the top of the article.
- For new article pages, copy any existing page (e.g. `glossary.html`) as
  a starting shell — the header, footer, rail, and script tag are
  identical across all pages, by design.

References use the pattern:
```html
…sentence.<sup class="refnote"><a href="#refN">[N]</a></sup>
…
<li id="refN">Source description.</li>
```

## Local preview

You can simply double-click `index.html`, but for cleanest behavior (and
to test how GitHub Pages will serve it) run a tiny local server:

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

## License & disclaimer

This is original fan-style content. **Pibbleology** is not affiliated with
any encyclopedia or reference work; the layout is an affectionate homage
to the encyclopedia format, not a copy. Treat the lore as a creative
sandbox: edit freely.
