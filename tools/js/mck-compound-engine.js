/* =========================================================================
   McKinney Realty — Compounding Modeler Engine
   Pure functions: inputs → outputs. No DOM, loadable in Node and browser.

   Deliberately independent of mck-params.js (spec §4) — this tool
   illustrates a mechanism, not CMHC program terms.

   Conventions (locked against Builder's Guide Ch. 1, Aug 13 2026):
   - Amortization: simple monthly compounding, r = i/12. This reproduces
     the Guide's year-1 cash flow (~$13.5K at defaults) exactly; the
     mortgage suite's Canadian semi-annual convention does not.
   - Income during year t is the START-of-year NOI level; growth applies
     at year end. Value at end of year t capitalizes the grown level:
     V_t = NOI0·(1+g)^t / capRate_t. At defaults this makes year-1
     appreciation exactly P·g ($75K).
   - Accumulated cash flow is held uninvested at 0% (conservative).
   - Cap rate drifts linearly from capRate to capRate + drift over the
     horizon: capRate_t = capRate + drift·(t/T).

   Refinance & Repeat (spec §6): at each interval year-end, the portfolio
   re-levers to LTV of current value; cash-out (new loan − balance −
   friction) plus accumulated cash flow buys additional fractional
   buildings at the same assumptions and current pricing; one fresh
   amortization schedule runs on the aggregate. Net worth at the event
   drops by exactly the friction amount — nothing else is created or
   destroyed at the event.
   ========================================================================= */

(function (root) {
  'use strict';

  function monthlyPaymentSimple(principal, annualRate, years) {
    if (principal <= 0) return 0;
    var r = annualRate / 12;
    var n = years * 12;
    if (r === 0) return principal / n;
    return principal * r / (1 - Math.pow(1 + r, -n));
  }

  /* ---------------------------------------------------------------
     simulate(inputs) — inputs:
       initialEquity, interestRate, capRate, horizonYears,
       ltv, amortYears, noiGrowth, capRateDriftBps,
       refiEnabled, refiIntervalYears, refiFrictionRate (default 0.02)
     --------------------------------------------------------------- */
  function simulate(inputs) {
    var E0 = inputs.initialEquity;
    var i = inputs.interestRate;
    var cap = inputs.capRate;
    var T = inputs.horizonYears;
    var ltv = inputs.ltv;
    var am = inputs.amortYears;
    var g = inputs.noiGrowth;
    var drift = (inputs.capRateDriftBps || 0) / 10000;
    var refiOn = !!inputs.refiEnabled;
    var refiEvery = inputs.refiIntervalYears || 7;
    var friction = inputs.refiFrictionRate === undefined ? 0.02 : inputs.refiFrictionRate;

    var P0 = ltv < 1 ? E0 / (1 - ltv) : E0;      // purchase price
    var L0 = P0 * ltv;
    var noi0 = P0 * cap;

    var r = i / 12;
    var pmt = monthlyPaymentSimple(L0, i, am);

    // Portfolio state
    var bal = L0;
    var noiLevel = noi0;          // current annual income level (start-of-year)
    var cumCF = 0;
    var paydownCum = 0;
    var count = 1;                // building-equivalents
    var singleNoiLevel = noi0;    // one-building income path (for count math)

    var ds0 = pmt * 12;
    var years = [{
      t: 0, value: P0, balance: bal, equity: E0, cumCashFlow: 0,
      paydownCum: 0, appreciation: 0, cashFlow: 0, refiEvent: false
    }];

    var totalValue = P0;

    for (var t = 1; t <= T; t++) {
      var capT = cap + drift * (t / T);
      var noiYear = noiLevel;                 // income collected during year t

      var interestYr = 0, principalYr = 0;
      for (var m = 0; m < 12; m++) {
        var im = bal * r;
        var pr = Math.min(pmt - im, bal);
        interestYr += im;
        principalYr += pr;
        bal -= pr;
      }
      paydownCum += principalYr;

      var ds = interestYr + principalYr === 0 ? 0 : pmt * 12;
      // A fully-paid loan stops requiring payments
      if (bal <= 0 && principalYr + interestYr < pmt * 12) ds = interestYr + principalYr;

      var cashFlow = noiYear - ds;
      cumCF += cashFlow;

      // growth applies at year end; value capitalizes the grown level
      noiLevel = noiLevel * (1 + g);
      singleNoiLevel = singleNoiLevel * (1 + g);
      totalValue = capT > 0 ? noiLevel / capT : 0;

      var refiEvent = false, cashOut = 0;
      if (refiOn && t % refiEvery === 0 && t < T) {
        var newLoan = ltv * totalValue;
        var fee = friction * newLoan;
        cashOut = newLoan - bal - fee;
        if (cashOut > 0) {
          refiEvent = true;
          var redeploy = cashOut + cumCF;
          var singleValue = capT > 0 ? singleNoiLevel / capT : 0;
          if (redeploy > 0 && ltv < 1) {
            var addP = redeploy / (1 - ltv);
            totalValue += addP;
            noiLevel += addP * capT;
            if (singleValue > 0) count += addP / singleValue;
          }
          bal = ltv * totalValue;
          cumCF = 0;
          pmt = monthlyPaymentSimple(bal, i, am);
        }
      }

      var equity = totalValue - bal + cumCF;
      years.push({
        t: t,
        noi: noiYear,
        debtService: ds,
        interest: interestYr,
        principal: principalYr,
        cashFlow: cashFlow,
        cumCashFlow: cumCF,
        balance: bal,
        value: totalValue,
        capRateT: capT,
        equity: equity,
        paydownCum: paydownCum,
        // residual band for the chart; absorbs refi redeployment effects
        appreciation: equity - E0 - paydownCum - cumCF,
        refiEvent: refiEvent,
        cashOut: refiEvent ? cashOut : 0
      });
    }

    var ending = years[T].equity;
    var spreadBps = Math.round((cap - i) * 10000);

    return {
      years: years,
      purchasePrice: P0,
      loan0: L0,
      noi0: noi0,
      annualDebtService0: ds0,
      dscrYear1: ds0 > 0 ? noi0 / ds0 : null,
      endingEquity: ending,
      equityMultiple: E0 > 0 ? ending / E0 : null,
      cagr: E0 > 0 && ending > 0 ? Math.pow(ending / E0, 1 / T) - 1 : null,
      spreadBps: spreadBps,
      negativeLeverage: spreadBps < 0,
      portfolioValue: years[T].value,
      buildingCount: count
    };
  }

  // Default conventions shared by the Modeler UI and Lesson Zero's widget.
  // capRate: 6.0% — mid-range of Ontario secondary-market multi-family caps
  // (~5.5–7.5%) per Liam, Aug 20 2026; re-verify per staleness rule before
  // any render that cites it as market fact.
  // Invariant (tested): capRate must exceed lessonZeroPresetInterestRate —
  // the preset must never ship as an underwater illustration.
  var DEFAULTS = {
    capRate: 0.06,
    lessonZeroPresetInterestRate: 0.04
  };

  var MCK_COMPOUND = {
    monthlyPaymentSimple: monthlyPaymentSimple,
    simulate: simulate,
    DEFAULTS: DEFAULTS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCK_COMPOUND;
  } else {
    root.MCK_COMPOUND = MCK_COMPOUND;
  }
})(typeof self !== 'undefined' ? self : this);
