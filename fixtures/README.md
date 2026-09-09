# Fixtures — SYNTHETIC DATA, STAGING ONLY

`listings.json` contains **40 entirely fictional apartment-building listings** used to
build and stage the `/apartment-buildings-for-sale/` front end before PropTx RESO
credentials arrive (Listings Front End spec, §9).

- Every address, brokerage name, price, income figure, MLS® number and photo is
  invented. Addresses use street names like "Sample Street"; brokerages are
  "Example Realty Inc., Brokerage" and similar; MLS® ids are prefixed `FX`.
- Every record carries `source: "fixture"` and `status: "Active"`.
- Photos are keyword-matched placeholder images (apartment buildings and
  interiors) served by loremflickr.com from Creative-Commons Flickr photos,
  locked per URL for deterministic builds. They are not photos of the
  fictional addresses and are not our property photography.

**This data must never be deployed to production.** The provider is selected by
`LISTINGS_PROVIDER=fixture|proptx`; the build fails if a production build runs with
`fixture` set (enforced in `scripts/listings/provider.js`).

Shape matches the normalized `Listing` schema in spec §4. When the PropTx adapter
lands (Phase 1b), it fills the same shape; the UI does not change.
