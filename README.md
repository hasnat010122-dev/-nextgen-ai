Next Gen AI website
A responsive, dependency-free corporate website for Next Gen AI, designed with a restrained, mature enterprise AI/product language.

Pages

index.html
 — company homepage
Broad Next Gen AI positioning across healthcare, industry, and enterprise operations.
Capabilities and operating principles.
Selected-project introductions.
MedStock Pro flagship-project deep dive.
Interactive medicine-label extraction preview.
Delivery approach, company statement, and contact workflow.

projects.html
 — dedicated project portfolio
A filterable portfolio organized across medical, industrial, and enterprise AI. Every project has its own visual and content space, with maturity stated honestly.

Included project spaces:

MedStock Pro — live pharmacy operations product.
Clinical Operations OS — in-development healthcare operations direction.
Medical Document Intelligence — research track for human-reviewed extraction.
Industrial Vision & Quality — industrial computer-vision exploration.
Predictive Operations — forecasting and reliability R&D direction.
Intelligent Workflow Systems — enterprise automation solution direction.
Visitors can filter projects by Medical, Industry, or Enterprise.

Main live product
MedStock Pro
https://medstock.nextaigen.org/

The website links prominently to the live product from the announcement bar, navigation, homepage portfolio, product deep dive, OCR interaction, dedicated project page, and footer.

Interactive medicine extraction preview
Visitors can:

Choose a sample medicine label.
Upload a local image for an interaction preview.
Run a simulated extraction workflow.
See medicine, strength, form, pack, batch, and expiry fields.
View a clearly marked preview-confidence value.
Copy simulated output as JSON.
This is explicitly identified as a front-end simulation. It does not claim to run live OCR and must not be used for dispensing, diagnosis, or clinical decisions.

Design direction
Original mature brand system: deep mineral black, warm porcelain, muted ultramarine, and soft sage.
High-contrast typography and editorial spacing.
Custom diagrams and interface visuals instead of generic stock imagery.
Project maturity presented clearly without overstating unfinished work.
No Three.js, GSAP, Font Awesome, or other runtime dependencies.
Responsive layouts, semantic HTML, accessible controls, and reduced-motion support.
Files
text

nextgen-ai/
├── index.html
├── projects.html
├── styles.css
├── script.js
└── README.md
Run locally
Bash

python -m http.server 8080
Then open http://localhost:8080.

Deployment
This is a static website. It can be deployed to Vercel, Netlify, GitHub Pages, Cloudflare Pages, or a standard web host without a build process.

Before production launch
Replace placeholder social links (href="#") with official profiles.
Review the names and maturity labels of future project directions.
Replace the mailto: contact workflow if a server-side form endpoint is introduced.
© 2026 Next Gen AI. Founded by Hasnat Ahmed.
