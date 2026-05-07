# PostHog Tracking

This app uses PostHog for product analytics, error capture, and event funnels.

## Packages

- `posthog-js` is used in browser/Svelte code.
- `posthog-node` is used for server-side capture.

Use `bun` for package changes.

## Configuration

Client initialization lives in `src/hooks.client.ts`.

- Events are sent through `/ingest` instead of directly to PostHog.
- `api_host` is `/ingest`.
- `ui_host` is `PUBLIC_POSTHOG_HOST`.
- `capture_exceptions` is enabled.

The SvelteKit reverse proxy lives in `src/hooks.server.ts` and must run before auth middleware so PostHog ingestion requests are not redirected.

Server-side PostHog access lives in `src/lib/server/posthog.ts`.

Required environment variables:

- `PUBLIC_POSTHOG_PROJECT_TOKEN`
- `PUBLIC_POSTHOG_HOST`

PostHog is disabled when `PUBLIC_POSTHOG_PROJECT_TOKEN` is missing.

`svelte.config.js` sets `paths.relative: false`, which PostHog recommends for session replay with SvelteKit SSR.

## Identity

Identify users with the stable Better Auth/Convex user id, not email.

Current identity flow:

- `src/routes/+layout.svelte` calls `posthog.identify(user.id, { email, name })` once the authenticated user is available from server-loaded layout data.
- Email and name are person properties only.
- `src/lib/components/auth/UserMenu.svelte` calls `posthog.reset()` after sign-out.

Do not call `posthog.identify(email)`. Email can change and should not be the primary `distinct_id`.

## Event Inventory

| Event                        | Description                                   | File                                                   |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| `sign_in`                    | User successfully signs in via email          | `src/lib/components/auth/SignInDialog.svelte`          |
| `sign_up`                    | User successfully creates an account          | `src/lib/components/auth/SignInDialog.svelte`          |
| `profile_created`            | User completes onboarding by picking a handle | `src/routes/onboarding/handle/+page.svelte`            |
| `publication_draft_uploaded` | User uploads a PDF and creates a draft        | `src/lib/components/create/create-draft.svelte.ts`     |
| `publication_published`      | User publishes a draft publication            | `src/lib/components/create/create-draft.svelte.ts`     |
| `publication_read_opened`    | User opens the in-browser PDF reader          | `src/routes/publication/[id]/+page.svelte`             |
| `publication_shared`         | User clicks the Share button                  | `src/routes/publication/[id]/+page.svelte`             |
| `checkout_opened`            | User opens the Polar checkout for Plus        | `src/lib/components/billing/PlusCheckoutButton.svelte` |
| `checkout_completed`         | Polar checkout succeeds                       | `src/lib/components/billing/PlusCheckoutButton.svelte` |
| `profile_updated`            | User saves writer profile changes             | `src/routes/profile/[handle]/+page.svelte`             |
| `publication_unpublished`    | User unpublishes a live publication           | `src/routes/profile/[handle]/+page.svelte`             |
| `publication_deleted`        | User deletes a publication                    | `src/routes/profile/[handle]/+page.svelte`             |
| `server_error`               | SvelteKit server error handler captures error | `src/hooks.server.ts`                                  |

## Dashboard References

These PostHog links are project-local paths and require being logged into the correct PostHog project:

- [Analytics basics dashboard](/dashboard/1553581)
- [Sign-ups over time](/insights/BZB8Ck92)
- [Creator publication funnel](/insights/XZ7vYwpI)
- [Plus subscription conversion](/insights/7WuJeWZ0)
- [Publication reader engagement](/insights/zZ3lsRN7)
- [Churn signals](/insights/7bXD2CnF)

## Maintenance Notes

- Add events at user-intent boundaries, not every UI click.
- Prefer stable ids and low-cardinality properties.
- Avoid sending raw content, uploaded file names, freeform text, or secrets as event properties.
- For authenticated events, rely on the layout-level identify call instead of identifying inside individual handlers.
- Reset PostHog when the authenticated user signs out.
