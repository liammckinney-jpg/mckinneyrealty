/* =========================================================================
   Market map (spec §5) — slug, display name, member cities, display order.
   Every listing gets exactly one market. Unmapped cities fall into the
   nearest region bucket and are logged for mapping (PropTx adapter,
   Phase 1b, uses CITY_TO_MARKET; fixtures already carry market slugs).
   ========================================================================= */
'use strict';

const MARKETS = [
  { slug: 'toronto',                   name: 'Toronto',               cities: ['Toronto', 'North York', 'Scarborough', 'Etobicoke', 'East York', 'York'] },
  { slug: 'durham',                    name: 'Durham',                cities: ['Oshawa', 'Whitby', 'Ajax', 'Pickering', 'Clarington', 'Bowmanville'] },
  { slug: 'hamilton-niagara',          name: 'Hamilton–Niagara',      cities: ['Hamilton', 'St. Catharines', 'Niagara Falls', 'Welland', 'Grimsby', 'Fort Erie'] },
  { slug: 'kitchener-waterloo-guelph', name: 'Kitchener–Waterloo–Guelph', cities: ['Kitchener', 'Waterloo', 'Guelph', 'Cambridge'] },
  { slug: 'london',                    name: 'London',                cities: ['London', 'St. Thomas', 'Strathroy'] },
  { slug: 'windsor-essex',             name: 'Windsor–Essex',         cities: ['Windsor', 'Leamington', 'Tecumseh', 'LaSalle'] },
  { slug: 'barrie-simcoe',             name: 'Barrie–Simcoe',         cities: ['Barrie', 'Orillia', 'Midland', 'Collingwood', 'Innisfil'] },
  { slug: 'peterborough-kawartha',     name: 'Peterborough–Kawartha', cities: ['Peterborough', 'Kawartha Lakes', 'Lindsay'] },
  { slug: 'northumberland',            name: 'Northumberland',        cities: ['Cobourg', 'Port Hope', 'Brighton'] },
  { slug: 'quinte',                    name: 'Quinte',                cities: ['Belleville', 'Quinte West', 'Trenton'] },
  { slug: 'prince-edward-county',      name: 'Prince Edward County',  cities: ['Picton', 'Prince Edward County', 'Wellington'] },
  { slug: 'kingston',                  name: 'Kingston',              cities: ['Kingston', 'Napanee', 'Greater Napanee'] },
  { slug: 'brockville-leeds',          name: 'Brockville–Leeds',      cities: ['Brockville', 'Gananoque', 'Prescott'] },
  { slug: 'cornwall',                  name: 'Cornwall',              cities: ['Cornwall'] },
  { slug: 'ottawa',                    name: 'Ottawa',                cities: ['Ottawa', 'Nepean', 'Gloucester', 'Kanata', 'Orleans', 'Vanier'] },
  { slug: 'northern-ontario',          name: 'Northern Ontario',      cities: ['Sudbury', 'Greater Sudbury', 'North Bay', 'Sault Ste. Marie', 'Thunder Bay', 'Timmins'] },
];

const BY_SLUG = {};
const CITY_TO_MARKET = {};
MARKETS.forEach(function (m) {
  BY_SLUG[m.slug] = m;
  m.cities.forEach(function (c) { CITY_TO_MARKET[c.toLowerCase()] = m.slug; });
});

function marketName(slug) {
  return BY_SLUG[slug] ? BY_SLUG[slug].name : null;
}

// city → market slug; null means unmapped (caller logs it for mapping)
function mapCity(city) {
  return CITY_TO_MARKET[String(city || '').toLowerCase()] || null;
}

function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Detail route: /apartment-buildings-for-sale/[market]/[listing-slug]-[mlsId]/
function listingSlug(listing) {
  return slugify(listing.address.street + '-' + listing.address.city) + '-' + slugify(listing.mlsId);
}

module.exports = { MARKETS, BY_SLUG, marketName, mapCity, slugify, listingSlug };
