# CapShip Server — Secrets Setup Guide

## Cloudflare Secrets (set via `wrangler secret put`)

Run each of these commands from the `/server` directory.
You will be prompted to paste the value.

```bash
# R2 API Token — Access Key ID
npx wrangler secret put R2_ACCESS_KEY_ID

# R2 API Token — Secret Access Key
npx wrangler secret put R2_SECRET_ACCESS_KEY

# Polar server-side access token (from polar.sh dashboard → Settings → API)
npx wrangler secret put POLAR_ACCESS_TOKEN

# Polar webhook signing secret (from polar.sh dashboard → Webhooks → your endpoint)
npx wrangler secret put POLAR_WEBHOOK_SECRET

# Internal admin token — generate with: openssl rand -hex 32
npx wrangler secret put ADMIN_TOKEN
```

## Cloudflare Vars (set in wrangler.jsonc — NOT secrets)

Edit `wrangler.jsonc` and replace:
- `REPLACE_WITH_YOUR_CLOUDFLARE_ACCOUNT_ID` → your Cloudflare account ID (from dashboard URL)
- `REPLACE_WITH_YOUR_D1_DATABASE_ID` → from `npx wrangler d1 create capship-db`
- `REPLACE_WITH_YOUR_POLAR_ORG_ID` → from polar.sh dashboard → Organization settings

## R2 Token Setup

1. Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create a token with **Object Read & Write** on the `capship-bundles` bucket only
3. Copy the Access Key ID and Secret Access Key

## D1 Database Setup

```bash
# Create the D1 database
npx wrangler d1 create capship-db

# Apply migrations locally (for dev)
npm run db:migrate:local

# Apply migrations to production
npm run db:migrate:remote
```

## R2 Bucket Setup

```bash
# Create the production bucket
npx wrangler r2 bucket create capship-bundles

# Create the preview bucket for local dev
npx wrangler r2 bucket create capship-bundles-preview

# Upload the free bundle
npx wrangler r2 object put capship-bundles/bundles/free.zip --file ./path/to/free.zip

# Upload the pro bundle
npx wrangler r2 object put capship-bundles/bundles/pro.zip --file ./path/to/pro.zip
```

## Polar Setup

1. Create a product in polar.sh: **CapShip Pro** — $199 one-time
2. Add a **License Key** benefit to the product
3. Set the **Activation Limit** to **1** (enforces single-use at Polar level too)
4. Go to **Webhooks** → Add endpoint: `https://capship-api.<your-worker>.workers.dev/v1/webhooks/polar`
5. Subscribe to: `order.created`
6. Copy the signing secret → `wrangler secret put POLAR_WEBHOOK_SECRET`
