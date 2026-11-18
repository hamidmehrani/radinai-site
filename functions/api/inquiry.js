const ALLOWED_ORIGINS = [
  'https://radinai.ir',
  'https://www.radinai.ir',
  'http://localhost:8788',
  'http://127.0.0.1:8788',
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const u = new URL(origin);
    return u.hostname.endsWith('.pages.dev') || u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();
  const origin = request.headers.get('Origin') || '';

  if (method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  }

  if (!isAllowedOrigin(origin)) {
    return jsonResponse({ ok: false, error: 'forbidden_origin' }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  if (payload.website_url || payload.hp) {
    return jsonResponse({ ok: false, error: 'spam_rejected' }, 400);
  }

  if (typeof payload.elapsedMs === 'number' && payload.elapsedMs < 700) {
    return jsonResponse({ ok: false, error: 'submitted_too_fast' }, 429);
  }

  const name = String(payload.name || '').trim().slice(0, 120);
  const contact = String(payload.contact || '').trim().slice(0, 160);
  const company = String(payload.company || '').trim().slice(0, 160);
  const serviceType = String(payload.serviceType || '').trim().slice(0, 160);
  const notes = String(payload.notes || '').trim().slice(0, 2000);

  if (!name || !contact) {
    return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400);
  }

  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  const reference = `RDN-${stamp}-${rand}`;

  const summaryLines = [
    `کد پیگیری: ${reference}`,
    `نام: ${name}`,
    company ? `مجموعه: ${company}` : null,
    `راه ارتباطی: ${contact}`,
    serviceType ? `موضوع: ${serviceType}` : null,
    notes ? `توضیحات: ${notes}` : null,
  ].filter(Boolean);

  const summaryText = summaryLines.join('\n');

  let telegramSent = false;
  if (env && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: `استعلام جدید رادین هوش\n\n${summaryText}`,
        }),
      });
      telegramSent = tgRes.ok;
    } catch {
      telegramSent = false;
    }
  }

  let emailSent = false;
  if (env && env.RESEND_API_KEY && env.ADMIN_EMAIL && env.LEAD_EMAIL_FROM) {
    try {
      const mailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.LEAD_EMAIL_FROM,
          to: [env.ADMIN_EMAIL],
          subject: `[RadinAI Inquiry] ${reference} — ${name}`,
          text: summaryText,
        }),
      });
      emailSent = mailRes.ok;
    } catch {
      emailSent = false;
    }
  }

  const waMessage = encodeURIComponent(`سلام وقت بخیر، استعلام سایت رادین هوش:\n${summaryText}`);

  return jsonResponse({
    ok: true,
    reference,
    telegramSent,
    emailSent,
    whatsappUrl: `https://wa.me/989150033963?text=${waMessage}`,
  });
}
