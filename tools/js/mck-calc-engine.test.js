/* =========================================================================
   McKinney Realty — Calculator Engine Unit Tests (Node)
   Run:  node tools/js/mck-calc-engine.test.js

   Worked-example expectations were computed independently (Python,
   Aug 12 2026 session) and are LOCKED — if a code change moves these
   numbers, the code is wrong, not the test.
   ========================================================================= */

'use strict';

var params = require('./mck-params.js');
var engine = require('./mck-calc-engine.js');

var failures = 0, passes = 0;

function approx(actual, expected, tol, label) {
  tol = tol === undefined ? 0.01 : tol;
  if (actual === null || actual === undefined || Math.abs(actual - expected) > tol) {
    failures++;
    console.error('  FAIL ' + label + ': expected ' + expected + ', got ' + actual);
  } else {
    passes++;
  }
}

function ok(cond, label) {
  if (!cond) { failures++; console.error('  FAIL ' + label); }
  else passes++;
}

/* ---------------------------------------------------------------
   Payment math — Canadian semi-annual compounding
   --------------------------------------------------------------- */
console.log('Payment math');
// 4.5% semi-annual: monthly rate = 1.0225^(1/6)-1 = 0.00371532...
approx(engine.monthlyRate(0.045), 0.0037153199, 1e-9, 'monthlyRate 4.5%');
// $900,000 @ 4.5%, 20 yr → $5,673.65/mo (locked)
approx(engine.monthlyPayment(900000, 0.045, 20), 5673.65, 0.01, 'monthlyPayment 900k/4.5%/20yr');
// PV round-trip: loanFromPayment(payment(L)) === L
approx(engine.loanFromPayment(engine.monthlyPayment(1500000, 0.0415, 45), 0.0415, 45),
       1500000, 0.01, 'PV round-trip');
// Zero principal / zero payment guards
approx(engine.monthlyPayment(0, 0.05, 25), 0, 0, 'zero principal');
approx(engine.loanFromPayment(0, 0.05, 25), 0, 0, 'zero payment');
// Remaining balance: 900k @ 4.5% 20yr after 60 months → 743,725.75 (locked)
approx(engine.remainingBalance(900000, 0.045, 20, 60), 743725.75, 0.01, 'remainingBalance 60mo');

/* ---------------------------------------------------------------
   Premium grid
   --------------------------------------------------------------- */
console.log('Premium grid (July 14 2025)');
// LOCKED (status doc §2a): 95% LTV base 6.15% + 1.00% (45-yr surcharge)
// = 7.15%, tier discount applies to the TOTAL: ×0.80 = 5.72%
approx(engine.premiumRate(0.95, 45, 0, params), 0.0715, 1e-9, '95%/45yr undiscounted total');
approx(engine.premiumRate(0.95, 45, 0.20, params), 0.0572, 1e-9, '95%/45yr/70pts = 5.72% (discount on total)');
// 90% bucket shares the 6.15% base
approx(engine.premiumRate(0.90, 45, 0.20, params), 0.0572, 1e-9, '90%/45yr/20% off');
// 85% LTV, 40-yr, no discount: 5.35% + 3×0.25% = 6.10%
approx(engine.premiumRate(0.85, 40, 0, params), 0.0610, 1e-9, '85%/40yr');
// Band edge: exactly 65% at 25 yr → 2.50% anchor, no surcharge
approx(engine.premiumRate(0.65, 25, 0, params), 0.0250, 1e-9, '65%/25yr band edge');
// Unverified mid buckets (65–80%) must return null, never a number
ok(engine.premiumRate(0.6501, 25, 0, params) === null, '65.01% unverified bucket → null');
ok(engine.premiumRate(0.78, 45, 0.20, params) === null, '78% unverified bucket → null');
// Partial surcharge step in a verified bucket (29 yr = 0 full steps)
approx(engine.premiumRate(0.85, 29, 0, params), 0.0535, 1e-9, '29yr no full step');

/* ---------------------------------------------------------------
   Tool 1 — locked worked example
   price $2M, 10 units, gross $180k, other $6k, vacancy 3%,
   opEx 40% of EGI ($72,168 → NOI $108,252),
   insured 4.15%, conventional 5.25%, tier = MLI Select 70
   --------------------------------------------------------------- */
console.log('Tool 1 worked example');
var t1inputs = {
  price: 2000000, units: 10,
  grossIncome: 180000, otherIncome: 6000,
  vacancyRate: 0.03, opEx: 72168,
  rateInsured: 0.0415, rateConventional: 0.0525
};
var comparison = engine.computeFinancingComparison(t1inputs, 'mliSelect70', params);
var sel = comparison[0], std = comparison[1], conv = comparison[2];

approx(sel.noi, 108252, 0.01, 'NOI');
// MLI Select 70 — 95% LTV, LTV-bound (DSCR net max just above the cap)
approx(sel.maxLoanLTV, 1900000, 0.01, 'Select70 maxLoan_LTV @95%');
approx(sel.maxLoanDSCR, 1906059.74, 0.5, 'Select70 maxLoan_DSCR (premium-inclusive net)');
approx(sel.maxLoan, 1900000, 0.01, 'Select70 maxLoan');
ok(sel.bindingConstraint === 'LTV', 'Select70 LTV-bound');
approx(sel.downPayment, 100000, 0.01, 'Select70 down payment');
approx(sel.premium, 108680, 0.5, 'Select70 premium (5.72% eff.)');
approx(sel.monthlyPayment, 8174.84, 0.05, 'Select70 monthly payment');
approx(sel.dscrActual, 1.1035, 0.0005, 'Select70 DSCR actual');
approx(sel.cashFlow, 10153.96, 1, 'Select70 cash flow');
approx(sel.cashOnCash, 0.078107, 0.0001, 'Select70 cash-on-cash');
// MLI Standard — DSCR-bound once the premium is inside the constraint
approx(std.maxLoanDSCR, 1666767.66, 0.5, 'Standard maxLoan_DSCR (premium-inclusive net)');
approx(std.maxLoan, 1666767.66, 0.5, 'Standard maxLoan');
ok(std.bindingConstraint === 'DSCR', 'Standard DSCR-bound');
approx(std.downPayment, 333232.34, 0.5, 'Standard down payment');
approx(std.premium, 101672.83, 0.5, 'Standard premium (6.10%)');
approx(std.monthlyPayment, 7517.50, 0.05, 'Standard monthly payment');
approx(std.dscrActual, 1.20, 1e-6, 'Standard DSCR sits exactly on the floor');
approx(std.cashFlow, 18042.00, 1, 'Standard cash flow');
approx(std.cashOnCash, 0.049671, 0.0001, 'Standard cash-on-cash');
// Conventional — DSCR-bound, no premium
approx(conv.maxLoanDSCR, 1211039.07, 0.5, 'Conventional maxLoan_DSCR');
ok(conv.bindingConstraint === 'DSCR', 'Conventional DSCR-bound');
approx(conv.premium, 0, 0, 'Conventional no premium');
approx(conv.dscrActual, 1.25, 0.0001, 'Conventional DSCR = floor exactly');
approx(conv.cashOnCash, 0.026436, 0.0001, 'Conventional cash-on-cash');

/* ---------------------------------------------------------------
   Tool 1 — edge cases
   --------------------------------------------------------------- */
console.log('Tool 1 edge cases');
// DSCR/LTV crossover: weak income makes every scenario DSCR-bound —
// and whenever DSCR binds, actual DSCR must sit on/above the floor
// even with the premium capitalized (status doc §2b).
var weak = Object.assign({}, t1inputs, { grossIncome: 90000, opEx: 60000 });
engine.computeFinancingComparison(weak, 'mliSelect70', params).forEach(function (s) {
  ok(s.bindingConstraint === 'DSCR', s.label + ' DSCR-bound when income is weak');
  if (s.dscrActual !== null) {
    var scen = params.scenarios[s.key];
    ok(s.dscrActual >= scen.minDSCR - 1e-9,
      s.label + ' DSCR ' + s.dscrActual.toFixed(4) + ' >= floor ' + scen.minDSCR);
  }
});
// Weak Select 70 lands in the verified ≤65% bucket: net loan 599,728.86
// at 2.80% effective premium, DSCR exactly on the 1.10 floor (locked)
var weakSel = engine.computeFinancingComparison(weak, 'mliSelect70', params)[0];
approx(weakSel.maxLoan, 599728.86, 0.5, 'weak Select70 net max loan');
approx(weakSel.dscrActual, 1.10, 1e-6, 'weak Select70 DSCR exactly on floor');
// DSCR-bound net loan falling in an unverified premium bucket (LTV ~78%):
// engine must flag premiumUnavailable and null premium-dependent outputs
var adsTarget = engine.monthlyPayment(1560000, 0.0415, 45) * 12;
var midBucket = {
  price: 2000000, units: 10,
  grossIncome: adsTarget * 1.10, otherIncome: 0,
  vacancyRate: 0, opEx: 0,
  rateInsured: 0.0415, rateConventional: 0.0525
};
var midSel = engine.computeFinancingComparison(midBucket, 'mliSelect70', params)[0];
ok(midSel.bindingConstraint === 'DSCR', 'mid-bucket case is DSCR-bound');
approx(midSel.maxLoan, 1560000, 1, 'mid-bucket falls back to premium-exclusive gross');
ok(midSel.premiumUnavailable === true, 'mid-bucket flags premiumUnavailable');
ok(midSel.premium === null, 'mid-bucket premium is null');
ok(midSel.monthlyPayment === null, 'mid-bucket payment suppressed');
ok(midSel.dscrActual === null, 'mid-bucket DSCR suppressed');
ok(midSel.cashOnCash === null, 'mid-bucket cash-on-cash suppressed');
// <5 units: CMHC scenarios flagged ineligible, conventional still eligible
var small = Object.assign({}, t1inputs, { units: 4 });
var smallComp = engine.computeFinancingComparison(small, 'mliSelect70', params);
ok(smallComp[0].eligible === false, '<5 units: Select ineligible');
ok(smallComp[1].eligible === false, '<5 units: Standard ineligible');
ok(smallComp[2].eligible === true, '<5 units: Conventional eligible');
// Negative NOI → zero DSCR loan, negative cash flow, no crash
var negative = Object.assign({}, t1inputs, { grossIncome: 20000, opEx: 80000 });
var negComp = engine.computeFinancingComparison(negative, 'mliSelect70', params);
ok(negComp[0].maxLoanDSCR === 0, 'negative NOI → DSCR loan 0');
ok(negComp[0].maxLoan === 0, 'negative NOI → max loan 0');
ok(negComp[0].cashFlow < 0, 'negative NOI → negative cash flow');
ok(isFinite(negComp[0].downPayment), 'negative NOI → finite down payment');

/* ---------------------------------------------------------------
   Tool 2 — locked worked example
   sale $3M, commission 4%, legal $7,500, mortgage $900k,
   penalty $25k, purchase $1.8M, improvements $50k,
   building 80%, CCA claimed $220k
   --------------------------------------------------------------- */
console.log('Tool 2 worked example');
var t2inputs = {
  salePrice: 3000000, commissionRate: 0.04, legalClosing: 7500,
  mortgageBalance: 900000, penalty: 25000,
  purchasePrice: 1800000, improvements: 50000,
  buildingPortion: 0.80, ccaClaimed: 220000,
  ownership: 'personal', marginalRate: 0.5353
};
var dP = engine.computeDisposition(t2inputs, params);
approx(dP.commission, 120000, 0.01, 'commission');
approx(dP.grossProceeds, 2872500, 0.01, 'gross proceeds');
approx(dP.capitalGain, 1150000, 0.01, 'capital gain');
approx(dP.taxableGain, 575000, 0.01, 'taxable gain @ 50% inclusion');
approx(dP.recapture, 220000, 0.01, 'recapture = full CCA (appreciating building)');
approx(dP.tax, 425563.50, 0.01, 'personal tax');
approx(dP.netToVendor, 1521936.50, 0.01, 'personal net to vendor');
ok(dP.cdaCredit === null, 'personal: no CDA line');

var dC = engine.computeDisposition(Object.assign({}, t2inputs, { ownership: 'corporation' }), params);
approx(dC.tax, 398851.50, 0.01, 'corporate tax @ 50.17%');
approx(dC.netToVendor, 1548648.50, 0.01, 'corporate net to vendor');
approx(dC.cdaCredit, 575000, 0.01, 'CDA credit = untaxed half of gain');

/* ---------------------------------------------------------------
   Tool 2 — edge cases
   --------------------------------------------------------------- */
console.log('Tool 2 edge cases');
// Zero CCA → zero recapture
var zeroCCA = engine.computeDisposition(Object.assign({}, t2inputs, { ccaClaimed: 0 }), params);
approx(zeroCCA.recapture, 0, 0, 'zero CCA → zero recapture');
// Sale below ACB → no capital gain (floored at 0), recapture limited by building proceeds − UCC
var loss = engine.computeDisposition(Object.assign({}, t2inputs, { salePrice: 1600000 }), params);
approx(loss.capitalGain, 0, 0, 'sale below ACB → gain floored at 0');
// building proceeds 1.28M − UCC 1.22M = 60k < CCA 220k → recapture capped
approx(loss.recapture, 60000, 0.01, 'depreciated-value sale caps recapture');
// Deep-loss sale: building proceeds below UCC → no recapture
var deepLoss = engine.computeDisposition(Object.assign({}, t2inputs, { salePrice: 1000000 }), params);
approx(deepLoss.recapture, 0, 0, 'building proceeds < UCC → no recapture');
// Inclusion rate guard: must be 50% — the 66.67% proposal was cancelled March 2025
ok(params.disposition.inclusionRate === 0.50, 'inclusion rate is 0.50');

/* ---------------------------------------------------------------
   Hold scenario
   --------------------------------------------------------------- */
console.log('Hold scenario');
var hold = engine.computeHoldScenario({
  propertyValue: 3000000, mortgageBalance: 900000,
  mortgageRate: 0.045, remainingAmortYears: 20,
  appreciation: 0.03, years: 5
}, params);
approx(hold.futureValue, 3000000 * Math.pow(1.03, 5), 0.01, 'future value @3%/5yr');
approx(hold.futureBalance, 743725.75, 0.01, 'future mortgage balance');
approx(hold.futureEquity, hold.futureValue - 743725.75, 0.01, 'future equity');

/* --------------------------------------------------------------- */
console.log('');
if (failures > 0) {
  console.error(failures + ' FAILED, ' + passes + ' passed');
  process.exit(1);
}
console.log('All ' + passes + ' assertions passed.');
