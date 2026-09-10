/* =========================================================================
   McKinney Multifamily Group — Organization structured data (shared include)
   Injects the site-wide RealEstateAgent JSON-LD block into <head>.
   Canonical entity facts only (KB source of truth, Aug 17 2026) —
   these must stay identical to the FAQ, llms.txt, and meta descriptions.
   sameAs profiles intentionally omitted until official URLs are supplied.
   ========================================================================= */

(function () {
  'use strict';
  var data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "McKinney Multifamily Group",
    "description": "Father-and-son multifamily and investment real estate team serving all of Ontario, focused on apartment buildings and investment properties in the $2M–$10M range.",
    "url": "https://www.mckinneyrealty.ca",
    "email": "liam@mckinneyrealty.ca",
    "telephone": "+1-613-969-9907",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "106 North Front St",
      "addressLocality": "Belleville",
      "addressRegion": "ON",
      "postalCode": "K8P 3B4",
      "addressCountry": "CA"
    },
    "logo": "https://www.mckinneyrealty.ca/images/brand/M_navy_transparent.png",
    "image": "https://www.mckinneyrealty.ca/images/og/home.png",
    "areaServed": { "@type": "State", "name": "Ontario" },
    "knowsAbout": [
      "multifamily real estate",
      "apartment building sales",
      "CMHC MLI Select financing",
      "investment property disposition",
      "Ontario secondary markets"
    ],
    "member": [
      {
        "@type": "Person",
        "name": "Liam McKinney",
        "jobTitle": "Broker · Managing Partner",
        "email": "liam@mckinneyrealty.ca"
      },
      {
        "@type": "Person",
        "name": "Sean McKinney",
        "jobTitle": "Broker of Record, RE/MAX Quinte Ltd., Brokerage",
        "email": "sean@remaxquinte.com"
      }
    ]
  };
  var s = document.createElement('script');
  s.type = 'application/ld+json';
  s.text = JSON.stringify(data);
  document.head.appendChild(s);
})();
