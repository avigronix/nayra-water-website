/* NAYRA — main.js (vanilla JS, no dependencies, CSP-safe: no inline code, no eval) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  const C = window.NAYRA_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Security helpers ---------- */
  // Escape anything that goes into HTML strings
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"'`]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c]));
  // Only allow absolute https:// links (blocks javascript:, data:, etc.)
  const safeHttps = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : ''; } catch { return ''; } };
  // Only allow local image paths inside assets/img
  const safeImg = (p) => (typeof p === 'string' && /^assets\/img\/[\w\-/]+\.(webp|png|jpe?g|svg|avif)$/i.test(p) && !p.includes('..')) ? p : '';
  // Strip control / bidi-override characters from visitor input (prevents spoofed WhatsApp text)
  const clean = (s, multiline = false) => {
    let v = String(s || '').normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩﻿]/g, '');
    v = multiline ? v.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n') : v.replace(/\s+/g, ' ');
    return v.trim();
  };

  const waNumber = String(C.whatsappNumber || '').replace(/\D/g, '');
  const waBase = `https://wa.me/${waNumber}`;
  const telHref = 'tel:+' + waNumber;

  /* ---------- Fill config values (textContent only — never innerHTML) ---------- */
  const setText = (sel, val) => { if (val) $$(sel).forEach(el => (el.textContent = val)); };
  setText('[data-phone]', C.phoneDisplay);
  setText('[data-email]', C.email);
  setText('[data-address]', C.address);
  setText('[data-fssai]', C.fssaiLicense);
  setText('[data-hours]', C.businessHours);
  setText('[data-areas]', C.serviceAreas);
  if (waNumber) $$('[data-phone-link]').forEach(el => (el.href = telHref));
  if (C.email && /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(C.email)) $$('[data-email-link]').forEach(el => (el.href = 'mailto:' + C.email));
  if (waNumber) $$('[data-wa-link]').forEach(el => (el.href = `${waBase}?text=${encodeURIComponent('Hi NAYRA, I would like to know more about your water supply.')}`));
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Map: click-to-load (privacy + performance) ---------- */
  const mapQ = encodeURIComponent(C.mapQuery || C.address || 'New Ashok Nagar, Delhi');
  const mapLink = $('#mapLink');
  if (mapLink) mapLink.href = `https://www.google.com/maps/search/?api=1&query=${mapQ}`;
  const loadMap = $('#loadMap');
  if (loadMap) loadMap.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.title = 'NAYRA location on Google Maps';
    f.className = 'absolute inset-0 h-full w-full border-0';
    f.loading = 'lazy';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    f.src = `https://www.google.com/maps?q=${mapQ}&z=15&output=embed`;
    $('#mapBox').appendChild(f);
    $('#mapPlaceholder').remove();
    f.focus();
  });

  /* ---------- Social links ---------- */
  const icons = {
    instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7c-.1-1.6-.4-3-1.6-4.2S17.6 1.2 16 1.1C14.3 1 9.7 1 8 1.1 6.4 1.2 5 1.5 3.8 2.7S2.2 5.4 2.1 7C2 8.7 2 13.3 2.1 15c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.3 0-8z"/>',
    facebook: '<path d="M14 8V6c0-.8.6-1 1-1h3V1h-4C10.7 1 10 3.5 10 5.2V8H7v4h3v11h4V12h3.5l.5-4z"/>',
    youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.8 3z"/>'
  };
  const social = $('#socialLinks');
  if (social) Object.entries(C.social || {}).forEach(([k, url]) => {
    const href = safeHttps(url);
    if (!href || !icons[k]) return;
    social.insertAdjacentHTML('beforeend',
      `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="NAYRA on ${esc(k)}" class="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-tap-500 hover:text-nayra-950"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${icons[k]}</svg></a>`);
  });

  /* ---------- Products ---------- */
  const grid = $('#productGrid');
  const select = $('#product');
  const products = (C.products || []).filter(p => p && p.available && p.id);
  const sizeH = { '1 L': 'h-60', '500 ml': 'h-52', '250 ml': 'h-44', '20 L': 'h-48' };
  products.forEach(p => {
    const price = p.price ? `₹${esc(p.price)}` : 'Price on request';
    const img = safeImg(p.image);
    const isJar = /20\s*l/i.test(p.size);
    const imgHtml = img
      ? `<img src="${esc(img)}" alt="${esc(p.name)}" class="relative h-48 w-auto object-contain transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="200" height="300">`
      : isJar
        ? `<img src="assets/img/jar.svg" alt="${esc(p.name)}" class="relative h-48 w-auto transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="260" height="372">`
        : `<img src="assets/img/nayra-bottle.svg" alt="${esc(p.name)} bottle" class="relative ${sizeH[p.size] || 'h-40'} w-auto transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="200" height="580">`;
    grid.insertAdjacentHTML('beforeend', `
      <article class="reveal group flex flex-col rounded-[1.75rem] bg-[#f4f7fb] p-2 transition duration-300 hover:bg-[#eaf1fa]">
        <div class="relative grid h-72 place-items-center overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_60%,#ffffff,#e6eef8_70%)]">
          <span class="absolute bottom-6 left-1/2 h-6 w-32 -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(15,26,61,.18),transparent)]" aria-hidden="true"></span>
          ${p.tag ? `<span class="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-nayra-800 uppercase shadow-sm">${esc(p.tag)}</span>` : ''}
          <span class="absolute top-3 right-4 font-serif text-2xl text-nayra-500 italic">${esc(p.size)}</span>
          ${imgHtml}
        </div>
        <div class="flex flex-1 flex-col px-4 pt-5 pb-4">
          <h3 class="text-lg font-semibold tracking-tight text-nayra-950">${esc(p.name)}</h3>
          <p class="mt-0.5 text-sm text-slate-600">${esc(p.pack)}</p>
          <div class="mt-auto flex items-center justify-between gap-3 pt-6">
            <span class="text-sm font-medium text-slate-600">${price}</span>
            <a href="#order" data-product="${esc(p.id)}" class="order-btn inline-flex min-h-11 items-center gap-1.5 rounded-full bg-nayra-950 px-5 text-sm font-semibold text-white transition group-hover:bg-tap-500 group-hover:text-nayra-950" aria-label="Order ${esc(p.name)}">Order
              <svg class="ico h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
      </article>`);
    const o = document.createElement('option');
    o.value = p.id; o.textContent = `${p.name} — ${p.pack}`;
    select.appendChild(o);
  });

  /* ---------- Navbar: transparent → solid on scroll ---------- */
  const nav = $('#navbar');
  const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  // only touch the DOM when the state actually changes (avoids style recalc on every scroll frame)
  const setNav = () => {
    const v = String(window.scrollY > 40 || !menu.classList.contains('hidden'));
    if (nav.dataset.solid !== v) nav.dataset.solid = v;
  };
  let ticking = false;
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { setNav(); ticking = false; }); } }, { passive: true });
  setNav();

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
    setNav();
  };
  menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.classList.contains('hidden')) { setMenu(false); menuBtn.focus(); } });
  window.matchMedia('(min-width: 1024px)').addEventListener?.('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- Pause the floating bottle animation while the hero is off-screen ---------- */
  const floater = $('.float');
  if (floater && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => floater.classList.toggle('paused', !e.isIntersecting)).observe(floater);
  }

  /* ---------- Form ---------- */
  const form = $('#orderForm');
  const typeRadios = $$('input[name="type"]', form);
  const ORDER_TYPES = ['Place Order', 'Bulk / Event'];
  const isOrderType = () => ORDER_TYPES.includes(form.elements.type.value);

  const applyType = () => {
    const isOrder = isOrderType();
    $$('[data-order-only]', form).forEach(el => el.classList.toggle('hidden', !isOrder));
    $('[data-addr-star]', form).classList.toggle('hidden', !isOrder);
    $('[data-addr-label]', form).textContent = isOrder ? 'Delivery Address' : 'City / Area';
    const addr = $('#address');
    addr.placeholder = isOrder ? 'House / shop no., street, area, city' : 'Your city / area (optional)';
    addr.required = isOrder;
    $('#product').required = isOrder;
    // clear stale errors from hidden fields
    if (!isOrder) ['#product', '#qty', '#date', '#address'].forEach(id => showErr($(id), false));
  };
  const setType = (val) => {
    const r = typeRadios.find(x => x.value === val);
    if (r) { r.checked = true; applyType(); }
  };
  typeRadios.forEach(r => r.addEventListener('change', applyType));

  // "Order" buttons on product cards → preselect product; CTA buttons → preselect type
  document.addEventListener('click', e => {
    const btn = e.target.closest('.order-btn');
    if (btn) { setType('Place Order'); select.value = btn.dataset.product; showErr(select, false); }
    const pre = e.target.closest('.prefill');
    if (pre) setType(pre.dataset.type);
    if (btn || pre) setTimeout(() => $('#name').focus({ preventScroll: true }), reduce ? 0 : 600);
  });

  // Qty +/-
  const qty = $('#qty');
  $$('.qty-btn', form).forEach(b => b.addEventListener('click', () => {
    qty.value = Math.min(9999, Math.max(1, (parseInt(qty.value, 10) || 1) + Number(b.dataset.step)));
    showErr(qty, false);
  }));

  // Min delivery date = today (local)
  const today = (() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); })();
  $('#date').min = today;

  // Digits only
  ['#phone', '#pincode'].forEach(id => $(id).addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (id === '#phone' && v.length > 10) v = v.replace(/^(91|0)/, '');  // pasted +91 / 0 prefix
    e.target.value = v.slice(0, id === '#phone' ? 10 : 6);
  }));

  const toast = (msg) => {
    const t = $('#toast'); t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._h); t._h = setTimeout(() => (t.style.opacity = '0'), 2800);
  };
  function showErr(el, bad) {
    if (!el) return false;
    const err = el.id && document.getElementById(el.id + '-err');
    if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (err) err.classList.toggle('hidden', !bad);
    return bad;
  }
  // Clear an error as soon as the visitor fixes the field
  $$('.field', form).forEach(el => el.addEventListener('input', () => el.getAttribute('aria-invalid') && showErr(el, false)));

  applyType();

  const fmtDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);           // parse as local date (no UTC shift)
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  let lastSend = 0;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!waNumber) { toast('WhatsApp number is not configured yet'); return; }
    if (Date.now() - lastSend < 3000) return;               // avoid accidental double-taps

    const f = Object.fromEntries(new FormData(form).entries());
    const type = typeRadios.map(r => r.value).includes(f.type) ? f.type : 'General Enquiry';
    const isOrder = ORDER_TYPES.includes(type);
    const v = {
      name: clean(f.name).slice(0, 60),
      phone: String(f.phone || '').replace(/\D/g, ''),
      pincode: String(f.pincode || '').replace(/\D/g, ''),
      address: clean(f.address, true).slice(0, 250),
      message: clean(f.message, true).slice(0, 500),
      qty: parseInt(f.qty, 10),
      unit: ['Cases / Boxes', 'Bottles / Jars'].includes(f.unit) ? f.unit : 'Cases / Boxes',
      date: /^\d{4}-\d{2}-\d{2}$/.test(f.date || '') ? f.date : ''
    };
    const prod = products.find(p => p.id === f.product);

    let bad = false;
    bad = showErr($('#name'), v.name.length < 2) || bad;
    bad = showErr($('#phone'), !/^[6-9]\d{9}$/.test(v.phone)) || bad;
    bad = showErr($('#pincode'), v.pincode !== '' && !/^[1-9]\d{5}$/.test(v.pincode)) || bad;
    if (isOrder) {
      bad = showErr($('#product'), !prod) || bad;
      bad = showErr(qty, !(v.qty >= 1 && v.qty <= 9999)) || bad;
      bad = showErr($('#date'), v.date !== '' && v.date < today) || bad;
      bad = showErr($('#address'), v.address.length < 5) || bad;
    }
    if (bad) {
      toast('Please fix the highlighted fields');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const lines = [
      `*New ${type} — NAYRA Website*`,
      '',
      `*Name:* ${v.name}`,
      `*Mobile:* +91 ${v.phone}`
    ];
    if (isOrder) {
      lines.push(`*Product:* ${prod.name} (${prod.pack})`);
      lines.push(`*Quantity:* ${v.qty} ${v.unit}`);
      if (v.date) lines.push(`*Delivery Date:* ${fmtDate(v.date)}`);
    }
    if (v.address) lines.push(`*${isOrder ? 'Address' : 'City / Area'}:* ${v.address}`);
    if (v.pincode) lines.push(`*Pincode:* ${v.pincode}`);
    if (v.message) lines.push('', `*Message:* ${v.message}`);

    const url = `${waBase}?text=${encodeURIComponent(lines.join('\n'))}`;
    lastSend = Date.now();
    toast('Opening WhatsApp…');
    // Anchor click (inside the user gesture) works on desktop WhatsApp Web and Android/iOS apps.
    // Note: window.open(..., 'noopener') always returns null, so it can't detect popup blocking.
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); a.remove();
    form.reset(); applyType();
  });
})();
