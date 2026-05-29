# Fampam Restaurant POS - Production Launch Checklist

When you are ready to move out of the mock testing phase and launch the application in a real production environment, follow these steps to secure the admin CMS, enable real payments, and configure communication integrations.

## 1. Secure the Admin CMS (Cloudflare Access)
Currently, `DEV_MODE = "true"` is set in your `wrangler.toml`, which completely bypasses the Cloudflare Zero Trust authentication layer so you can test the admin dashboard easily.

**Before Launch:**
1. Open `wrangler.toml` and either remove the `DEV_MODE = "true"` line entirely, or set it to `"false"`.
2. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Zero Trust** -> **Access** -> **Applications**.
3. Create an application covering the path `https://fampam.de/admin*` (or whichever custom domain you assign).
4. Configure an Access Policy to restrict access ONLY to your authorized administrator emails.
5. Once configured, navigating to `/admin` will automatically intercept the request and prompt for an email pin code before routing the user to the admin CMS.

## 2. Real Payment Processing (Stripe)
Right now, the app is generating mock Stripe sessions that skip the payment gateway and immediately succeed.

**Before Launch:**
1. Create a [Stripe](https://stripe.com) account.
2. Get your live API keys from the Stripe Dashboard.
3. Configure your worker environment variables with the real keys:
   ```bash
   wrangler secret put STRIPE_SECRET_KEY
   wrangler secret put STRIPE_WEBHOOK_SECRET
   ```
4. Set the `STRIPE_PUBLIC_KEY` in `wrangler.toml` (or via Cloudflare Dashboard for the worker) so the frontend can load the Stripe checkout widget.
5. In your Stripe Dashboard, configure a Webhook pointing to `https://fampam.de/api/stripe/webhook` (you'll need to swap the `/mock-success` endpoint in `worker.ts` with a real Stripe webhook validation endpoint).

## 3. Email Integration (Resend)
The CMS currently attempts to send confirmation emails via the Resend API when you click "Reply" on reservations.

**Before Launch:**
1. You already have `RESEND_API_KEY` defined in `wrangler.toml`. Ensure this key is valid and not a test-mode key.
2. In the [Resend Dashboard](https://resend.com), verify your sending domain (`fampam.de`) by adding the necessary DNS records to your Cloudflare DNS tab. This ensures emails aren't flagged as spam.

## 4. Admin Notifications (Twilio & Facebook)
The backend includes built-in logic to notify you via WhatsApp and Facebook Messenger whenever a new reservation or order arrives.

**Before Launch:**
1. **Twilio (WhatsApp):**
   - Run `wrangler secret put TWILIO_ACCOUNT_SID`
   - Run `wrangler secret put TWILIO_AUTH_TOKEN`
   - Run `wrangler secret put TWILIO_FROM_NUMBER`
   - Run `wrangler secret put ADMIN_WHATSAPP_NUMBER`
2. **Facebook Messenger:**
   - Run `wrangler secret put FACEBOOK_PAGE_ACCESS_TOKEN`
   - Run `wrangler secret put ADMIN_MESSENGER_PSID`

## 5. Domain Configuration
**Before Launch:**
1. In the Cloudflare Dashboard, go to **Workers & Pages** -> your worker -> **Triggers**.
2. Add a Custom Domain route (e.g. `fampam.de/*` or `order.fampam.de/*`) to serve the app on your primary URL instead of the `.workers.dev` subdomain.

---
**Remember to always run `pnpm run build && wrangler deploy` after changing environment variables or the `wrangler.toml` file.**
