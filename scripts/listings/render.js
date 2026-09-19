/* =========================================================================
   Shared card renderer for /apartment-buildings-for-sale/ (spec §6 "Card",
   as replaced by the Sept 18 2026 amendment).
   Runs in Node (build-time bake, scripts/listings/build-listings.js) and in
   the browser (filter/sort re-render). The build copies this file to
   /apartment-buildings-for-sale/render.js — edit only the scripts/ copy.

   Card strings are §6 verbatim:
     Line 1: {street}, {city}   — {city} alone when the listing withholds the
                                  address (Form 590 p.9). No substitute text.
     Line 2: {unitBandLabel} · ${listPrice}
     Line 3: Listed by {listOfficeName}   (full name, never abbreviated)
     Badge (listed ≤ 7 days): New

   No computed metric appears here. There is no unit count and no price per
   unit — see provider.js and CLAUDE.md. Attribution is body-size and
   untruncated (spec §7.1, IDX Data Agreement 6.3(c)).
   ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.MCK_LISTINGS_RENDER = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fmtMoney(n) {
    return '$' + Math.round(n).toLocaleString('en-CA');
  }

  // Line 1 / detail H1. Street is null when the listing withholds the
  // address; the city stands alone rather than gaining placeholder text.
  function addressLine(l) {
    return l.street ? l.street + ', ' + l.city : l.city;
  }

  // l is a card projection from data.json:
  // { slug, market, street|null, city, band, listPrice, office, dom, modified, thumb, thumbAlt, own }
  function detailPath(l) {
    return '/apartment-buildings-for-sale/' + l.market + '/' + l.slug + '/';
  }

  function renderCard(l) {
    // Card is a <div> with a stretched cover link; the own-listing tag is
    // its own <a> above the cover (nested anchors are invalid HTML).
    var addr = addressLine(l);
    var badge = (typeof l.dom === 'number' && l.dom <= 7)
      ? '<span class="lst-badge">New</span>' : '';
    var tag = l.own
      ? '<a class="lst-tag" href="' + esc(l.own) + '">Full package available</a>' : '';
    var flags = (badge || tag) ? '<div class="lst-flags">' + badge + tag + '</div>' : '';
    var media = l.thumb
      ? '<div class="lst-card-media"><img src="' + esc(l.thumb) + '" alt="' + esc(l.thumbAlt || '') + '" loading="lazy" width="1200" height="800">' + flags + '</div>'
      : (flags ? '<div class="lst-card-media lst-card-media--empty">' + flags + '</div>' : '');
    return '<div class="lst-card">' +
      '<a class="lst-card-cover" href="' + esc(detailPath(l)) + '" aria-label="' + esc(addr) + '"></a>' +
      media +
      '<div class="lst-card-body">' +
        '<div class="lst-card-l1">' + esc(addr) + '</div>' +
        '<div class="lst-card-l2">' + esc(l.band) + ' · ' + fmtMoney(l.listPrice) + '</div>' +
        '<div class="lst-card-l3">Listed by ' + esc(l.office) + '</div>' +
      '</div>' +
    '</div>';
  }

  return {
    esc: esc, fmtMoney: fmtMoney, addressLine: addressLine,
    detailPath: detailPath, renderCard: renderCard,
  };
}));
