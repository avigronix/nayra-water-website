/* =========================================================
   NAYRA — SITE CONFIG
   Sirf yahi file edit karke number, products, prices,
   address waghaira badal sakte hain. HTML chhune ki zarurat nahi.
   Badlaav ke baad `npm run dist` chalayein — ye SEO tags, JSON-LD,
   sitemap.xml aur robots.txt bhi isi file se update kar dega.
   ========================================================= */
window.NAYRA_CONFIG = {
  brand: "NAYRA",
  tagline: "हर घूँट में नयापन",
  company: "NAYRA Pure Water",

  // Final website address (https, bina aakhri "/" ke)
  siteUrl: "https://www.nayrawater.in", // TODO: asli domain confirm karein

  // WhatsApp number: country code ke saath, bina + / space ke (e.g. 919876543210)
  whatsappNumber: "919999999999", // TODO: asli number daalein
  phoneDisplay: "+91 99999 99999", // TODO
  email: "info@nayrawater.in",      // TODO

  address: "Room No. 238, Gali No. 6, New Ashok Nagar, Delhi - 110096",
  mapQuery: "New Ashok Nagar, Delhi 110096",
  fssaiLicense: "22725276000444",
  businessHours: "Mon – Sat, 9:00 AM – 8:00 PM", // TODO: confirm
  // Same hours in schema.org format (SEO). e.g. "Mo-Sa 09:00-20:00"
  openingHoursSchema: "Mo-Sa 09:00-20:00",       // TODO: confirm

  // Products — price "" chhodne par "Price on request" dikhega.
  // image: optional, e.g. "assets/img/products/1l.webp" (warna bottle illustration dikhega)
  // Jo size nahi bechte, uski line hata dein ya available: false kar dein.
  products: [
    { id: "1l",    name: "NAYRA 1 Litre",  size: "1 L",    pack: "Case of 12 bottles", price: "", tag: "Best Seller",   image: "", available: true },
    { id: "500ml", name: "NAYRA 500 ml",   size: "500 ml", pack: "Case of 24 bottles", price: "", tag: "On the go",     image: "", available: true }, // TODO: confirm
    { id: "250ml", name: "NAYRA 250 ml",   size: "250 ml", pack: "Case of 48 bottles", price: "", tag: "Events",        image: "", available: true }, // TODO: confirm
    { id: "20l",   name: "NAYRA 20 L Jar", size: "20 L",   pack: "Refillable jar",     price: "", tag: "Home & Office", image: "", available: true }  // TODO: confirm
  ],

  // Social links (sirf https:// links) — khali chhodne par icon hide ho jayega
  social: { instagram: "", facebook: "", youtube: "" },

  // Delivery areas (Order form + FAQ mein dikhenge)
  serviceAreas: "East Delhi, Mayur Vihar, Noida, Ghaziabad and nearby areas" // TODO: confirm
};
