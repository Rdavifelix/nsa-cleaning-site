/* NSA Cleaning — site behaviour (no dependencies). Hooks are data-attributes so markup can change freely. */
(function () {
  'use strict';
  var d = document, w = window;
  var CONSENT_KEY = 'nsa_cookie_consent';
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function store(k, v) { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- Mobile navigation ---------- */
  $$('[data-nav-toggle]').forEach(function (btn) {
    var targetSel = btn.getAttribute('data-nav-toggle') || '[data-nav]';
    var nav = $(targetSel);
    if (!nav) return;
    btn.setAttribute('aria-expanded', 'false');
    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      d.documentElement.classList.toggle('nav-open', open);
      /* keep Tab inside the open menu: everything outside the header is inert (no-op where unsupported) */
      $$('.skip-link, .topbar, main, footer, .mobile-cta, [data-cookie-banner]').forEach(function (el) { el.inert = open; });
    }
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); if (!nav.classList.contains('is-open')) btn.focus(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); btn.focus(); } });
  });
  /* Dropdown submenus: open on click for touch/keyboard (hover handled in CSS) */
  $$('[data-submenu-toggle]').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item = btn.closest('[data-has-submenu]') || btn.parentElement;
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  /* Header shadow after scroll */
  var header = $('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', w.scrollY > 8); };
    onScroll(); w.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Analytics (GA4) gated by cookie consent ---------- */
  var gaId = (d.querySelector('meta[name="ga-id"]') || {}).content || '';
  var gaLoaded = false;
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;
  function loadGA() {
    if (gaLoaded || !gaId) return;
    gaLoaded = true;
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', gaId, { anonymize_ip: true });
    var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    d.head.appendChild(s);
  }
  function track(name, params) { if (gaLoaded) gtag('event', name, params || {}); }

  /* ---------- Cookie consent banner ---------- */
  var banner = $('[data-cookie-banner]');
  function showBanner() { if (banner) { banner.hidden = false; banner.setAttribute('aria-hidden', 'false'); } }
  function hideBanner() { if (banner) { banner.hidden = true; banner.setAttribute('aria-hidden', 'true'); } }
  function revokeGA() {
    if (!gaLoaded) return;
    w['ga-disable-' + gaId] = true;
    gtag('consent', 'update', { analytics_storage: 'denied' });
    var host = location.hostname, parts = host.split('.'), apex = parts.length > 2 ? parts.slice(-2).join('.') : host;
    d.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      d.cookie = name + '=; Max-Age=0; path=/';
      [host, '.' + host, '.' + apex].forEach(function (dom) { d.cookie = name + '=; Max-Age=0; path=/; domain=' + dom; });
    });
  }
  function applyConsent(value) {
    store(CONSENT_KEY, value);
    hideBanner();
    if (value === 'granted') loadGA(); else revokeGA();
  }
  var saved = read(CONSENT_KEY);
  if (saved === 'granted') loadGA();
  else if (saved !== 'denied' && gaId) showBanner();
  $$('[data-consent]').forEach(function (b) { b.addEventListener('click', function () { applyConsent(b.getAttribute('data-consent') === 'accept' ? 'granted' : 'denied'); }); });
  $$('[data-open-cookie-settings]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); store(CONSENT_KEY, undefined); showBanner(); }); });

  /* ---------- Click tracking for calls / emails / CTAs ---------- */
  $$('a[href^="tel:"]').forEach(function (a) { a.addEventListener('click', function () { track('click_call', { link_url: a.href }); }); });
  $$('a[href^="mailto:"]').forEach(function (a) { a.addEventListener('click', function () { track('click_email', { link_url: a.href }); }); });
  $$('[data-track]').forEach(function (a) { a.addEventListener('click', function () { track(a.getAttribute('data-track'), { link_text: (a.textContent || '').trim().slice(0, 60) }); }); });

  /* ---------- Quote buttons → GoHighLevel chat widget ----------
     Every "Get a Free Quote" button carries data-quote-open and opens the chat widget. The widget script loads async, so a click that lands before
     it is ready waits a few seconds for it; if it never shows up the button falls back to its
     href (/contact). Without JavaScript the button is a plain link to /contact. */
  /* /contact embeds the GoHighLevel form (#quote) and does not load the chat: there the
     buttons scroll to the form instead. */
  var quoteForm = d.getElementById('quote');
  function chatApi() {
    var lc = w.leadConnector;
    return lc && lc.chatWidget && typeof lc.chatWidget.openWidget === 'function' ? lc.chatWidget : null;
  }
  function openChat(timeoutMs, onFail) {
    var api = chatApi();
    if (api) { api.openWidget(); return; }
    var waited = 0;
    var iv = w.setInterval(function () {
      waited += 200;
      api = chatApi();
      if (api) { w.clearInterval(iv); api.openWidget(); }
      else if (waited >= timeoutMs) { w.clearInterval(iv); if (onFail) onFail(); }
    }, 200);
  }
  function samePage(href) {
    var a = d.createElement('a'); a.href = href;
    return a.pathname.replace(/\/+$/, '') === location.pathname.replace(/\/+$/, '');
  }
  d.addEventListener('click', function (e) {
    var t = e.target;
    var opener = t && t.closest && t.closest('[data-quote-open]');
    if (!opener || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (quoteForm) {
      track('scroll_quote_form', { link_text: (opener.textContent || '').trim().slice(0, 60) });
      quoteForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    track('open_chat_widget', { link_text: (opener.textContent || '').trim().slice(0, 60) });
    openChat(4000, function () { if (!samePage(opener.href)) w.location.assign(opener.href); });
  });
  if (!quoteForm && (/[?&]quote(=|&|$)/.test(location.search) || location.hash === '#quote')) {
    w.addEventListener('load', function () { openChat(10000); });
  }

  /* The widget renders in a shadow root and its bubble sits at bottom:20px, right over the
     sticky .mobile-cta bar on phones. Outside CSS can't reach it, so a <style> goes inside the
     shadow root; the lift itself is --chat-lift from styles.css (0 on desktop). Only the closed
     state moves: the open panel keeps the widget's own full-height mobile layout. */
  var CHAT_STYLE_ID = 'nsa-chat-lift';
  function liftChat(root) {
    if (root.getElementById(CHAT_STYLE_ID)) return;
    var st = d.createElement('style');
    st.id = CHAT_STYLE_ID;
    st.textContent = '#lc_text-widget:not(.lc_text-widget--active){bottom:calc(20px + var(--chat-lift, 0px)) !important}';
    root.appendChild(st);
  }
  var chatWait = 0;
  var chatPoll = w.setInterval(function () {
    var host = d.querySelector('chat-widget');
    var root = host && host.shadowRoot;
    if (root) {
      w.clearInterval(chatPoll);
      liftChat(root);
      new MutationObserver(function () { liftChat(root); }).observe(root, { childList: true });
    } else if ((chatWait += 250) >= 30000) w.clearInterval(chatPoll);
  }, 250);

  /* ---------- Before / after comparison slider ----------
     Driven by pointer and keyboard on the box itself (role="slider"), with no <input>: the page
     must not contain any form control next to the chat widget (A2P "multiple opt-ins" check). */
  $$('[data-compare]').forEach(function (box) {
    var after = box.querySelector('[data-compare-after]');
    if (!after) return;
    var pos = 50, dragging = false;
    function set(v) {
      pos = Math.max(0, Math.min(100, v));
      after.style.width = pos + '%'; box.style.setProperty('--pos', pos + '%');
      box.setAttribute('aria-valuenow', String(Math.round(pos)));
    }
    function fromPointer(e) { var r = box.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); }
    box.addEventListener('pointerdown', function (e) { dragging = true; if (box.setPointerCapture) box.setPointerCapture(e.pointerId); fromPointer(e); });
    box.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    ['pointerup', 'pointercancel'].forEach(function (t) { box.addEventListener(t, function () { dragging = false; }); });
    box.addEventListener('keydown', function (e) {
      var step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
      if (step) set(pos + step); else if (e.key === 'Home') set(0); else if (e.key === 'End') set(100); else return;
      e.preventDefault();
    });
    set(50);
  });
})();
