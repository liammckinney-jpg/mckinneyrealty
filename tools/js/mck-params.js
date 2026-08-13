/* =========================================================================
   McKinney Realty — Calculator Suite Parameters
   SINGLE SOURCE OF TRUTH for every CMHC program parameter, tax rate, and
   default used by the Financing Modeler and Disposition Calculator.

   Nothing program- or tax-related may be hardcoded in mck-calc-engine.js
   or any UI file. CMHC repriced premiums July 2025 (risk-based grid) and
   an MLI Select criteria refresh transitions through Sept 30, 2026 —
   these values WILL change; only this file should need editing.

   Every value marked // VERIFY must be checked against a current lender
   rate sheet / CMHC source before launch (spec §9).
   ========================================================================= */

(function (root) {
  'use strict';

  var MCK_PARAMS = {

    meta: {
      version: '1.0',
      parameterDate: '2026-08-12',   // date these values were researched
      currency: 'CAD'
    },

    /* ---------------------------------------------------------------
       TOOL 1 — FINANCING SCENARIOS
       One entry per comparison column. Keys are stable identifiers
       used by the engine and UI; labels are display-only.
       --------------------------------------------------------------- */
    scenarios: {
      mliSelect50: {
        label: 'MLI Select — 50 pts',
        cmhcInsured: true,
        maxLTV: 0.85,              // VERIFY
        maxAmortYears: 40,         // VERIFY
        minDSCR: 1.10,             // VERIFY
        premiumDiscount: 0.10      // VERIFY — 10% off base premium
      },
      mliSelect70: {
        label: 'MLI Select — 70 pts',
        cmhcInsured: true,
        maxLTV: 0.95,              // verified Aug 12 2026 — confirm with lender whether 95% is conditional on the affordability pathway
        maxAmortYears: 45,         // VERIFY
        minDSCR: 1.10,             // VERIFY
        premiumDiscount: 0.20      // VERIFY
      },
      mliSelect100: {
        label: 'MLI Select — 100 pts',
        cmhcInsured: true,
        maxLTV: 0.95,              // VERIFY
        maxAmortYears: 50,         // VERIFY
        minDSCR: 1.10,             // VERIFY
        premiumDiscount: 0.30      // VERIFY
      },
      mliStandard: {
        label: 'MLI Standard',
        cmhcInsured: true,
        maxLTV: 0.85,              // VERIFY
        maxAmortYears: 40,         // VERIFY
        minDSCR: 1.20,             // VERIFY — 1.20 conservative; some sources claim 1.10, confirm with lender
        premiumDiscount: 0
      },
      conventional: {
        label: 'Conventional',
        cmhcInsured: false,
        maxLTV: 0.75,              // VERIFY
        maxAmortYears: 25,         // VERIFY
        minDSCR: 1.25,             // VERIFY
        premiumDiscount: 0
      }
    },

    /* ---------------------------------------------------------------
       CMHC PREMIUM — July 2025 risk-based grid.
       Rate applied to the base loan amount, selected by LTV band
       (LTV = base loan ÷ purchase price, premium excluded).
       Bands are [maxLTV inclusive] → rate.
       --------------------------------------------------------------- */
    premium: {
      // Term, standard rental — July 14 2025 grid (verified Aug 12 2026).
      // rate: null = bucket unverified; the UI must render
      // "premium estimate unavailable at this leverage — contact us"
      // instead of a number, and suppress premium-dependent outputs.
      grid: [
        { maxLTV: 0.65, rate: 0.0250 },  // VERIFY — anchor ~2.50%, confirm
        { maxLTV: 0.70, rate: null },    // unverified mid bucket
        { maxLTV: 0.75, rate: null },    // unverified mid bucket
        { maxLTV: 0.80, rate: null },    // unverified mid bucket
        { maxLTV: 0.85, rate: 0.0535 },  // verified
        { maxLTV: 0.90, rate: 0.0615 },  // verified
        { maxLTV: 0.95, rate: 0.0615 }   // verified — >90% (Select-only leverage)
      ],
      // +0.25% premium surcharge per full 5-year amortization
      // extension beyond 25 years (July 2025 pricing).
      amortSurchargeBaseYears: 25,       // VERIFY
      amortSurchargePerStep: 0.0025,     // VERIFY
      amortSurchargeStepYears: 5         // VERIFY
    },

    /* ---------------------------------------------------------------
       TOOL 1 — INPUT DEFAULTS
       --------------------------------------------------------------- */
    financingDefaults: {
      vacancyRate: 0.03,                 // VERIFY — allowance applied to gross income
      opExRatioOfEGI: 0.40,              // default operating expense ratio of EGI
      rateInsured: 0.0415,               // VERIFY — indicative CMHC-insured rate
      rateConventional: 0.0525,          // VERIFY — indicative conventional rate
      defaultTier: 'mliSelect70',
      minUnitsForCMHC: 5,                // VERIFY — CMHC multi-unit programs require 5+ units
      closingCostAllowance: 0.015        // VERIFY — share of price added to equity for cash-on-cash
    },

    /* ---------------------------------------------------------------
       TOOL 2 — DISPOSITION / TAX
       --------------------------------------------------------------- */
    disposition: {
      inclusionRate: 0.50,               // VERIFY — 66.67% proposal CANCELLED March 2025; never model it
      marginalRateON: 0.5353,            // VERIFY — ON top combined marginal rate
      corpInvestmentRateON: 0.5017,      // VERIFY — ON aggregate corporate investment-income rate
      commissionRate: 0.04,              // VERIFY — default listing commission
      legalClosingDefault: 7500,         // VERIFY — default legal & closing cost estimate
      buildingPortionDefault: 0.80,      // default land/building split slider position
      // "If you held instead" panel defaults — assumptions, all user-editable
      holdRentGrowth: 0.025,             // VERIFY
      holdExpenseGrowth: 0.025,          // VERIFY
      holdAppreciation: 0.03,            // VERIFY
      holdYears: 5
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCK_PARAMS;           // Node (unit tests)
  } else {
    root.MCK_PARAMS = MCK_PARAMS;          // Browser
  }
})(typeof self !== 'undefined' ? self : this);
