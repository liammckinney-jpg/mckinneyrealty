/* =========================================================================
   Listings filter/sort layer (spec §5, Sept 18 2026 amendment) — client-side
   over data.json. Every filter state is URL-encoded so any view is a
   shareable URL:
     band=2-5,13-20   markets=quinte,kingston   price_min/price_max
     within=7|30|90   sort=price-asc|price-desc     (default: newest, omitted)

   There is no unit-count, price-per-unit or cap-rate filter: the MLS®
   commercial form carries none of those values. Buildings carry one of four
   unit BANDS; see scripts/listings/provider.js.

   Each page fetches its OWN data.json, which holds only that page's slice.
   That is deliberate — IDX Data Agreement 6.3(b) caps what a consumer may
   view or retrieve in response to an inquiry at 100 listings, so the whole
   snapshot is never shipped to the browser at once.

   KNOWN LIMIT, needs a decision before real volume: when a scope spans more
   than one page, these filters narrow only the loaded page. Filtering across
   the full set needs either pre-generated filter routes or a query endpoint.
   With the fixture set (40, single page) the two are identical.

   Market pages carry body[data-market] and are pre-filtered; the market
   multi-select exists only on the index. No public strings live here except
   the §6 count line, rebuilt exactly as generated at build time.
   ========================================================================= */
(function () {
  'use strict';
  var R = window.MCK_LISTINGS_RENDER;
  var form = document.getElementById('lst-filters');
  var grid = document.getElementById('lst-grid');
  var countEl = document.getElementById('lst-count');
  var emptyEl = document.getElementById('lst-empty');
  if (!form || !grid || !R) return;

  var marketSlug = document.body.getAttribute('data-market') || '';
  var marketName = document.body.getAttribute('data-market-name') || '';
  var all = null;

  function $$(sel) { return Array.prototype.slice.call(form.querySelectorAll(sel)); }
  function num(name) {
    var el = form.elements[name];
    if (!el) return null;
    var v = parseFloat(el.value);
    return isNaN(v) ? null : v;
  }

  /* ---------------- state <-> URL ---------------- */
  function readState() {
    var checked = function (name) {
      return $$('input[name="' + name + '"]:checked').map(function (el) { return el.value; });
    };
    return {
      bands: checked('band'),
      markets: marketSlug ? [marketSlug] : checked('markets'),
      priceMin: num('price_min'), priceMax: num('price_max'),
      within: form.elements.within.value ? parseInt(form.elements.within.value, 10) : null,
      sort: form.elements.sort.value || '',
    };
  }

  function writeUrl(s) {
    var q = new URLSearchParams();
    if (s.bands.length) q.set('band', s.bands.join(','));
    if (!marketSlug && s.markets.length) q.set('markets', s.markets.join(','));
    if (s.priceMin != null) q.set('price_min', s.priceMin);
    if (s.priceMax != null) q.set('price_max', s.priceMax);
    if (s.within != null) q.set('within', s.within);
    if (s.sort) q.set('sort', s.sort);
    var qs = q.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function applyUrlToForm() {
    var q = new URLSearchParams(location.search);
    if (!q.toString()) return false;
    var setChecks = function (name, csv) {
      var want = (csv || '').split(',');
      $$('input[name="' + name + '"]').forEach(function (el) {
        el.checked = want.indexOf(el.value) !== -1;
      });
    };
    if (q.get('band')) setChecks('band', q.get('band'));
    if (!marketSlug && q.get('markets')) setChecks('markets', q.get('markets'));
    ['price_min', 'price_max'].forEach(function (k) {
      if (q.get(k) != null && form.elements[k]) form.elements[k].value = q.get(k);
    });
    if (q.get('within')) form.elements.within.value = q.get('within');
    if (q.get('sort')) form.elements.sort.value = q.get('sort');
    return q.toString().length > 0;
  }

  /* ---------------- filter + sort ---------------- */
  function matches(l, s) {
    if (s.bands.length && s.bands.indexOf(l.bandSlug) === -1) return false;
    if (s.markets.length && s.markets.indexOf(l.market) === -1) return false;
    if (s.priceMin != null && l.listPrice < s.priceMin) return false;
    if (s.priceMax != null && l.listPrice > s.priceMax) return false;
    if (s.within != null && (l.dom == null || l.dom > s.within)) return false;
    return true;
  }

  function newestFirst(a, b) {
    var da = a.dom == null ? 9999 : a.dom;
    var db = b.dom == null ? 9999 : b.dom;
    if (da !== db) return da - db;
    return String(b.modified).localeCompare(String(a.modified));
  }

  var SORTS = {
    '': newestFirst,
    'price-asc': function (a, b) { return a.listPrice - b.listPrice; },
    'price-desc': function (a, b) { return b.listPrice - a.listPrice; },
  };

  function apply() {
    if (!all) return;
    var s = readState();
    var rows = all.filter(function (l) { return matches(l, s); });
    rows.sort(SORTS[s.sort] || newestFirst);
    grid.innerHTML = rows.map(R.renderCard).join('\n');
    // §6 count line, character-for-character with the build-time version
    countEl.textContent = marketSlug
      ? rows.length + ' buildings in ' + marketName
      : rows.length + ' buildings listed';
    emptyEl.hidden = rows.length > 0;
    grid.hidden = rows.length === 0;
    writeUrl(s);
  }

  /* ---------------- init ---------------- */
  // Relative, so a market page or page 2 loads its own slice — never the
  // whole snapshot (6.3(b)).
  var DATA_URL = location.pathname.replace(/[^/]*$/, '') + 'data.json';
  fetch(DATA_URL)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      all = d.listings;
      if (applyUrlToForm()) apply();
    });

  form.addEventListener('change', apply);
  form.addEventListener('input', function (e) {
    if (e.target && e.target.type === 'number') apply();
  });
})();
