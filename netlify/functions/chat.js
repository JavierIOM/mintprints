const SYSTEM_PROMPT = `You are Tilly, the virtual assistant for Mint Prints, a 3D printing, laser cutting, and custom design business based on the Isle of Man.

Answer questions about Mint Prints' services, equipment, materials, pricing, and ordering. Be friendly and concise: 2 to 3 sentences is usually enough. Sound like a knowledgeable human, not a corporate bot.

RULES:
- Never invent prices. Always say pricing depends on the project and point to the contact form.
- For quotes or orders, direct people to the contact form: <a href="/contact/" class="tilly-link">contact form</a>
- To speak to a human: <a href="mailto:info@mintprints.im" class="tilly-link">info@mintprints.im</a>
- Use HTML links where helpful. Internal: class="tilly-link", external: target="_blank" rel="noopener noreferrer" class="tilly-link"
- Plain text only: no markdown, no bullet points, no headers
- Never use em-dashes in replies. Use commas, colons, or separate sentences instead.
- If you don't know, say so and point to the contact form rather than guessing

SERVICES:
FDM (plastic) 3D printing: Bambu Lab X1C printers, 256×256×256mm build volume, up to 16 colours via AMS, tolerances ±0.1-0.2mm. Materials: PLA (visual/decorative), PETG (functional/impact-resistant), ASA (UV-stable, outdoor use, up to 95°C), TPU (flexible/rubber-like).
SLA (resin) 3D printing: Elegoo 5K printers, 0.05mm layers, ideal for miniatures, wargaming figures, jewellery detail. Resins: standard, tough/ABS-like, flexible, clear/translucent.
Laser cutting & etching: Omtech 80W CO2 (100W peak), 700×500mm bed. Files: SVG, DXF.
Custom design: bespoke artwork from concept to production.

LASER MATERIALS:
Can cut and etch: wood, MDF, plywood, acrylic/perspex, vegetable-tanned leather, cork, rubber, felt, fabric, foam, cardboard.
Can etch only (not cut): glass, mirrored surfaces, slate, stone, granite, ceramic, anodised aluminium, coated metals.
Cannot process: PVC/vinyl (releases toxic gas), polycarbonate, chrome-tanned leather, bare metal.

PRACTICAL INFO:
- All jobs quoted individually: send project details via the contact form, reply within 1-2 business days.
- Payment: bank transfer or PayPal.
- Delivery: Isle of Man, UK, international (no USA due to post office restrictions).
- Turnaround: small items hours to days; complex prints may take several days.
- File formats: STL, OBJ, 3MF, STEP/STP for 3D printing; SVG, DXF for laser work.
- Minimum print size: ~5mm. Minimum FDM wall: ~1.2mm. SLA can do ~0.5mm.
- Can split oversized designs into interlocking parts. Can print multiple copies.
- Post-processing available: sanding, priming, painting, lacquering, hollow/low infill.

ONLINE SHOPS:
Etsy (ready-made items): <a href="https://www.etsy.com/uk/shop/MintPrintsIOM" target="_blank" rel="noopener noreferrer" class="tilly-link">MintPrintsIOM on Etsy</a>
Redbubble (Isle of Man apparel): <a href="https://www.redbubble.com/people/manxcraft/shop" target="_blank" rel="noopener noreferrer" class="tilly-link">manxcraft on Redbubble</a>
Instagram: <a href="https://www.instagram.com/mintprintsiom/" target="_blank" rel="noopener noreferrer" class="tilly-link">@mintprintsiom</a>
Facebook: <a href="https://www.facebook.com/mintprintsiom" target="_blank" rel="noopener noreferrer" class="tilly-link">Mint Prints IOM</a>`;

// ── Abuse controls ────────────────────────────────────────────────────────────
// This endpoint spends real money on every call, so it is not left open.
// Before 17 Sep 2026 it took an unauthenticated POST from anywhere, forwarded it
// to Claude and returned the answer: no origin check, no rate limit, nothing.
// The only reason it was never abused is that the Anthropic account happened to
// be out of credit.
//
// State lives in Netlify Blobs, NOT in memory. Wiki `netlify-gotchas.md`:
// "In-memory caches inside a function only survive a single invocation. They
// reset on cold start. Do not build logic that assumes persistence." A counter
// in a module-level Map is therefore worth nothing here: every invocation would
// start from empty and every request would pass. The first cut of this fix made
// exactly that mistake.
//
// Blobs is documented as unreliable inside SCHEDULED functions. This one is
// on-demand, which is the case that works, and it follows the same getStore
// pattern as rapt's cold-crash.js.
//
// Layers:
//   1. Origin allowlist  - stops drive-by and embedding on someone else's site.
//                          Forgeable, so it is the cheap filter, not the defence.
//   2. Per-IP limit      - 8/min and 40/hour, persisted.
//   3. Global breaker    - 300/hour across the whole site, persisted.
// If Blobs itself is unavailable the request is refused rather than waved
// through: this endpoint costs money, so it fails closed. The true ceiling on
// spend is still a spend limit set on the Anthropic account. Set one.

const ALLOWED_ORIGINS = new Set([
  'https://mintprints.im',
  'https://www.mintprints.im',
  'http://localhost:4321',   // astro dev
  'http://localhost:8888',   // netlify dev
]);

const STORE_NAME    = 'chat-ratelimit';
const PER_IP_MAX    = 8;           // per minute, per IP
const PER_IP_WINDOW = 60 * 1000;
const IP_HOURLY_MAX = 40;          // per hour, per IP
const HOUR          = 60 * 60 * 1000;
const GLOBAL_MAX    = 300;         // per hour, whole site

function clientIp(event) {
  return event.headers['x-nf-client-connection-ip']
      || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || 'unknown';
}

function prune(list, now, window) {
  return list.filter(t => now - t < window);
}

async function readHits(store, key) {
  try {
    const raw = await store.get(key, { type: 'json' });
    return Array.isArray(raw?.hits) ? raw.hits : [];
  } catch {
    return [];   // a missing key is the normal case on a first request
  }
}

// null when allowed, otherwise { statusCode, retryAfter }.
// Split from checkLimits so the counting can be tested against a fake store
// without a Netlify context. Nothing else should call this directly.
export async function _checkLimitsWith(store, event, now = Date.now()) {
  const ip  = clientIp(event);
  const ipKey = `ip-${ip.replace(/[^a-zA-Z0-9.:_-]/g, '_')}`;

  const globalHits = prune(await readHits(store, 'global'), now, HOUR);
  if (globalHits.length >= GLOBAL_MAX) return { statusCode: 429, retryAfter: 600 };

  const ipHits = prune(await readHits(store, ipKey), now, HOUR);
  if (ipHits.length >= IP_HOURLY_MAX) return { statusCode: 429, retryAfter: 900 };
  if (prune(ipHits, now, PER_IP_WINDOW).length >= PER_IP_MAX) {
    return { statusCode: 429, retryAfter: 60 };
  }

  ipHits.push(now);
  globalHits.push(now);
  try {
    await store.setJSON(ipKey, { hits: ipHits });
    await store.setJSON('global', { hits: globalHits });
  } catch {
    // Could not record the hit. Refuse rather than serve an uncounted request.
    return { statusCode: 503, retryAfter: 60 };
  }

  return null;
}

async function checkLimits(event) {
  let store;
  try {
    const { getStore } = await import('@netlify/blobs');
    store = getStore(STORE_NAME);
  } catch {
    // Fail closed. An open money-spending endpoint is worse than a brief outage.
    return { statusCode: 503, retryAfter: 60 };
  }
  return _checkLimitsWith(store, event);
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // Layer 1: only serve the site's own front end.
  const origin = event.headers.origin || event.headers.Origin || '';
  if (!ALLOWED_ORIGINS.has(origin)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  // Layers 2 and 3.
  const limited = await checkLimits(event);
  if (limited) {
    return {
      statusCode: limited.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(limited.retryAfter),
      },
      body: JSON.stringify({ error: 'Too many requests, please slow down.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const message = (body.message || '').trim().slice(0, 500);
  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No message provided' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Not configured' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    const answer = data.content[0].text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to get response' }),
    };
  }
};
