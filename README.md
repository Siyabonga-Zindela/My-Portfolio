# Siyabonga Zindela — Portfolio 2026

A transformed, immersive single-page developer portfolio. Same identity, same content,
same black-and-cyan theme — elevated with engineered motion, a Certificates section and
a Geekulcha Annual Hackathon 2026 highlight.

Everything is plain **HTML + CSS + JavaScript** (same stack as before). No build step,
no framework. Deploy it anywhere static sites are hosted (Netlify, Vercel, GitHub Pages).

---

## What is inside

```
index.html            the whole experience (one page)
css/style.css         design system + all styles
js/main.js            app logic (nav, cursor, lightbox, form, canvas)
js/animations.js      motion engine (GSAP + ScrollTrigger + Lenis)
js/data/certificates.js   YOUR CERTIFICATES — edit this file
js/data/hackathon.js      YOUR HACKATHON PHOTOS — edit this file
js/vendor/            gsap.min.js, ScrollTrigger.min.js, lenis.min.js (local copies)
fonts/                Space Grotesk + JetBrains Mono (local, no CDN)
img/                  your images (original assets + new placeholder slots)
img/certificates/     drop certificate images here
img/hackathon/        drop hackathon photographs here
docs/                 SIYABONGA ZINDELA - CV.pdf (resume download)
projects.html / skills.html / contact.html   redirect stubs for old links
```

---

## Adding your certificates (2 minutes)

1. Drop each certificate image into `img/certificates/`
   (PNG or JPG, roughly landscape 4:3 or 10:7).
2. Open `js/data/certificates.js` and replace each placeholder entry:

```js
{
  title:  "AWS Cloud Practitioner",        // your certificate title
  issuer: "Amazon Web Services",           // issuing organisation
  year:   "2026",
  image:  "img/certificates/my-cert.png",  // your file name
}
```

3. Delete the placeholder entries you do not need. The grid, hover effects and
   click-to-enlarge lightbox are generated automatically.

## Adding your hackathon photographs (2 minutes)

1. Drop the photos into `img/hackathon/`.
2. Open `js/data/hackathon.js` and edit the entries:

```js
{
  src:     "img/hackathon/team-photo.jpg",
  alt:     "Team cybernet_wsu working during GKHack26",
  caption: "The team mid-build",
}
```

The **first entry becomes the large feature photo**, the rest fill the grid.
Add as many as you like — the layout adapts.

---

## What was preserved from the original portfolio

- All sections: Home, About Me, Skills, Projects, Resume, Contact
- All copy: bio, profile details, education, project descriptions, stats (5+ / 1+ / 3)
- All four projects with their real GitHub links and live links
- The contact form (EmailJS — same service and template IDs, now with inline
  success/error feedback instead of alert popups)
- Resume PDF download, LinkedIn / GitHub links, black + cyan identity

## What is new

- Preloader with counter and staged entrance sequence
- Custom cursor (dot + trailing ring, grows on interactive elements)
- Smooth scrolling (Lenis) synced with GSAP ScrollTrigger
- Hero: masked line-by-line title reveal, scramble-in eyebrow, count-up stats,
  rotating dashed photo ring, ambient particle field that reacts to the mouse
- Tech-stack marquee under the hero
- Scroll-triggered reveals everywhere, parallax project imagery, drawing dividers
- Magnetic buttons, 3D tilt on skill cards, animated scrollspy navigation
- **Certificates section** with lightbox viewer
- **Geekulcha Annual Hackathon 2026 highlight** with fact cards and editorial gallery
- Scroll progress bar, fullscreen mobile menu with staggered links

## Accessibility and performance

- `prefers-reduced-motion` is fully respected: all motion, the cursor, Lenis and the
  preloader switch off and content renders statically.
- Animations use transform/opacity only; the particle canvas pauses when the hero is
  off-screen and reduces particle count on small devices.
- Semantic sections, skip link, ARIA labels, keyboard-operable lightbox (Esc to close),
  visible focus states.
- No external CDN needed at runtime (fonts and libraries are local), except the EmailJS
  SDK used by the contact form — same as the original site.

## Deploying

Netlify: drag this folder into https://app.netlify.com/drop — or push it to your
existing repository. The old page links (`projects.html`, `skills.html`, `contact.html`)
redirect to their sections on the new single-page site, so nothing breaks.
