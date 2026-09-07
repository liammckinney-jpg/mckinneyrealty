/* =========================================================================
   Listings filter/sort layer (spec §5) — client-side over data.json.
   Every filter state is URL-encoded so any view is a shareable URL:
     units=5-11,25-49  markets=quinte,kingston  price_min/price_max
     ppu_min/ppu_max   cap=1  cap_min=5         within=7|30|90
     sort=price-asc|price-desc|ppu|units|cap    (default: newest, omitted)
   Market pages carry body[data-market] and are pre-filtered; the market
   multi-select exists only on the index. No public strings live here
   except the §6 count line, rebuilt exactly as generated at build time.
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
  var BUCKETS = { '5-11': [5, 11], '12-24': [12, 24], '25-49': [25, 49], '50+': [50, Infinity] };
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
      units: checked('units'),
      markets: marketSlug ? [marketSlug] : checked('markets'),
      priceMin: num('price_min'), priceMax: num('price_max'),
      ppuMin: num('ppu_min'), ppuMax: num('ppu_max'),
      capOnly: form.elements.cap ? form.elements.cap.checked : false,
      capMin: num('cap_min'),
      within: form.elements.within.value ? parseInt(form.elements.within.value, 10) : null,
      sort: form.elements.sort.value || '',
    };
  }

  function writeUrl(s) {
    var q = new URLSearchParams();
    if (s.units.length) q.set('units', s.units.join(','));
    if (!marketSlug && s.markets.length) q.set('markets', s.markets.join(','));
    if (s.priceMin != null) q.set('price_min', s.priceMin);
    if (s.priceMax != null) q.set('price_max', s.priceMax);
    if (s.ppuMin != null) q.set('ppu_min', s.ppuMin);
    if (s.ppuMax != null) q.set('ppu_max', s.ppuMax);
    if (s.capOnly) q.set('cap', '1');
    if (s.capMin != null) q.set('cap_min', s.capMin);
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
    if (q.get('units')) setChecks('units', q.get('units'));
    if (!marketSlug && q.get('markets')) setChecks('markets', q.get('markets'));
    ['price_min', 'price_max', 'ppu_min', 'ppu_max', 'cap_min'].forEach(function (k) {
      if (q.get(k) != null && form.elements[k]) form.elements[k].value = q.get(k);
    });
    if (q.get('cap') === '1' && form.elements.cap) form.elements.cap.checked = true;
    if (q.get('within')) form.elements.within.value = q.get('within');
    if (q.get('sort')) form.elements.sort.value = q.get('sort');
    return q.toString().length > 0;
  }

  /* ---------------- filter + sort ---------------- */
  function matches(l, s) {
    if (s.units.length) {
      var hit = s.units.some(function (b) {
        var r = BUCKETS[b];
        return r && l.units >= r[0] && l.units <= r[1];
      });
      if (!hit) return false;
    }
    if (s.markets.length && s.markets.indexOf(l.market) === -1) return false;
    if (s.priceMin != null && l.listPrice < s.priceMin) return false;
    if (s.priceMax != null && l.listPrice > s.priceMax) return false;
    if (s.ppuMin != null && l.ppu < s.ppuMin) return false;
    if (s.ppuMax != null && l.ppu > s.ppuMax) return false;
    if (s.capOnly && l.cap == null) return false;
    if (s.capMin != null && (l.cap == null || l.cap * 100 < s.capMin)) return false;
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
    'ppu': function (a, b) { return a.ppu - b.ppu; },
    'units': function (a, b) { return b.units - a.units; },
    // Reported cap: listings without NOI sort last, never hidden (spec §5)
    'cap': function (a, b) {
      if (a.cap == null && b.cap == null) return newestFirst(a, b);
      if (a.cap == null) return 1;
      if (b.cap == null) return -1;
      return b.cap - a.cap;
    },
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
  fetch('/apartment-buildings-for-sale/data.json')
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
