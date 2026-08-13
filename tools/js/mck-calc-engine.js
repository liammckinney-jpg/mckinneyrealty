/* =========================================================================
   McKinney Realty — Calculator Engine
   Pure functions only: inputs → outputs. No DOM access, no globals
   mutated. Loadable in Node (unit tests) and the browser.

   All program parameters and tax rates come in via the params argument
   (see mck-params.js) — nothing program- or tax-related lives here.

   Payment math: Canadian mortgage convention — rates are quoted with
   semi-annual compounding and converted to an effective monthly rate.
   ========================================================================= */

(function (root) {
  'use strict';

  /* ---------------------------------------------------------------
     Shared money math
     --------------------------------------------------------------- */

  // Effective monthly rate from a semi-annually compounded annual rate.
  function monthlyRate(annualRate) {
    return Math.pow(1 + annualRate / 2, 1 / 6) - 1;
  }

  // Level monthly payment fully amortizing `principal` over `years`.
  function monthlyPayment(principal, annualRate, years) {
    if (principal <= 0) return 0;
    var r = monthlyRate(annualRate);
    var n = years * 12;
    if (r === 0) return principal / n;
    return principal * r / (1 - Math.pow(1 + r, -n));
  }

  // Present value of a level monthly payment stream (annuity), i.e. the
  // largest loan the payment supports at this rate/amortization.
  function loanFromPayment(payment, annualRate, years) {
    if (payment <= 0) return 0;
    var r = monthlyRate(annualRate);
    var n = years * 12;
    if (r === 0) return payment * n;
    return payment * (1 - Math.pow(1 + r, -n)) / r;
  }

  // Remaining principal after `monthsElapsed` of payments.
  function remainingBalance(principal, annualRate, years, monthsElapsed) {
    var r = monthlyRate(annualRate);
    var pmt = monthlyPayment(principal, annualRate, years);
    if (r === 0) return Math.max(0, principal - pmt * monthsElapsed);
    var grown = principal * Math.pow(1 + r, monthsElapsed);
    var paid = pmt * (Math.pow(1 + r, monthsElapsed) - 1) / r;
    return Math.max(0, grown - paid);
  }

  /* ---------------------------------------------------------------
     CMHC premium
     LTV band selected on base loan ÷ price (premium excluded).
     Surcharge: params.premium.amortSurchargePerStep per full
     amortSurchargeStepYears beyond amortSurchargeBaseYears.
     Tier discount applied to the combined rate.
     --------------------------------------------------------------- */
  // Returns null when the LTV falls in an unverified grid bucket
  // (rate: null in params) — callers must render "estimate unavailable"
  // and suppress premium-dependent outputs.
  // Tier discount applies to (base + surcharges), not base alone.
  function premiumRate(ltv, amortYears, tierDiscount, params) {
    var grid = params.premium.grid;
    var base;
    var found = false;
    for (var i = 0; i < grid.length; i++) {
      if (ltv <= grid[i].maxLTV + 1e-9) { base = grid[i].rate; found = true; break; }
    }
    if (!found) base = grid[grid.length - 1].rate;
    if (base === null) return null;

    var extraYears = Math.max(0, amortYears - params.premium.amortSurchargeBaseYears);
    var steps = Math.floor(extraYears / params.premium.amortSurchargeStepYears);
    var rate = base + steps * params.premium.amortSurchargePerStep;

    return rate * (1 - (tierDiscount || 0));
  }

  // DSCR sizing must respect the floor on premium-INCLUSIVE debt service:
  // the gross (capitalized) loan the NOI supports is fixed; the maximum
  // net loan is gross ÷ (1 + premiumRate), where premiumRate depends on
  // the net loan's own LTV bucket — iterate to the bucket fixpoint.
  // Returns { net, rate }; rate null when the bucket is unverified
  // (net falls back to the premium-exclusive gross).
  function netLoanFromGross(gross, price, amortYears, tierDiscount, params) {
    if (gross <= 0 || price <= 0) return { net: Math.max(0, gross), rate: 0 };
    var net = gross;
    var rate = null;
    for (var i = 0; i < 8; i++) {
      rate = premiumRate(net / price, amortYears, tierDiscount, params);
      if (rate === null) return { net: gross, rate: null };
      var next = gross / (1 + rate);
      if (Math.abs(next - net) < 0.005) return { net: next, rate: rate };
      net = next;
    }
    return { net: net, rate: rate };
  }

  /* ---------------------------------------------------------------
     TOOL 1 — Financing scenario
     inputs: { price, units, grossIncome, otherIncome, vacancyRate,
               opEx, rate }           (opEx = annual dollars, resolved by UI)
     scenario: one entry from params.scenarios
     --------------------------------------------------------------- */
  function computeScenario(inputs, scenario, params) {
    var noi = (inputs.grossIncome + inputs.otherIncome) * (1 - inputs.vacancyRate) - inputs.opEx;

    var eligible = inputs.units >= params.financingDefaults.minUnitsForCMHC || !scenario.cmhcInsured;

    var maxLoanLTV = inputs.price * scenario.maxLTV;
    var maxAnnualDS = noi / scenario.minDSCR;
    var grossMaxDSCR = loanFromPayment(Math.max(0, maxAnnualDS) / 12, inputs.rate, scenario.maxAmortYears);

    // For CMHC scenarios the DSCR cap applies to the premium-inclusive
    // loan, so the net (pre-premium) DSCR maximum is smaller than the
    // gross annuity value.
    var maxLoanDSCR = grossMaxDSCR;
    if (scenario.cmhcInsured) {
      maxLoanDSCR = netLoanFromGross(grossMaxDSCR, inputs.price,
        scenario.maxAmortYears, scenario.premiumDiscount, params).net;
    }

    var maxLoan = Math.min(maxLoanLTV, maxLoanDSCR);
    var bindingConstraint = maxLoanLTV <= maxLoanDSCR ? 'LTV' : 'DSCR';

    var downPayment = inputs.price - maxLoan;

    var ltv = inputs.price > 0 ? maxLoan / inputs.price : 0;
    var premRate = 0, premiumUnavailable = false;
    if (scenario.cmhcInsured && maxLoan > 0) {
      premRate = premiumRate(ltv, scenario.maxAmortYears, scenario.premiumDiscount, params);
      if (premRate === null) premiumUnavailable = true;
    }

    var premium = null, loanWithPremium = null, pmt = null, annualDS = null;
    var dscrActual = null, cashFlow = null, cashOnCash = null;
    var closingCosts = inputs.price * params.financingDefaults.closingCostAllowance;

    if (!premiumUnavailable) {
      premium = maxLoan * premRate;
      loanWithPremium = maxLoan + premium;   // premium capitalized into the loan
      pmt = monthlyPayment(loanWithPremium, inputs.rate, scenario.maxAmortYears);
      annualDS = pmt * 12;
      cashFlow = noi - annualDS;
      var equity = downPayment + closingCosts;
      dscrActual = annualDS > 0 ? noi / annualDS : null;
      cashOnCash = equity > 0 ? cashFlow / equity : null;
    }

    return {
      key: scenario.key || null,
      label: scenario.label,
      eligible: eligible,
      noi: noi,
      maxLoanLTV: maxLoanLTV,
      maxLoanDSCR: maxLoanDSCR,
      maxLoan: maxLoan,
      bindingConstraint: bindingConstraint,
      downPayment: downPayment,
      ltv: ltv,
      premiumRate: premiumUnavailable ? null : premRate,
      premiumUnavailable: premiumUnavailable,
      premium: premium,
      loanWithPremium: loanWithPremium,
      amortYears: scenario.maxAmortYears,
      monthlyPayment: pmt,
      annualDebtService: annualDS,
      dscrActual: dscrActual,
      cashFlow: cashFlow,
      closingCostAllowance: closingCosts,
      cashOnCash: cashOnCash
    };
  }

  // All scenarios for the comparison table. `tierKey` picks which MLI
  // Select tier appears; MLI Standard and Conventional always computed.
  function computeFinancingComparison(inputs, tierKey, params) {
    var keys = [tierKey, 'mliStandard', 'conventional'];
    return keys.map(function (k) {
      var scenario = Object.assign({ key: k }, params.scenarios[k]);
      var rate = scenario.cmhcInsured ? inputs.rateInsured : inputs.rateConventional;
      return computeScenario(
        Object.assign({}, inputs, { rate: rate }),
        scenario, params
      );
    });
  }

  /* ---------------------------------------------------------------
     TOOL 2 — Disposition proceeds
     inputs: { salePrice, commissionRate, legalClosing, mortgageBalance,
               penalty, purchasePrice, improvements, buildingPortion,
               ccaClaimed, ownership: 'personal'|'corporation',
               marginalRate }
     --------------------------------------------------------------- */
  function computeDisposition(inputs, params) {
    var p = params.disposition;

    var commission = inputs.salePrice * inputs.commissionRate;
    var grossProceeds = inputs.salePrice - commission - inputs.legalClosing;

    var acb = inputs.purchasePrice + inputs.improvements;   // acquisitionCosts default 0
    var capitalGain = Math.max(0, inputs.salePrice - acb);
    var taxableGain = capitalGain * p.inclusionRate;

    // Recapture — v1 simplification (see spec §4.2): CCA previously claimed
    // is recovered on sale, capped by building proceeds over UCC. For an
    // appreciating building this equals the full CCA claimed.
    var buildingCost = inputs.purchasePrice * inputs.buildingPortion;
    var ucc = buildingCost - inputs.ccaClaimed;
    var buildingProceeds = inputs.salePrice * inputs.buildingPortion;
    var recapture = Math.min(inputs.ccaClaimed, Math.max(0, buildingProceeds - ucc));

    var taxRate = inputs.ownership === 'corporation' ? p.corpInvestmentRateON : inputs.marginalRate;
    var tax = (taxableGain + recapture) * taxRate;
    var taxOnGain = taxableGain * taxRate;
    var taxOnRecapture = recapture * taxRate;

    var cdaCredit = inputs.ownership === 'corporation'
      ? capitalGain * (1 - p.inclusionRate)
      : null;

    var netToVendor = grossProceeds - inputs.mortgageBalance - inputs.penalty - tax;

    return {
      commission: commission,
      legalClosing: inputs.legalClosing,
      grossProceeds: grossProceeds,
      acb: acb,
      capitalGain: capitalGain,
      taxableGain: taxableGain,
      recapture: recapture,
      taxRate: taxRate,
      taxOnGain: taxOnGain,
      taxOnRecapture: taxOnRecapture,
      tax: tax,
      cdaCredit: cdaCredit,
      mortgageBalance: inputs.mortgageBalance,
      penalty: inputs.penalty,
      netToVendor: netToVendor
    };
  }

  /* ---------------------------------------------------------------
     TOOL 2 — "If you held instead" panel
     Factual side-by-side: estimated equity position in `years`
     vs. net proceeds today. No verdict — two numbers.
     inputs: { propertyValue, noi (current annual), mortgageBalance,
               mortgageRate, remainingAmortYears,
               rentGrowth, expenseGrowth, appreciation, years }
     NOI growth approximated by rent growth on income; expenses grow
     separately only when expense share is supplied via noiExpenses.
     v1: value appreciates, mortgage amortizes; equity = value − balance.
     --------------------------------------------------------------- */
  function computeHoldScenario(inputs, params) {
    var years = inputs.years || params.disposition.holdYears;
    var futureValue = inputs.propertyValue * Math.pow(1 + inputs.appreciation, years);
    var futureBalance = inputs.mortgageBalance > 0
      ? remainingBalance(inputs.mortgageBalance, inputs.mortgageRate, inputs.remainingAmortYears, years * 12)
      : 0;
    return {
      years: years,
      futureValue: futureValue,
      futureBalance: futureBalance,
      futureEquity: futureValue - futureBalance
    };
  }

  var MCK_ENGINE = {
    monthlyRate: monthlyRate,
    monthlyPayment: monthlyPayment,
    loanFromPayment: loanFromPayment,
    remainingBalance: remainingBalance,
    premiumRate: premiumRate,
    netLoanFromGross: netLoanFromGross,
    computeScenario: computeScenario,
    computeFinancingComparison: computeFinancingComparison,
    computeDisposition: computeDisposition,
    computeHoldScenario: computeHoldScenario
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCK_ENGINE;
  } else {
    root.MCK_ENGINE = MCK_ENGINE;
  }
})(typeof self !== 'undefined' ? self : this);
