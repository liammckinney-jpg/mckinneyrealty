/* =========================================================================
   McKinney Realty — Compounding Modeler Engine Tests (Node)
   Run:  node tools/js/mck-compound-engine.test.js

   Acceptance tests per Compounding_Modeler_Spec_v1 §10. Locked values
   computed independently (Python, Aug 13 2026 session).

   TWO SPEC DEVIATIONS — FLAGGED, NOT FUDGED:
   1. §10.2 says 20-yr loan balance ≈ 44–46% of original. A 30-yr
      amortization at 4% leaves ~47.0–47.2% after 20 years under every
      compounding convention — 44–46% is unattainable. Locked at the
      true value (47.15%, simple monthly).
   2. §10.3 says cap = interest ⇒ levered CAGR ≈ unlevered (±0.3pp).
      With amortization and NOI growth in the engine, leverage amplifies
      growth and forced paydown even at zero spread, so equality cannot
      hold (defaults-shaped inputs give a ~4pp gap). Tested here as the
      spec's intent: the indicator flips sign exactly at zero spread,
      CAGR is monotonic in the spread, and decisively negative spread
      makes levered underperform unlevered.
   ========================================================================= */

'use strict';

var engine = require('./mck-compound-engine.js');

var failures = 0, passes = 0;

function approx(actual, expected, tol, label) {
  if (actual === null || actual === undefined || Math.abs(actual - expected) > tol) {
    failures++;
    console.error('  FAIL ' + label + ': expected ' + expected + ' ±' + tol + ', got ' + actual);
  } else passes++;
}

function ok(cond, label) {
  if (!cond) { failures++; console.error('  FAIL ' + label); }
  else passes++;
}

var DEFAULTS = {
  initialEquity: 750000, interestRate: 0.04, capRate: 0.0475,
  horizonYears: 20, ltv: 0.75, amortYears: 30, noiGrowth: 0.025,
  capRateDriftBps: 0, refiEnabled: false, refiIntervalYears: 7
};

function run(overrides) {
  return engine.simulate(Object.assign({}, DEFAULTS, overrides || {}));
}

/* ---------------------------------------------------------------
   1. Ch. 1 parity at defaults ($3M building, 75% LTV, 30-yr, 4%,
      4.75% cap, 2.5% growth)
   --------------------------------------------------------------- */
console.log('1. Chapter 1 parity (defaults)');
var d = run();
approx(d.purchasePrice, 3000000, 0.01, 'purchase price $3M');
approx(d.noi0, 142500, 0.01, 'NOI_0 $142,500');
var y1 = d.years[1];
approx(y1.principal, 39623.35, 1, 'year-1 principal (locked; band 39K±3%)');
ok(y1.principal >= 39000 * 0.97 && y1.principal <= 39000 * 1.03, 'year-1 principal within spec band');
approx(y1.cashFlow, 13597.87, 1, 'year-1 cash flow (locked; band 13.5K±5%)');
ok(y1.cashFlow >= 13500 * 0.95 && y1.cashFlow <= 13500 * 1.05, 'year-1 cash flow within spec band');
approx(y1.value - d.purchasePrice, 75000, 0.01, 'year-1 appreciation exactly $75K');
var gain1 = y1.equity - 750000;
ok(gain1 >= 127000 * 0.97 && gain1 <= 127000 * 1.03, 'year-1 total equity gain within 127K±3% (got ' + Math.round(gain1) + ')');
var roe1 = gain1 / 750000;
ok(roe1 >= 0.165 && roe1 <= 0.175, 'year-1 return on equity 17%±0.5pp (got ' + (roe1 * 100).toFixed(2) + '%)');

/* ---------------------------------------------------------------
   2. Long-arc parity (defaults, 20 yrs, refi off)
   --------------------------------------------------------------- */
console.log('2. Long-arc parity (20 yrs)');
var y20 = d.years[20];
approx(y20.value, 4915849.11, 1, 'value at 20 yrs (locked; band 4.9M±2%)');
ok(y20.value >= 4900000 * 0.98 && y20.value <= 4900000 * 1.02, 'value within spec band');
// SPEC DEVIATION 1: true ratio is 47.15%, spec's 44–46% is unattainable
approx(y20.balance, 1060974.23, 1, 'loan balance at 20 yrs (locked)');
approx(y20.balance / d.loan0, 0.4715, 0.0005, 'balance ratio 47.15% (spec band 44–46% flagged as unattainable)');
var equityExCF = y20.value - y20.balance;
ok(equityExCF >= 3800000 && equityExCF <= 4000000, 'equity ex-cash-flow within 3.8–4.0M (got ' + Math.round(equityExCF) + ')');
approx(d.endingEquity, y20.equity, 0.01, 'endingEquity matches year-20 row');
approx(d.equityMultiple, d.endingEquity / 750000, 1e-12, 'equity multiple consistent');
approx(d.cagr, Math.pow(d.endingEquity / 750000, 1 / 20) - 1, 1e-12, 'CAGR consistent');

/* ---------------------------------------------------------------
   3. Spread sign & monotonicity (see header for deviation note)
   --------------------------------------------------------------- */
console.log('3. Spread sign');
ok(run({ capRate: 0.0475 }).spreadBps === 75, 'spread +75 bps at defaults');
ok(run({ capRate: 0.04 }).spreadBps === 0, 'spread 0 at cap = interest');
ok(run({ capRate: 0.04 }).negativeLeverage === false, 'zero spread: indicator off');
ok(run({ capRate: 0.0395 }).negativeLeverage === true, 'cap < interest: indicator on');
ok(run({ capRate: 0.0395 }).spreadBps === -5, 'signed spread −5 bps');
// CAGR strictly increasing in cap rate (spread), everything else fixed
var c35 = run({ capRate: 0.035 }).cagr;
var c40 = run({ capRate: 0.04 }).cagr;
var c475 = run({ capRate: 0.0475 }).cagr;
ok(c35 < c40 && c40 < c475, 'CAGR monotonic in spread (' +
  (c35 * 100).toFixed(2) + ' < ' + (c40 * 100).toFixed(2) + ' < ' + (c475 * 100).toFixed(2) + ')');
// Decisively negative spread: levered underperforms unlevered.
// Growth is zeroed here to isolate the spread mechanism — with NOI
// growth on, leverage-on-growth can outrun even a −500bps spread
// (levered 4.73% vs unlevered 4.49% at cap 3%/i 8%/g 2.5%), which is
// itself a teaching point, not a bug.
var levNeg = run({ capRate: 0.035, interestRate: 0.06, noiGrowth: 0 }).cagr;
var unlevNeg = run({ capRate: 0.035, interestRate: 0.06, noiGrowth: 0, ltv: 0 }).cagr;
ok(levNeg < unlevNeg, 'g=0, cap 3.5% / interest 6%: levered CAGR (' + (levNeg * 100).toFixed(2) +
  '%) < unlevered (' + (unlevNeg * 100).toFixed(2) + '%)');

/* ---------------------------------------------------------------
   4. Refinance & Repeat invariants
   --------------------------------------------------------------- */
console.log('4. Refi invariants');
var single = run();
var refiFree = run({ refiEnabled: true, refiIntervalYears: 7, refiFrictionRate: 0 });
ok(refiFree.endingEquity >= single.endingEquity - 0.01,
  'friction 0: portfolio equity at horizon >= single asset (' +
  Math.round(refiFree.endingEquity) + ' vs ' + Math.round(single.endingEquity) + ')');
// friction = 2%: at the first refi event the only difference vs the
// frictionless run is exactly the friction amount at that timestep
var refi2 = run({ refiEnabled: true, refiIntervalYears: 7, refiFrictionRate: 0.02 });
var ev = refi2.years.find(function (y) { return y.refiEvent; });
var evFree = refiFree.years[ev.t];
// friction = 2% of the new loan taken in the WITH-friction run
var frictionPaid = 0.02 * (DEFAULTS.ltv * refiFree.years[ev.t - 1] ?
  0 : 0); // placeholder, computed exactly below
// exact: rebuild the pre-event state — identical in both runs up to the event
var preBal = single.years[ev.t].balance;      // schedule identical pre-event
var preVal = single.years[ev.t].value;
var newLoan = DEFAULTS.ltv * preVal;
frictionPaid = 0.02 * newLoan;
approx(evFree.equity - ev.equity, frictionPaid, 0.5,
  'friction 2%: first event reduces net worth by exactly the friction (' + Math.round(frictionPaid) + ')');
ok(ev.t === 7, 'first refi event lands at year 7');
ok(refi2.buildingCount > 1, 'refi grows building count (' + refi2.buildingCount.toFixed(1) + ')');
ok(refi2.years.filter(function (y) { return y.refiEvent; }).length === 2, 'events at 7 and 14 only (t<T)');
// LTV 0 cannot cash-out refi
ok(run({ ltv: 0, refiEnabled: true }).buildingCount === 1, 'LTV 0: no refi events fire');

/* ---------------------------------------------------------------
   5. Amortization lever
   --------------------------------------------------------------- */
console.log('5. Amortization');
var am40 = run({ amortYears: 40 });
approx(am40.years[1].principal, 23266.91, 1, '40-yr year-1 principal (locked)');
ok(am40.years[1].principal < d.years[1].principal, '40-yr year-1 principal < 30-yr');
ok(am40.years[1].cashFlow > d.years[1].cashFlow, '40-yr year-1 cash flow strictly higher');
approx(am40.years[1].cashFlow, 29657.02, 1, '40-yr year-1 cash flow (locked)');

/* ---------------------------------------------------------------
   Internal consistency
   --------------------------------------------------------------- */
console.log('6. Consistency');
// Equity decomposition: E_t = E0 + paydown + cumCF + appreciation (by construction)
d.years.forEach(function (y) {
  if (y.t === 0) return;
  approx(750000 + y.paydownCum + y.cumCashFlow + y.appreciation, y.equity, 0.01,
    'decomposition sums to equity at t=' + y.t);
});
// Cap-rate drift: +100bps drift at horizon lowers ending value
var drifted = run({ capRateDriftBps: 100 });
ok(drifted.years[20].capRateT > 0.057 && drifted.years[20].capRateT < 0.058, 'drift reaches cap+100bps at horizon');
ok(drifted.endingEquity < d.endingEquity, 'positive drift (softening) lowers ending equity');
// Negative cash flow is preserved, not clamped
var negCF = run({ capRate: 0.03, interestRate: 0.08 });
ok(negCF.years[1].cashFlow < 0, 'negative cash flow flows through unclamped');
ok(negCF.dscrYear1 < 1, 'DSCR-equivalent < 1 flagged for the qualification notice');
// DSCR at defaults is comfortably above 1
ok(d.dscrYear1 > 1.05, 'defaults DSCR-equivalent > 1 (' + d.dscrYear1.toFixed(3) + ')');

/* --------------------------------------------------------------- */
console.log('');
if (failures > 0) {
  console.error(failures + ' FAILED, ' + passes + ' passed');
  process.exit(1);
}
console.log('All ' + passes + ' assertions passed.');
