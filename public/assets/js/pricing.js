/*
 * The live price on /pricing.
 *
 * The owner sets one price per active user per month in the admin panel
 * (Plans → Paid). The application publishes it at
 * https://app.caspianerp.com/api/public/site — public, cached a few minutes —
 * so changing it there changes it here without editing this site.
 *
 * An enhancement only: the page ships with "Priced per active user, per month,
 * plus VAT" in place of a figure, which is what a visitor without JavaScript,
 * or with the application unreachable, reads. Nothing is sent but the request
 * itself; no cookie, no identifier. The origin must match APP_ORIGIN in
 * i18n/config.mjs and be allowed by connect-src in firebase.json.
 */
(function () {
  var amount = document.querySelector('[data-live-price]');
  if (!amount || !window.fetch) return;
  window.fetch('https://app.caspianerp.com/api/public/site', { credentials: 'omit' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (config) {
      var p = config && config.pricing;
      if (!p || typeof p.perUserMonthly !== 'number' || !(p.perUserMonthly > 0) || !/^[A-Z]{3}$/.test(p.currency)) return;
      var lang = document.documentElement.lang || 'en';
      var text;
      try {
        text = new Intl.NumberFormat(lang, {
          style: 'currency', currency: p.currency,
          maximumFractionDigits: p.perUserMonthly % 1 === 0 ? 0 : 2,
        }).format(p.perUserMonthly);
      } catch (e) {
        text = p.perUserMonthly + ' ' + p.currency;
      }
      amount.textContent = text;
      amount.hidden = false;
      document.querySelectorAll('[data-live-price-unit]').forEach(function (n) { n.hidden = false; });
      document.querySelectorAll('[data-price-fallback]').forEach(function (n) { n.hidden = true; });
    })
    .catch(function () { /* the fallback wording stays */ });
})();
