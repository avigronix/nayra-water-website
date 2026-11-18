# Prompt for VS Code AI agent (copy-paste the block below)

```
You are working on the NAYRA website in this folder — a static single-page site for
"NAYRA Pure Packaged Drinking Water" (Delhi), tagline "हर घूँट में नयापन".
Stack: index.html + Tailwind CSS v4 (src/input.css → assets/css/style.css) + vanilla JS
(assets/js/config.js, assets/js/main.js). No framework, no backend. Reference site for
style/feel: https://clearpani.com/

Read README.md, index.html, src/input.css, assets/js/config.js and assets/js/main.js
fully before changing anything. Then do the following, in order:

1. SETUP
   - Run `npm install`, then `npm run build` and confirm assets/css/style.css is regenerated
     without errors. Keep using `npm run dev` (watch) while editing.
   - Never add the Tailwind Play CDN. All styling must come from the compiled style.css.

2. CONFIG (assets/js/config.js) — replace TODO values with these real details:
   - whatsappNumber: <91XXXXXXXXXX>      phoneDisplay: <+91 XXXXX XXXXX>
   - email: <email>                       businessHours: <hours>
   - serviceAreas: <areas>
   - products (name, size, pack, price, tag) — remove sizes we do not sell:
     <list products and prices here>
   - social links: <instagram/facebook/youtube URLs or leave empty>

3. BRAND ASSETS
   - If assets/img/logo-original.png (official logo) exists, use it in the navbar and footer
     instead of the inline SVG / logo.svg; keep alt text and height (h-9 sm:h-10).
   - If real product photos exist in assets/img/products/ (e.g. 1l.png, 500ml.png, 20l.png),
     add an optional `image` field per product in config.js and use it in main.js product
     cards, falling back to bottle.svg. Convert photos to WebP (max ~200 KB each).

4. QUALITY CHECKS — fix anything that fails:
   - Responsive at 360px, 390px, 768px, 1024px, 1440px: no horizontal scroll, no overlapping
     text, tap targets ≥ 44px, mobile sticky Call/Order bar does not hide the footer content.
   - Order form: required-field validation (name, 10-digit Indian mobile starting 6-9,
     product + address for Order/Bulk, optional 6-digit pincode). On submit it must open
     https://wa.me/<number>?text=... with a neatly formatted message (bold labels, line
     breaks) on both desktop (WhatsApp Web) and Android/iOS. Test all 4 enquiry types and the
     "Order" buttons on product cards (they must pre-select the product).
   - Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
     Add width/height on images, lazy-load below-the-fold images, keep fonts with
     display=swap, ensure colour contrast and labels on all inputs/buttons.
   - No console errors. `prefers-reduced-motion` must disable animations.

5. SEO
   - Set the final domain in <link rel="canonical">, og:url and an absolute og:image URL.
   - Add sitemap.xml with the final domain and reference it in robots.txt.
   - Update the JSON-LD LocalBusiness block with telephone, email, url and openingHours.

6. FINISH
   - Run `npm run build` (minified).
   - Produce a clean deploy folder `dist/` containing only: index.html, assets/, robots.txt,
     sitemap.xml (no node_modules, src, package files).
   - Summarise what you changed and anything still pending.

Rules: keep the existing design language (navy #1E3A8A / sky blue / tap-orange #F58220,
Poppins + Tiro Devanagari Hindi), keep all content factual to the bottle label
(multi-stage purification, micro-filtration, ozonisation, FSSAI Lic. 22725276000444,
best before 6 months) — do not invent certifications (ISO, BIS, RO, mineral content,
pH values) or customer testimonials unless I provide them.
```
