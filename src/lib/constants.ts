/**
 * Maximum number of active publications a single user can have on their shelf
 * (drafts + published + unpublished — anything not deleted).
 *
 * Mirrors the value in src/convex/publications.ts. Keep both in sync.
 *
 * Read by:
 * - src/routes/profile/[handle]/+page.svelte (eyebrow + ShelfFullCard swap)
 * - src/lib/components/PublicationCountEyebrow.svelte (via prop)
 *
 * Will be replaced by a per-user value once subscription billing ships.
 */
export const PUBLICATION_UPLOAD_LIMIT = 5;

/**
 * Error message thrown by the createDraft Convex mutation when a user tries
 * to upload past PUBLICATION_UPLOAD_LIMIT. The client matches on this string
 * to surface the "Shelf full" toast as a race-condition fallback.
 *
 * Read by:
 * - src/lib/components/create/create-draft.svelte.ts (toast fallback)
 *
 * Thrown by:
 * - src/convex/publications.ts createDraft mutation
 */
export const PUBLICATION_LIMIT_REACHED = 'PUBLICATION_LIMIT_REACHED';
