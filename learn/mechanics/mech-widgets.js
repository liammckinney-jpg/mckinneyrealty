/* =========================================================================
   The Mechanics — shared widget module
   Compute functions are NOT reimplemented here: mortgage math comes from
   MCK_ENGINE (tools/js/mck-calc-engine.js, Canadian semi-annual
   compounding), loaded before this file on every concept page, so the
   lessons and the Underwriter can never disagree.

   One canonical hypothetical building is defined here and used by every
   widget for continuity across the library.
   ========================================================================= */

(function (root) {
  'use strict';
  var E = root.MCK_ENGINE;

  /* ---------------------------------------------------------------
     The canonical hypothetical: a twelve-unit walk-up.
     Illustrative figures — not a listing, not a market claim.
     --------------------------------------------------------------- */
  var BLDG = {
    units: 12,
    rentRoll: [
      { label: '2BR', count: 10, rent: 1400 },
      { label: '1BR', count: 2,  rent: 1150 }
    ],
    otherMonthly: 200,          // common laundry
    vacancyPct: 3,              // part of the hypothetical, editable in widgets
    opex: [                      // annual, landlord-paid
      { key: 'tx', label: 'Property taxes',            amt: 26400 },
      { key: 'in', label: 'Insurance',                 amt: 9600  },
      { key: 'uw', label: 'Water & sewer',             amt: 10800 },
      { key: 'uh', label: 'Common-area hydro',         amt: 4200  },
      { key: 'ut', label: 'Heat (landlord-paid)',      amt: 14400 },
      { key: 'rp', label: 'Repairs & maintenance',     amt: 12000 },
      { key: 'su', label: 'Superintendent',            amt: 6000  },
      { key: 'sn', label: 'Snow & grounds',            amt: 4800  },
      { key: 'ws', label: 'Waste removal',             amt: 2400  },
      { key: 'lg', label: 'Admin & accounting',        amt: 3000  }
    ]
  };
  BLDG.gprMonthly = BLDG.rentRoll.reduce(function (s, r) { return s + r.count * r.rent; }, 0); // 16,300
  BLDG.gprAnnual = BLDG.gprMonthly * 12;                                                       // 195,600
  BLDG.otherAnnual = BLDG.otherMonthly * 12;                                                   // 2,400
  BLDG.opexTotal = BLDG.opex.reduce(function (s, l) { return s + l.amt; }, 0);                 // 93,600

  // Current-year arithmetic on the hypothetical (or overrides).
  function egi(o) {
    o = o || {};
    var gpr = o.gprAnnual !== undefined ? o.gprAnnual : BLDG.gprAnnual;
    var vac = o.vacancyPct !== undefined ? o.vacancyPct : BLDG.vacancyPct;
    var oth = o.otherAnnual !== undefined ? o.otherAnnual : BLDG.otherAnnual;
    return gpr * (1 - vac / 100) + oth;
  }
  function noi(o) {
    o = o || {};
    var ox = o.opexTotal !== undefined ? o.opexTotal : BLDG.opexTotal;
    return egi(o) - ox;
  }
  // Annual debt service via the shared engine (semi-annual compounding).
  function ads(loan, ratePct, years) {
    if (!(loan > 0) || !isFinite(ratePct) || !(years > 0)) return NaN;
    return E.monthlyPayment(loan, ratePct / 100, years) * 12;
  }

  /* ---------------------------------------------------------------
     Formatting (mirrors the Underwriter's display conventions)
     --------------------------------------------------------------- */
  var cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
  function fmt$(v)   { return (v === null || v === undefined || !isFinite(v)) ? '—' : cad.format(Math.round(v)); }
  function fmtPct(v, d) { return !isFinite(v) ? '—' : (v * 100).toFixed(d === undefined ? 2 : d) + '%'; }
  function fmtX(v)   { return !isFinite(v) ? '—' : v.toFixed(2); }

  /* ---------------------------------------------------------------
     Analytics (guarded; pixel mirrored when it lands)
     --------------------------------------------------------------- */
  function track(name, params) {
    if (typeof root.gtag === 'function') root.gtag('event', name, params || {});
    if (typeof root.fbq !== 'undefined') root.fbq('trackCustom', name, params || {});
  }
  var engagedPages = {};
  function engage(slug) {
    if (engagedPages[slug]) return;
    engagedPages[slug] = true;
    track('mechanics_widget_engaged', { concept: slug });
  }

  /* ---------------------------------------------------------------
     Underwriter deep links — compact permalink keys, building facts
     only. Financing stays user-chosen unless the widget's own inputs
     set it (e.g. the lender's-math sliders).
     --------------------------------------------------------------- */
  function underwriterLink(params) {
    var q = new URLSearchParams();
    Object.keys(params || {}).forEach(function (k) {
      var v = params[k];
      if (v !== undefined && v !== null && v !== '') q.set(k, v);
    });
    return '/tools/underwrite?' + q.toString();
  }
  // The canonical building as Underwriter state (no price, no financing).
  function bldgParams(extra) {
    var p = {
      u: BLDG.units,
      rm: BLDG.gprMonthly,
      la: BLDG.otherMonthly,
      v: BLDG.vacancyPct,
      tx: 26400,
      ox: BLDG.opexTotal - 26400,   // remaining opex as the Simple-mode lump
      mode: 'adv'
    };
    Object.keys(extra || {}).forEach(function (k) { p[k] = extra[k]; });
    return p;
  }
  function wireToolCta(el, slug, paramsFn) {
    el.addEventListener('click', function () {
      track('mechanics_to_underwriter', { concept: slug });
      el.href = underwriterLink(paramsFn());
    });
  }

  var LABEL = 'A hypothetical twelve-plex. Illustrative figures — not a listing, not a market claim.';

  root.MECH = {
    BLDG: BLDG, egi: egi, noi: noi, ads: ads,
    fmt$: fmt$, fmtPct: fmtPct, fmtX: fmtX,
    track: track, engage: engage,
    underwriterLink: underwriterLink, bldgParams: bldgParams, wireToolCta: wireToolCta,
    LABEL: LABEL
  };
})(typeof self !== 'undefined' ? self : this);
