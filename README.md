# Zinegeist

A publishing home for independent writers. Permanent URLs, shelf-shaped discovery, no algorithmic feed.

See [PRODUCT.md](./PRODUCT.md) for product vision and [DESIGN.md](./DESIGN.md) for the design system.

## Tech stack

- [SvelteKit](https://svelte.dev) (Svelte 5) + TypeScript
- [Convex](https://convex.dev) backend with [Better Auth](https://www.better-auth.com/)
- Tailwind CSS 4, [shadcn-svelte](https://www.shadcn-svelte.com/), Bits UI
- [EmbedPDF](https://www.embedpdf.com/) for PDF rendering
- [Polar](https://polar.sh/) for subscriptions
- Deployed to Vercel

## Getting started

Requires [Bun](https://bun.sh/).

```sh
bun install
```

Run `bunx convex dev` once to provision a deployment if you don't have one — it will populate `CONVEX_DEPLOYMENT` and `PUBLIC_CONVEX_URL` in `.env.local`.

### Frontend env (`.env.local`)

```sh
CONVEX_DEPLOYMENT=<set by convex dev>
PUBLIC_CONVEX_URL=<set by convex dev>
PUBLIC_CONVEX_SITE_URL=<your-convex-site-url>   # e.g. https://<slug>.convex.site
PUBLIC_SITE_URL=http://localhost:5296
```

### Convex deployment env

Set on the Convex deployment with `bunx convex env set <KEY> <VALUE>`:

| Variable                        | Purpose                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `SITE_URL`                      | Public site URL (used as auth fallback)                                      |
| `BETTER_AUTH_URL`               | Better Auth base URL (optional; falls back to `SITE_URL`)                    |
| `BETTER_AUTH_FALLBACK_URL`      | Better Auth fallback URL (optional)                                          |
| `GOOGLE_CLIENT_ID`              | Google OAuth client ID                                                       |
| `GOOGLE_CLIENT_SECRET`          | Google OAuth client secret                                                   |
| `POLAR_PLUS_MONTHLY_PRODUCT_ID` | Polar product ID for monthly Plus plan                                       |
| `POLAR_PLUS_YEARLY_PRODUCT_ID`  | Polar product ID for yearly Plus plan                                        |
| `POLAR_ORGANIZATION_TOKEN`      | Polar organization access token for the selected environment                 |
| `POLAR_WEBHOOK_SECRET`          | Signing secret from the matching Polar webhook endpoint                      |
| `POLAR_SERVER`                  | `production` for live billing; `sandbox` for development (component default) |

Polar and Better Auth components may prompt for additional secrets the first time you run `bunx convex dev` — follow the prompts.

```sh
bun run dev
```

This starts Vite on port 5296 and the Convex dev server concurrently.

### Polar billing

API requests are pinned to **2026-10** through the checked-in Bun patch for
`@polar-sh/sdk@0.49.0`. This is the latest compatible legacy SDK: the Convex Polar
component uses imports and models removed in SDK 1.x. The patch sets the
`Polar-Version` header for every SDK instance, including product synchronization
inside the component. Keep it until the component supports Polar's versioned SDK
imports. `bun install --frozen-lockfile` applies it automatically, and
`bun run test:polar` verifies billing requests in both environments.

The 2026-10 API changes concern webhook endpoint secrets and license keys; the
checkout, customer, customer-session, product, and subscription contracts used
here are unchanged. See Polar's [versioning guide](https://polar.sh/docs/api-reference/2026-10/versioning)
and [API changelog](https://polar.sh/docs/changelog/api).

Configure the corresponding Polar organization for each deployment:

- **Settings → Preferences → Embedding:** allow the exact checkout hosts.
  Production uses `www.zinegeist.club` (verified October 2, 2026). Add
  `localhost:5296` to the sandbox organization for local development and list
  any staging/preview hosts explicitly. Entries omit the scheme and include
  non-default ports; do not allow all of `*.vercel.app`.
- **Settings → Webhooks:** use `<CONVEX_SITE_URL>/polar/events`, Raw format,
  API version `2026-10`, and `product.created`, `product.updated`,
  `subscription.created`, `subscription.updated`. Production's existing
  `zinegeist-prod` endpoint was upgraded to 2026-10 on October 2, 2026.
- The existing production endpoint uses **legacy signing**. Preserve its secret:
  Polar still supports that scheme, while resetting it switches to Standard
  Webhooks signing, which the component's legacy SDK does not support. Upgrade
  the webhook verifier before creating an endpoint or rotating the secret.

API and webhook versions must be upgraded separately. Review each quarterly
release and migrate before the pinned version is removed (2026-10 is scheduled
to leave support at the April 2027 release). Repository changes take effect after
deploying both the frontend and Convex backend through the normal Vercel build.

## Scripts

| Command                    | Purpose                            |
| -------------------------- | ---------------------------------- |
| `bun run dev`              | Web + Convex dev servers           |
| `bun run dev:web`          | Web only                           |
| `bun run build`            | Production build                   |
| `bun run preview`          | Preview production build           |
| `bun run lint`             | Prettier + ESLint check            |
| `bun run format`           | Prettier write                     |
| `bun run typecheck`        | svelte-check                       |
| `bun run typecheck:convex` | Convex typecheck                   |
| `bun run test:polar`       | Polar API version regression tests |

## Project layout

```text
src/
  routes/    SvelteKit pages
  lib/       Components, hooks, utilities, PDF
  convex/    Backend functions, schema, auth
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[Apache 2.0](./LICENSE)
