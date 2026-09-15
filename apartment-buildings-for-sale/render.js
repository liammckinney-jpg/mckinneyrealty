/* =========================================================================
   Shared card renderer for /apartment-buildings-for-sale/ (spec §6 "Card").
   Runs in Node (build-time bake, scripts/listings/build-listings.js) and in
   the browser (filter/sort re-render). The build copies this file to
   /apartment-buildings-for-sale/render.js — edit only the scripts/ copy.

   Card strings are §6 verbatim:
     Line 1: {street}, {city}
     Line 2: {units} units · ${listPrice} · ${pricePerUnit} per unit
     Line 3 (only when noi present): Reported cap rate {x.x}%
     Line 4: Listed by {listOfficeName}   (full name, never abbreviated)
     Badge (listed ≤ 7 days): New
   Attribution is body-size and untruncated (spec §7.1).
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

  function fmtCap(cap) {
    return (cap * 100).toFixed(1) + '%';
  }

  // l is a card projection from data.json:
  // { slug, market, street, city, units, listPrice, ppu, cap, office, dom, modified, thumb, thumbAlt }
  function detailPath(l) {
    return '/apartment-buildings-for-sale/' + l.market + '/' + l.slug + '/';
  }

  function renderCard(l) {
    // Card is a <div> with a stretched cover link; the own-listing tag is
    // its own <a> above the cover (nested anchors are invalid HTML).
    var badge = (typeof l.dom === 'number' && l.dom <= 7)
      ? '<span class="lst-badge">New</span>' : '';
    var tag = l.own
      ? '<a class="lst-tag" href="' + esc(l.own) + '">Full package available</a>' : '';
    var flags = (badge || tag) ? '<div class="lst-flags">' + badge + tag + '</div>' : '';
    var media = l.thumb
      ? '<div class="lst-card-media"><img src="' + esc(l.thumb) + '" alt="' + esc(l.thumbAlt || '') + '" loading="lazy" width="1200" height="800">' + flags + '</div>'
      : (flags ? '<div class="lst-card-media lst-card-media--empty">' + flags + '</div>' : '');
    var line3 = (l.cap != null)
      ? '<div class="lst-card-l3">Reported cap rate ' + fmtCap(l.cap) + '</div>' : '';
    return '<div class="lst-card">' +
      '<a class="lst-card-cover" href="' + esc(detailPath(l)) + '" aria-label="' + esc(l.street) + ', ' + esc(l.city) + '"></a>' +
      media +
      '<div class="lst-card-body">' +
        '<div class="lst-card-l1">' + esc(l.street) + ', ' + esc(l.city) + '</div>' +
        '<div class="lst-card-l2">' + l.units + ' units · ' + fmtMoney(l.listPrice) + ' · ' + fmtMoney(l.ppu) + ' per unit</div>' +
        line3 +
        '<div class="lst-card-l4">Listed by ' + esc(l.office) + '</div>' +
      '</div>' +
    '</div>';
  }

  return { esc: esc, fmtMoney: fmtMoney, fmtCap: fmtCap, detailPath: detailPath, renderCard: renderCard };
}));
