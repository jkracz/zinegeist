/**
 * Central registry of app-level controls and policy constants used by client
 * code. Anything that's a "knob" — a limit, a quota, a threshold, a shared
 * error string — should live here so we have a single place to audit and
 * change controls.
 *
 * NOTE on Convex: files under `src/convex` cannot import from `$lib` (the
 * Convex bundler does not reach outside `src/convex`). Constants marked
 * "Mirrors src/convex/..." below are duplicated there — keep both in sync.
 *
 * NOT here: pure UI styling values, type discriminants, route paths, or
 * component-local helpers. Only things that act as policy/control.
 */

// ---------------------------------------------------------------------------
// Publication shelf
// ---------------------------------------------------------------------------

/**
 * Maximum number of active publications a single user can have on their shelf
 * (drafts + published + unpublished — anything not deleted).
 *
 * Mirrors src/convex/publications.ts. Keep both in sync.
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
 * Mirrors src/convex/publications.ts. Keep both in sync.
 *
 * Read by:
 * - src/lib/components/create/create-draft.svelte.ts (toast fallback)
 *
 * Thrown by:
 * - src/convex/publications.ts createDraft mutation
 */
export const PUBLICATION_LIMIT_REACHED = 'PUBLICATION_LIMIT_REACHED';

/**
 * User-facing toast/error copy shown when an upload is rejected because the
 * shelf is full. Hardcodes the "5 of 5" wording to match
 * PUBLICATION_UPLOAD_LIMIT — update both together.
 */
export const SHELF_FULL_MESSAGE = `Shelf full. ${PUBLICATION_UPLOAD_LIMIT} of ${PUBLICATION_UPLOAD_LIMIT} published.`;

// ---------------------------------------------------------------------------
// Upload size limits
// ---------------------------------------------------------------------------

/**
 * Maximum size of a publication PDF that the client will attempt to upload.
 * Enforced client-side only as a fast-fail; Convex storage has its own ceiling.
 *
 * Read by:
 * - src/lib/components/create/create-draft.svelte.ts (#validate)
 */
export const MAX_PDF_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/**
 * Maximum size of a profile image upload.
 *
 * Mirrors src/convex/profiles.ts MAX_PROFILE_IMAGE_SIZE. Keep both in sync.
 *
 * Read by:
 * - src/lib/components/ProfileImagePicker.svelte (validateProfileImage)
 */
export const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Publication content limits (client-side maxlength + tag caps)
//
// These mirror the validation in src/convex/publications.ts. The server is
// the source of truth — these values exist so input fields can show the cap
// in the UI (maxlength) without round-tripping. Keep in sync with Convex.
// ---------------------------------------------------------------------------

/**
 * Max length of a publication title.
 * Mirrors src/convex/publications.ts MAX_TITLE_LENGTH.
 */
export const MAX_TITLE_LENGTH = 140;

/**
 * Max length of a publication description (textarea cap on the preview step).
 * Mirrors src/convex/publications.ts MAX_DESCRIPTION_LENGTH.
 */
export const MAX_DESCRIPTION_LENGTH = 1200;

/**
 * Maximum number of tags a publication may have.
 * Mirrors src/convex/publications.ts MAX_TAGS.
 */
export const MAX_TAGS = 12;

/**
 * Maximum length of a single tag string.
 * Mirrors src/convex/publications.ts MAX_TAG_LENGTH.
 */
export const MAX_TAG_LENGTH = 32;
