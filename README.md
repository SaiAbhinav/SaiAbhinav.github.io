# Abhinav — Portfolio

Static portfolio built with plain HTML, CSS and JavaScript. No build step, no server:
**double-click `index.html`** and it opens in any modern browser.

## Structure

```
index.html                 page skeleton (semantic sections, dialog, toast)
CNAME                      custom domain for GitHub Pages (saiabhinav.dev)
css/styles.css             design tokens (dark theme), components, responsive rules
js/profile.js              name, tagline, email, LinkedIn, about, education, company logos
js/main.js                 renderers + behaviour (nav, filters, modal, animations)
assets/data/data.json      source content (same file as before)
assets/data/data.js        same content as window.PORTFOLIO_DATA, loaded by the page
assets/images/avatar.jpg   profile photo
assets/images/experience/  company logos for the timeline
```

## Updating content

- **Experience / projects / skills / achievements:** edit `assets/data/data.json`, then regenerate `assets/data/data.js` (or edit `data.js` directly).
  Browsers block `fetch()` of local JSON when a page is opened from disk, which is why the
  data lives in a `.js` file. If you prefer editing `data.json`, regenerate with:
  `node -e "const d=require('./assets/data/data.json');require('fs').writeFileSync('assets/data/data.js','window.PORTFOLIO_DATA = '+JSON.stringify(d,null,2)+';\n')"`
- **Personal details & company logos:** edit `js/profile.js` (add your LinkedIn URL).
- **Photo:** replace `assets/images/avatar.jpg`; initials show if it is missing.
- **Skill icons:** come from [Devicon](https://devicon.dev) (loaded from a CDN). The mapping
  lives in `DEVICON` in `js/main.js`; skills without a Devicon show a two-letter badge.
- **Achievements:** add an optional `"link"` to make a certificate clickable.

## Features

Dark theme · sticky nav with active-section
highlight and scroll progress · expandable
experience timeline · technology filters and detail dialog for projects · scroll reveals that
respect reduced-motion · keyboard accessible · responsive down to 320px.
