import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { EmailMessage } from 'cloudflare:email';

type Bindings = {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  SEND_EMAIL: any;
  ASSETS: any; // Add ASSETS binding for static fallback
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  ADMIN_WHATSAPP_NUMBER?: string;
  FACEBOOK_PAGE_ACCESS_TOKEN?: string;
  ADMIN_MESSENGER_PSID?: string;
  RESEND_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PUBLIC_KEY?: string;
  DEV_MODE?: string;};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// Public: Get site settings
app.get('/settings', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT key, value FROM site_settings').all();
  const settings = results.reduce((acc: any, row: any) => {
    acc[row.key] = JSON.parse(row.value);
    return acc;
  }, {});
  return c.json(settings);
});

// Public: Get menu
app.get('/menu', async (c) => {
  const { results: collections } = await c.env.DB.prepare('SELECT * FROM collections ORDER BY sort_order').all();
  const { results: dishes } = await c.env.DB.prepare('SELECT * FROM dishes ORDER BY sort_order').all();
  
  const parsedDishes = dishes.map((d: any) => ({
    ...d,
    dietary: JSON.parse(d.dietary || '[]'),
    tags: JSON.parse(d.tags || '[]'),
    translations: JSON.parse(d.translations || '{}'),
    variants: JSON.parse(d.variants || '[]'),
    price_cents: Number(d.price_cents),
    spice_level: Number(d.spice_level),
    seasonal: Boolean(d.seasonal),
    shared_grill: Boolean(d.shared_grill),
    raw_warning: Boolean(d.raw_warning),
    is_published: Boolean(d.is_published),
    sort_order: Number(d.sort_order),
    has_variants: Boolean(d.has_variants)
  }));

  return c.json({ collections, dishes: parsedDishes });
});

// Public: Get reservations (Wait, reservations should be protected or created by public)
app.post('/reservations', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO reservations (id, name, email, message, date, time, party_size, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id, body.name, body.email, body.message, body.date, body.time, body.party_size, 'pending'
  ).run();

  // Send email notification to Admin
  try {
    let adminEmail = c.env.ADMIN_EMAIL;
    try {
      const { results } = await c.env.DB.prepare("SELECT value FROM site_settings WHERE key = 'booking_config'").all();
      if (results && results.length > 0) {
        const bookingConfig = JSON.parse(results[0].value as string);
        if (bookingConfig.receiving_email) {
          adminEmail = bookingConfig.receiving_email;
        }
      }
    } catch (dbErr) {
      console.error("Failed to fetch booking config from DB:", dbErr);
    }

      if (adminEmail && c.env.RESEND_API_KEY) {
      const mailtoSubject = encodeURIComponent(`Reservation Confirmed - Fampam Restaurant`);
      const mailtoBody = encodeURIComponent(`Hi ${body.name},\n\nThank you for your reservation request for ${body.party_size} people on ${body.date} at ${body.time}.\n\nYour reservation is confirmed!\n\nWe look forward to seeing you.\n\nBest regards,\nFampam Team`);
      const mailtoLink = `mailto:${encodeURIComponent(body.email)}?subject=${mailtoSubject}&body=${mailtoBody}`;

      const adminHtml = `
        <div style="font-family: sans-serif; color: #333;">
          <h2>New Reservation Request</h2>
          <p>Hi Admin,</p>
          <p>You have received a new reservation request:</p>
          <ul>
            <li><strong>Name:</strong> ${body.name}</li>
            <li><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></li>
            <li><strong>Date:</strong> ${body.date}</li>
            <li><strong>Time:</strong> ${body.time}</li>
            <li><strong>Guests:</strong> ${body.party_size} people</li>
            <li><strong>Message:</strong> ${body.message || "None"}</li>
          </ul>
          <p>To confirm this reservation immediately, click below to send a pre-filled confirmation email to the customer:</p>
          <div style="margin-top: 8px; margin-bottom: 16px;">
            <a href="${mailtoLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #15191a; text-decoration: none; font-weight: bold; border-radius: 6px; margin-right: 8px;">Confirm via Email App</a>
            <a href="https://mail.ionos.de/" style="display: inline-block; padding: 12px 24px; background-color: #f3f4f6; color: #374151; text-decoration: none; font-weight: bold; border-radius: 6px; border: 1px solid #d1d5db;">Open IONOS Webmail</a>
          </div>
          <p style="font-size: 12px; color: #666;">Or manage all reservations in your CMS: <a href="https://fampam.de/admin">https://fampam.de/admin</a></p>
          <p>Best regards,<br/>Fampam Restaurant Booking System</p>
        </div>
      `;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${c.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: [adminEmail],
          subject: `New Reservation Request - ${body.name}`,
          html: adminHtml
        })
      });
      
      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend API error:", errText);
      }
    } else if (!c.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set.");
    }
  } catch (err) {
    console.error("Failed to send new reservation email to admin:", err);
  }

  // Send WhatsApp notification to Admin via Twilio
  try {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ADMIN_WHATSAPP_NUMBER } = c.env;
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && ADMIN_WHATSAPP_NUMBER) {
      const fromNumber = TWILIO_FROM_NUMBER || "whatsapp:+14155238886"; // Twilio Sandbox default
      const messageBody = `*New Reservation Request!*\n\n• *Name:* ${body.name}\n• *Email:* ${body.email}\n• *Date:* ${body.date}\n• *Time:* ${body.time}\n• *Guests:* ${body.party_size} people\n• *Message:* ${body.message || "None"}\n\nManage here: https://fampam.de/admin`;

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            From: fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`,
            To: ADMIN_WHATSAPP_NUMBER.startsWith("whatsapp:") ? ADMIN_WHATSAPP_NUMBER : `whatsapp:${ADMIN_WHATSAPP_NUMBER}`,
            Body: messageBody
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Twilio WhatsApp sending failed:", errText);
      }
    }
  } catch (err) {
    console.error("Failed to send WhatsApp notification to admin:", err);
  }

  // Send Facebook Messenger notification to Admin
  try {
    const { FACEBOOK_PAGE_ACCESS_TOKEN, ADMIN_MESSENGER_PSID } = c.env;
    if (FACEBOOK_PAGE_ACCESS_TOKEN && ADMIN_MESSENGER_PSID) {
      const messageText = `⚡ *New Reservation Request!*\n\n• Name: ${body.name}\n• Email: ${body.email}\n• Date: ${body.date}\n• Time: ${body.time}\n• Guests: ${body.party_size} people\n• Message: ${body.message || "None"}\n\nManage: https://fampam.de/admin`;

      const response = await fetch(
        `https://graph.facebook.com/v19.0/me/messages?access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recipient: { id: ADMIN_MESSENGER_PSID },
            message: { text: messageText }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Facebook Messenger sending failed:", errText);
      }
    }
  } catch (err) {
    console.error("Failed to send Facebook Messenger notification to admin:", err);
  }
  
  return c.json({ success: true, id });
});

// Public: Log cookie consent
app.post('/consent', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO consent_logs (id, consent_id, timestamp, choice, categories, website_version) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(
    id, body.consent_id, body.timestamp, body.choice, JSON.stringify(body.categories || {}), body.website_version
  ).run();
  
  return c.json({ success: true });
});

// Auth endpoints removed - Authentication is now handled by Cloudflare Access at the edge.

// --- POS: Orders & Stripe ---
app.post('/stripe/create-checkout-session', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  
  // Get next order number
  const { results } = await c.env.DB.prepare('UPDATE order_counter SET last_number = last_number + 1 WHERE id = 1 RETURNING last_number').all();
  const orderNumber = (results[0] as any).last_number;

  await c.env.DB.prepare(`
    INSERT INTO orders (id, order_number, customer_id, guest_name, guest_email, type, status, items, subtotal_cents, delivery_fee_cents, total_cents, delivery_address, delivery_phone, delivery_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, 
    orderNumber ?? 0, 
    body.customer_id ?? null, 
    body.guest_name ?? null, 
    body.guest_email ?? null,
    body.order_type ?? 'pickup', 
    'received', 
    JSON.stringify(body.items ?? []), 
    body.subtotal_cents ?? 0, 
    body.delivery_fee_cents ?? 0, 
    body.total_cents ?? 0,
    body.delivery_address ?? null, 
    body.delivery_phone ?? null, 
    body.delivery_notes ?? null
  ).run();

  // If Stripe is not configured or we are in local dev mock mode, return mock session
  if (!c.env.STRIPE_SECRET_KEY || c.env.STRIPE_SECRET_KEY === 'mock') {
    return c.json({ mock: true, orderId: id });
  }
  
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: body.items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: `${item.name} ${item.variant ? `(${item.variant})` : ''}`.trim() },
        unit_amount: item.price_cents,
      },
      quantity: item.quantity,
    })).concat(body.delivery_fee_cents > 0 ? [{
      price_data: {
        currency: 'eur',
        product_data: { name: 'Delivery Fee' },
        unit_amount: body.delivery_fee_cents,
      },
      quantity: 1,
    }] : []),
    mode: 'payment',
    success_url: `${new URL(c.req.url).origin}/order/success?order_id=${id}`,
    cancel_url: `${new URL(c.req.url).origin}/checkout`,
    client_reference_id: id,
    customer_email: body.guest_email || undefined,
  });

  await c.env.DB.prepare('UPDATE orders SET stripe_session_id = ? WHERE id = ?').bind(session.id, id).run();
  
  return c.json({ sessionId: session.id, orderId: id });
});

app.post('/stripe/mock-success', async (c) => {
  const { orderId } = await c.req.json();
  await c.env.DB.prepare("UPDATE orders SET status = 'preparing', paid_at = datetime('now') WHERE id = ?").bind(orderId).run();
  return c.json({ success: true });
});

app.get('/orders/my', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);
  const token = authHeader.split(' ')[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'secret') as any;
    const { results } = await c.env.DB.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').bind(payload.customer_id).all();
    return c.json(results);
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

app.get('/orders/:id', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(c.req.param('id')).all();
  if (!results.length) return c.json({ error: 'Not found' }, 404);
  return c.json(results[0]);
});

// Admin Middleware
app.use('/admin/*', async (c, next) => {
  // Cloudflare Access injects this header when a user successfully authenticates
  const cfAccessEmail = c.req.header('Cf-Access-Authenticated-User-Email');
  
  const url = new URL(c.req.url);
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isDevMode = c.env.DEV_MODE === 'true';

  // If not localhost, no CF Access header, and DEV_MODE is not true, block the request
  if (!cfAccessEmail && !isLocalhost && !isDevMode) {
    return c.json({ error: 'Unauthorized. Cloudflare Access login required.' }, 401);
  }
  
  await next();
});

// Admin: Auth redirect helper (triggers CF Access login screen, then sends user back to SPA)
app.get('/admin/login', (c) => c.redirect('/admin'));

// Admin: Auth check
app.get('/admin/me', (c) => c.json({ admin: true }));

// Admin: Reservations
app.get('/admin/reservations', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM reservations ORDER BY created_at DESC').all();
  return c.json(results);
});

// Admin: Update Reservation Status
app.post('/admin/reservations/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();
  await c.env.DB.prepare('UPDATE reservations SET status = ? WHERE id = ?').bind(status, id).run();
  return c.json({ success: true });
});

// Admin: Send Confirmation Email
app.post('/admin/reservations/:id/reply', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  await c.env.DB.prepare('UPDATE reservations SET status = ? WHERE id = ?').bind('confirmed', id).run();

  let email_sent = false;
  let email_error = null;

  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM reservations WHERE id = ?').bind(id).all();
    const reservation: any = results[0];
    
    if (reservation && reservation.email && c.env.RESEND_API_KEY) {
      // Replace placeholders in email template sent from frontend
      let bodyText = body.emailTemplate || "Hi {name},\n\nYour reservation on {date} at {time} has been confirmed.\n\nThank you!";
      bodyText = bodyText
        .replace(/{name}/g, reservation.name || '')
        .replace(/{party_size}/g, String(reservation.party_size || ''))
        .replace(/{date}/g, reservation.date || '')
        .replace(/{time}/g, reservation.time || '');

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${c.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Fampam Restaurant <no-reply@fampam.de>",
          to: [reservation.email],
          subject: "Reservation Confirmed!",
          text: bodyText
        })
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend API error:", errText);
        email_error = errText;
      } else {
        email_sent = true;
      }
    } else if (!c.env.RESEND_API_KEY) {
      email_error = "RESEND_API_KEY binding is missing.";
    }
  } catch (err: any) {
    console.error("Failed to send Cloudflare email:", err);
    email_error = err.message;
  }

  return c.json({ success: true, email_sent, email_error });
});

// Admin: Orders
app.get('/admin/orders', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return c.json(results);
});

// Admin: Update Order Status
app.post('/admin/orders/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();
  await c.env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run();
  return c.json({ success: true });
});

// Admin: Manage Dishes
app.post('/admin/dishes', async (c) => {
  const dish = await c.req.json();
  if (dish.id) {
    // update
    const cols = Object.keys(dish).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ');
    const values = Object.keys(dish).filter(k => k !== 'id').map(k => typeof dish[k] === 'object' ? JSON.stringify(dish[k]) : dish[k]);
    await c.env.DB.prepare(`UPDATE dishes SET ${cols} WHERE id = ?`).bind(...values, dish.id).run();
    return c.json({ id: dish.id });
  } else {
    // insert
    const newId = crypto.randomUUID();
    const cols = Object.keys(dish);
    const placeholders = cols.map(() => '?').join(', ');
    const values = cols.map(k => typeof dish[k] === 'object' ? JSON.stringify(dish[k]) : dish[k]);
    await c.env.DB.prepare(`INSERT INTO dishes (id, ${cols.join(', ')}) VALUES (?, ${placeholders})`).bind(newId, ...values).run();
    return c.json({ id: newId });
  }
});

app.delete('/admin/dishes/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM dishes WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.put('/admin/dishes/:id/sort_order', async (c) => {
  const id = c.req.param('id');
  const { sort_order } = await c.req.json();
  await c.env.DB.prepare('UPDATE dishes SET sort_order = ? WHERE id = ?').bind(sort_order, id).run();
  return c.json({ success: true });
});

// Admin: Update Site Settings
app.post('/admin/settings', async (c) => {
  const body = await c.req.json();
  const stmt = c.env.DB.prepare('INSERT INTO site_settings (id, key, value) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  
  // Batch updates
  const stmts = Object.entries(body).map(([key, value]) => {
    return stmt.bind(crypto.randomUUID(), key, JSON.stringify(value));
  });
  
  await c.env.DB.batch(stmts);
  return c.json({ success: true });
});

// Admin: Update Menu Item
app.post('/admin/menu/dishes', async (c) => {
  const d = await c.req.json();
  const id = d.id || crypto.randomUUID();
  
  await c.env.DB.prepare(`
    INSERT INTO dishes (id, collection_id, code, name, description, price_cents, trace, sticker_url, dietary, tags, spice_level, seasonal, shared_grill, raw_warning, is_published, sort_order, translations, has_variants, variants)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      collection_id = excluded.collection_id, code = excluded.code, name = excluded.name, description = excluded.description,
      price_cents = excluded.price_cents, trace = excluded.trace, sticker_url = excluded.sticker_url, dietary = excluded.dietary,
      tags = excluded.tags, spice_level = excluded.spice_level, seasonal = excluded.seasonal, shared_grill = excluded.shared_grill,
      raw_warning = excluded.raw_warning, is_published = excluded.is_published, sort_order = excluded.sort_order,
      translations = excluded.translations, has_variants = excluded.has_variants, variants = excluded.variants
  `).bind(
    id, d.collection_id, d.code, d.name, d.description, d.price_cents, d.trace, d.sticker_url,
    JSON.stringify(d.dietary || []), JSON.stringify(d.tags || []), d.spice_level, d.seasonal ? 1 : 0,
    d.shared_grill ? 1 : 0, d.raw_warning ? 1 : 0, d.is_published ? 1 : 0, d.sort_order,
    JSON.stringify(d.translations || {}), d.has_variants ? 1 : 0, JSON.stringify(d.variants || [])
  ).run();

  return c.json({ success: true, id });
});

app.delete('/admin/menu/dishes/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM dishes WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// R2 Presigned URL for image upload
app.post('/admin/upload-url', async (c) => {
  const { filename } = await c.req.json();
  // We can just use the R2 bucket directly in workers instead of presigned URL
  // But wait, the client is React, so we could just upload through this worker endpoint directly.
  return c.json({ error: 'Not implemented. Use direct upload endpoint' }, 501);
});

// Admin: Direct Image Upload
app.post('/admin/upload', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'] as File;
  if (!file) return c.json({ error: 'No file' }, 400);

  const filename = `${Date.now()}-${file.name}`;
  await c.env.R2_BUCKET.put(filename, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  return c.json({ url: `/assets/${filename}` }); // Assuming custom domain or public bucket is mapped to /assets or we use public URL
});

const rootApp = new Hono<{ Bindings: Bindings }>();

// Mount the API routes
rootApp.route('/', app);

// SPA Fallback for all other routes (React Router)
rootApp.get('*', async (c) => {
  // Pass the request to the static assets binding
  let response = await c.env.ASSETS.fetch(c.req.raw);
  
  // If the asset doesn't exist (e.g. /admin, /reservations), serve index.html for client-side routing
  if (response.status === 404) {
    const url = new URL(c.req.url);
    url.pathname = '/index.html';
    // Fetch index.html instead
    response = await c.env.ASSETS.fetch(new Request(url, c.req.raw));
  }
  
  return response;
});

export default {
  fetch: rootApp.fetch,
  
  // Handle incoming emails routed to this worker via Cloudflare Email Routing
  async email(message: any, env: Bindings, ctx: any) {
    let adminEmail = env.ADMIN_EMAIL;
    
    // Attempt to fetch the configured receiving email from the database
    try {
      const { results } = await env.DB.prepare("SELECT value FROM site_settings WHERE key = 'booking_config'").all();
      if (results && results.length > 0) {
        const bookingConfig = JSON.parse(results[0].value as string);
        if (bookingConfig.receiving_email) {
          adminEmail = bookingConfig.receiving_email;
        }
      }
    } catch (dbErr) {
      console.error("Failed to fetch booking config from DB for email forward:", dbErr);
    }
    
    // Forward the email to the admin
    if (adminEmail) {
      await message.forward(adminEmail);
    } else {
      console.error("No admin email configured to forward to.");
      message.setReject("Destination not configured.");
    }
  }
};
