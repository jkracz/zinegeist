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

| Variable                        | Purpose                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `SITE_URL`                      | Public site URL (used as auth fallback)                   |
| `BETTER_AUTH_URL`               | Better Auth base URL (optional; falls back to `SITE_URL`) |
| `BETTER_AUTH_FALLBACK_URL`      | Better Auth fallback URL (optional)                       |
| `GOOGLE_CLIENT_ID`              | Google OAuth client ID                                    |
| `GOOGLE_CLIENT_SECRET`          | Google OAuth client secret                                |
| `POLAR_PLUS_MONTHLY_PRODUCT_ID` | Polar product ID for monthly Plus plan                    |
| `POLAR_PLUS_YEARLY_PRODUCT_ID`  | Polar product ID for yearly Plus plan                     |

Polar and Better Auth components may prompt for additional secrets the first time you run `bunx convex dev` — follow the prompts.

```sh
bun run dev
```

This starts Vite on port 5296 and the Convex dev server concurrently.

## Scripts

| Command                    | Purpose                  |
| -------------------------- | ------------------------ |
| `bun run dev`              | Web + Convex dev servers |
| `bun run dev:web`          | Web only                 |
| `bun run build`            | Production build         |
| `bun run preview`          | Preview production build |
| `bun run lint`             | Prettier + ESLint check  |
| `bun run format`           | Prettier write           |
| `bun run typecheck`        | svelte-check             |
| `bun run typecheck:convex` | Convex typecheck         |

## Project layout

```
src/
  routes/    SvelteKit pages
  lib/       Components, hooks, utilities, PDF
  convex/    Backend functions, schema, auth
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[Apache 2.0](./LICENSE)
