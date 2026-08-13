# Next Gen AI website

A responsive, dependency-free corporate website for **Next Gen AI**, designed with a restrained, mature enterprise AI/product language.

## Pages

### `index.html` — company homepage

- Broad Next Gen AI positioning across healthcare, industry, and enterprise operations.
- Capabilities and operating principles.
- Selected-project introductions.
- MedStock Pro flagship-project deep dive.
- Interactive medicine-label extraction preview.
- Delivery approach, company statement, and contact workflow.

### `projects.html` — dedicated project portfolio

A filterable portfolio organized across medical, industrial, and enterprise AI. Every project has its own visual and content space, with maturity stated honestly.

Included project spaces:

1. **MedStock Pro** — live pharmacy operations product.
2. **Clinical Operations OS** — in-development healthcare operations direction.
3. **Medical Document Intelligence** — research track for human-reviewed extraction.
4. **Industrial Vision & Quality** — industrial computer-vision exploration.
5. **Predictive Operations** — forecasting and reliability R&D direction.
6. **Intelligent Workflow Systems** — enterprise automation solution direction.

Visitors can filter projects by Medical, Industry, or Enterprise.

## Main live product

**MedStock Pro**  
<https://medstock.nextaigen.org/>

The website links prominently to the live product from the announcement bar, navigation, homepage portfolio, product deep dive, OCR interaction, dedicated project page, and footer.

## Interactive medicine extraction preview

Visitors can:

- Choose a sample medicine label.
- Upload a local image for an interaction preview.
- Run a simulated extraction workflow.
- See medicine, strength, form, pack, batch, and expiry fields.
- View a clearly marked preview-confidence value.
- Copy simulated output as JSON.

> This is explicitly identified as a front-end simulation. It does not claim to run live OCR and must not be used for dispensing, diagnosis, or clinical decisions.

## Design direction

- Original mature brand system: deep mineral black, warm porcelain, muted ultramarine, and soft sage.
- High-contrast typography and editorial spacing.
- Custom diagrams and interface visuals instead of generic stock imagery.
- Project maturity presented clearly without overstating unfinished work.
- No Three.js, GSAP, Font Awesome, or other runtime dependencies.
- Responsive layouts, semantic HTML, accessible controls, and reduced-motion support.

## SEO foundation

The current build includes:

- Canonical and social metadata for `www.nextaigen.org`.
- Organization, WebSite, Service, SoftwareApplication and breadcrumb structured data.
- Dedicated landing pages for MedStock Pro, healthcare AI and industrial AI.
- `robots.txt`, `sitemap.xml`, social preview images and an IndexNow key file.
- A complete free self-managed workflow in `SEO-PLAYBOOK.md`.

## Files

```text
nextgen-ai/
├── assets/
│   ├── favicon-32.png
│   ├── logo-512.png
│   └── og-*.png
├── index.html
├── projects.html
├── medstock-pro.html
├── healthcare-ai-solutions.html
├── industrial-ai-solutions.html
├── robots.txt
├── sitemap.xml
├── 07efcfc23c3fa84210e573db5d285828.txt
├── SEO-PLAYBOOK.md
├── styles.css
├── script.js
└── README.md
```

## Run locally

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>.

## Deployment

This is a static website. It can be deployed to Vercel, Netlify, GitHub Pages, Cloudflare Pages, or a standard web host without a build process.

## Before production launch

- Replace placeholder social links (`href="#"`) with official profiles.
- Review the names and maturity labels of future project directions.
- The current enquiry email is `hasnat010122@gmail.com`. Replace the runtime email configuration in `script.js` if a server-side form endpoint is introduced.

© 2026 Next Gen AI. Founded by Hasnat Ahmed.
