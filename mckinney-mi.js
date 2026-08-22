/* ============================================================
   McKinney Realty — Market Intelligence block (single source)
   Renders the MI data — date line, stat cards, narrative, watch
   list — into slot containers on index.html and /insights so the
   two pages cannot drift. Page-specific chrome (section header,
   subscribe CTA) stays in each page's static HTML.

   Edition: Q1 2026 (light revision Aug 22, 2026, Liam-approved —
   dated, stale lines removed; figures unchanged). The Q2/Q3 2026
   edition is a sourced research task and replaces this wholesale.
   ============================================================ */
(function () {
  'use strict';

  var DATELINE = 'Market view — Q1 2026 · data through Q4 2025.';

  var CARDS = [
    { num: '25.1%', text: '<strong>Q4 2025 CRE investment surge.</strong> Transaction volumes accelerating as rate cuts take hold.' },
    { num: '~60%', text: '<strong>Mortgages renewing 2025–26.</strong> Sub-2% locks face resets requiring significant fresh equity.' },
    { num: '84%', text: '<strong>Insurance increase, past decade.</strong> Repriced to a permanently higher base; renewals have recently cooled.' },
    { num: '25K', text: '<strong>2025 completions — the peak.</strong> 25,000 units, the highest since 1987.' }
  ];

  var NARRATIVE = [
    'Cap rates have stabilized after two years of expansion. The bid-ask gap that froze the market in 2023 has closed, and transaction volume surged 25.1% quarter-over-quarter in Q4 2025 as Bank of Canada rate cuts restored positive leverage.',
    'Simultaneously, construction starts are pausing across the province. Punitive development charges, tariff-driven materials costs, and broken pro formas have shut down the new supply pipeline. National apartment completions peaked at 25,000 units in 2025 — the highest since 1987 — but that peak is now behind us.',
    'These structural dynamics are converging with a generational ownership transition: aging operators facing refinancing at dramatically higher rates, six-figure capital items coming due on 1970s-era building systems, and insurance costs repriced to a permanently higher base over the past decade.'
  ];

  var WATCH = [
    { k: 'Bank of Canada rate path', v: 'Projected 50–75bps of additional cuts through 2026, restoring positive leverage for stabilized assets.' },
    { k: 'Vacancy compression', v: 'Ontario purpose-built vacancy tightening as immigration-driven demand outpaces stalled new supply.' },
    { k: 'Generational transitions', v: 'Aging operators facing refinancing cliffs and deferred CapEx creating a multi-year disposition wave.' }
  ];

  function fill(sel, html) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  }

  function render() {
    var dl = document.querySelector('[data-mi="dateline"]');
    if (dl) {
      dl.textContent = DATELINE;
      dl.style.cssText = 'font-family:"DM Sans",-apple-system,sans-serif;font-size:0.75rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#9A8B6F;margin:0 0 22px;';
    }

    fill('[data-mi="cards"]', CARDS.map(function (c) {
      return '<div class="intel-card"><div class="intel-card-num">' + c.num + '</div><div class="intel-card-text">' + c.text + '</div></div>';
    }).join(''));

    fill('[data-mi="narrative"]', NARRATIVE.map(function (p) {
      return '<p>' + p + '</p>';
    }).join(''));

    fill('[data-mi="watch"]', '<div class="intel-sidebar-title">What we\'re watching</div>' + WATCH.map(function (w) {
      return '<div class="intel-sidebar-item"><strong>' + w.k + '</strong>' + w.v + '</div>';
    }).join(''));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
