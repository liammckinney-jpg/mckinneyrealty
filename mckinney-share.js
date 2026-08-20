/* =========================================================================
   McKinney Realty — site-native share affordances (Phase 1)
   One placement per page: <section class="mck-share"> above the CTA band.
   Native share sheet where available; quiet intent-link row otherwise.
   No third-party scripts, no cookies — plain navigations + one GA4 event.
   ========================================================================= */
(function () {
  'use strict';

  var host = document.querySelector('.mck-share-row');
  if (!host) return;

  var section = host.closest('.mck-share');
  var contentType = (section && section.getAttribute('data-content-type')) || 'article';

  var canonicalEl = document.querySelector('link[rel="canonical"]');
  var canonical = (canonicalEl && canonicalEl.href) || (location.origin + location.pathname);
  canonical = canonical.replace(/\.html$/, '');
  var title = document.title;

  function track(method) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'share', {
        method: method,
        content_type: contentType,
        item_id: location.pathname
      });
    }
  }

  // UTM rides inside the shared URL; the copied link stays bare by design.
  function utm(medium) {
    return canonical + '?utm_source=share&utm_medium=' + medium;
  }

  var ICONS = {
    share: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 5.5a2 2 0 100-4 2 2 0 000 4zM4 10a2 2 0 100-4 2 2 0 000 4zM12 14.5a2 2 0 100-4 2 2 0 000 4zM5.8 7.1l4.4-2.2M5.8 8.9l4.4 2.2"/></svg>',
    copy:  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6.5 9.5a3 3 0 004.2 0l2.4-2.4a3 3 0 00-4.2-4.2l-1.2 1.2M9.5 6.5a3 3 0 00-4.2 0L2.9 8.9a3 3 0 004.2 4.2l1.2-1.2"/></svg>',
    email: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="3" width="13" height="10" rx="1"/><path d="M2 4l6 5 6-5"/></svg>',
    linkedin: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.6 5.9H1.5V14h2.1V5.9zM2.5 4.9a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zM14.5 9.6c0-2.4-1.3-3.9-3.2-3.9-1 0-1.7.5-2.1 1.2V5.9H7.1V14h2.1V9.9c0-1 .5-1.7 1.4-1.7.9 0 1.3.6 1.3 1.7V14h2.6V9.6z"/></svg>',
    facebook: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M9.2 14V8.6h1.8l.3-2.1H9.2V5.2c0-.6.2-1 1-1h1.1V2.3C11.1 2.3 10.4 2.2 9.6 2.2c-1.7 0-2.8 1-2.8 2.8v1.5H5v2.1h1.8V14h2.4z"/></svg>'
  };

  function makeButton(iconKey, text, method) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mck-share-btn';
    b.innerHTML = ICONS[iconKey] + '<span>' + text + '</span>';
    b.setAttribute('data-method', method);
    return b;
  }

  function makeLink(iconKey, text, href, method, newTab) {
    var a = document.createElement('a');
    a.className = 'mck-share-btn';
    a.href = href;
    if (newTab) { a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = ICONS[iconKey] + '<span>' + text + '</span>';
    a.addEventListener('click', function () { track(method); });
    return a;
  }

  // Mobile: the OS sheet genuinely offers the social targets (FB, IG,
  // LinkedIn, WhatsApp, Messages) — one button covers everything.
  // Desktop sheets (macOS) carry no social targets, so desktop always
  // gets the explicit row; the OS sheet is appended as a fifth option.
  var isMobile = (navigator.userAgentData && navigator.userAgentData.mobile) ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (window.matchMedia && matchMedia('(pointer: coarse)').matches);

  function nativeButton(text) {
    var b = makeButton('share', text, 'native');
    b.addEventListener('click', function () {
      navigator.share({ title: title, url: canonical })
        .then(function () { track('native'); })
        .catch(function () { /* sheet dismissed — nothing to record */ });
    });
    return b;
  }

  if (navigator.share && isMobile) {
    host.appendChild(nativeButton('Share'));
    return;
  }

  // Copy link — bare canonical, no UTM: copied links get texted and should look clean.
  var copyBtn = makeButton('copy', 'Copy link', 'copy');
  copyBtn.addEventListener('click', function () {
    function done() {
      track('copy');
      var span = copyBtn.querySelector('span');
      span.textContent = 'Copied';
      copyBtn.disabled = true;
      setTimeout(function () { span.textContent = 'Copy link'; copyBtn.disabled = false; }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(canonical).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = canonical;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });
  host.appendChild(copyBtn);

  host.appendChild(makeLink('email', 'Email',
    'mailto:?subject=' + encodeURIComponent(title) +
    '&body=' + encodeURIComponent(title + '\n' + utm('email')),
    'email', false));

  host.appendChild(makeLink('linkedin', 'LinkedIn',
    'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(utm('linkedin')),
    'linkedin', true));

  host.appendChild(makeLink('facebook', 'Facebook',
    'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(utm('facebook')),
    'facebook', true));

  if (navigator.share) host.appendChild(nativeButton('More\u2026'));
})();
