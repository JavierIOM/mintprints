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
// Three layers below. Be honest about what each one is worth:
//   1. Origin allowlist  - stops drive-by and embedding on someone else's site.
//                          Bypassable with a forged header, so it is the cheap
//                          filter, not the defence.
//   2. Per-IP limit      - stops one source hammering it.
//   3. Instance ceiling  - circuit breaker if something gets through 1 and 2.
// Layers 2 and 3 are in-memory, so they are PER WARM INSTANCE. A distributed
// attack across many cold starts defeats them. The only true cap on spend is a
// spend limit set on the Anthropic account itself. Set one.

const ALLOWED_ORIGINS = new Set([
  'https://mintprints.im',
  'https://www.mintprints.im',
  'http://localhost:4321',   // astro dev
  'http://localhost:8888',   // netlify dev
]);

const PER_IP_MAX    = 8;           // requests per window, per IP
const PER_IP_WINDOW = 60 * 1000;   // 1 minute
const IP_HOURLY_MAX = 40;          // requests per hour, per IP
const HOUR          = 60 * 60 * 1000;
const INSTANCE_MAX  = 300;         // requests per hour for this whole instance

const hits = new Map();            // ip -> number[] (timestamps)
let instanceHits = [];

function prune(list, now, window) {
  return list.filter(t => now - t < window);
}

function clientIp(event) {
  return event.headers['x-nf-client-connection-ip']
      || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || 'unknown';
}

// Returns null when allowed, or a { statusCode, retryAfter } refusal.
function checkLimits(event) {
  const now = Date.now();

  instanceHits = prune(instanceHits, now, HOUR);
  if (instanceHits.length >= INSTANCE_MAX) {
    return { statusCode: 429, retryAfter: 600 };
  }

  const ip = clientIp(event);
  const recent = prune(hits.get(ip) || [], now, HOUR);

  if (recent.length >= IP_HOURLY_MAX) return { statusCode: 429, retryAfter: 900 };
  if (prune(recent, now, PER_IP_WINDOW).length >= PER_IP_MAX) {
    return { statusCode: 429, retryAfter: 60 };
  }

  recent.push(now);
  hits.set(ip, recent);
  instanceHits.push(now);

  // Keep the Map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (prune(v, now, HOUR).length === 0) hits.delete(k);
    }
  }

  return null;
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
  const limited = checkLimits(event);
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
