/* =========================================================================
   /api/lead — server-side relay for form submissions (fix spec 0.3, R-02)

   The browser posts JSON here; this function forwards it to the Google
   Apps Script web app and returns the REAL outcome ({ok:true} / {ok:false,
   error}) so the client can show a confirmation only when the submission
   actually landed. The Apps Script endpoint lives only in the Vercel env
   var LEAD_WEBAPP_URL — never in client code.
   ========================================================================= */
'use strict';

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const target = process.env.LEAD_WEBAPP_URL;
  if (!target) {
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }
  let body = req.body;
  if (typeof body !== 'string') body = JSON.stringify(body || {});

  const ctrl = new AbortController();
  const timer = setTimeout(function () { ctrl.abort(); }, 10000);
  try {
    // Apps Script answers a POST with a 302 to a one-time URL; follow it.
    const upstream = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body,
      redirect: 'follow',
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_' + upstream.status });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    clearTimeout(timer);
    return res.status(502).json({ ok: false, error: e && e.name === 'AbortError' ? 'timeout' : 'upstream_unreachable' });
  }
};
