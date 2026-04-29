import { customAlphabet } from 'nanoid';
import { v } from 'convex/values';
import { mutation, type MutationCtx, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';
import type { Doc, Id } from './_generated/dataModel';

const ROUTE_SUFFIX_ALPHABET = '23456789abcdefghijkmnopqrstuvwxyz';
const makeRouteSuffix = customAlphabet(ROUTE_SUFFIX_ALPHABET, 6);
const MAX_SLUG_LENGTH = 72;
const MAX_TITLE_LENGTH = 140;
const MAX_DESCRIPTION_LENGTH = 1200;
const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 32;

type AuthedCtx = QueryCtx | MutationCtx;

async function findProfileByUserId(ctx: AuthedCtx, userId: string) {
	return ctx.db
		.query('profiles')
		.withIndex('by_userId', (q) => q.eq('userId', userId))
		.unique();
}

async function requireAuthorWithProfile(ctx: AuthedCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) throw new Error('Not authenticated.');

	const profile = await findProfileByUserId(ctx, authUser._id);
	if (!profile) throw new Error('Profile required.');

	return { authUser, profile };
}

function cleanOptionalText(input: string, maxLength: number): string | undefined {
	const cleaned = input.trim().replace(/\s+/g, ' ');
	return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function cleanTags(tags: string[]): string[] | undefined {
	const seen = new Set<string>();
	const cleaned: string[] = [];

	for (const tag of tags) {
		const value = tag.trim().replace(/\s+/g, ' ').slice(0, MAX_TAG_LENGTH);
		const key = value.toLowerCase();
		if (!value || seen.has(key)) continue;
		seen.add(key);
		cleaned.push(value);
		if (cleaned.length >= MAX_TAGS) break;
	}

	return cleaned.length > 0 ? cleaned : undefined;
}

function titleToSlug(title: string): string {
	const slug = title
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, MAX_SLUG_LENGTH)
		.replace(/-$/g, '');

	return slug || 'publication';
}

async function assertStorageFileExists(ctx: MutationCtx, fileId: Id<'_storage'>): Promise<void> {
	const file = await ctx.db.system.get('_storage', fileId);
	if (!file) throw new Error('Uploaded file not found.');
}

async function requireOwnedPublication(
	ctx: MutationCtx,
	publicationId: Id<'publications'>,
	authorId: string
): Promise<Doc<'publications'>> {
	const publication = await ctx.db.get(publicationId);
	if (!publication) throw new Error('Publication not found.');
	if (publication.authorId !== authorId) throw new Error('Not authorized.');
	return publication;
}

async function createUniqueSlug(ctx: MutationCtx, title: string): Promise<string> {
	const slugBase = titleToSlug(title);

	for (let attempt = 0; attempt < 8; attempt += 1) {
		const slug = `${slugBase}-${makeRouteSuffix()}`;
		const existing = await ctx.db
			.query('publications')
			.withIndex('by_slug', (q) => q.eq('slug', slug))
			.unique();
		if (!existing) return slug;
	}

	throw new Error('Could not generate a unique publication URL.');
}

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuthorWithProfile(ctx);
		return ctx.storage.generateUploadUrl();
	}
});

export const createDraft = mutation({
	args: {
		pdfFileId: v.id('_storage'),
		coverFileId: v.id('_storage')
	},
	handler: async (ctx, args) => {
		const { authUser } = await requireAuthorWithProfile(ctx);
		await assertStorageFileExists(ctx, args.pdfFileId);
		await assertStorageFileExists(ctx, args.coverFileId);

		const now = Date.now();
		const publicationId = await ctx.db.insert('publications', {
			authorId: authUser._id,
			updatedAt: now,
			pdfFileId: args.pdfFileId,
			coverFileId: args.coverFileId,
			status: 'draft'
		});

		return { publicationId };
	}
});

export const updateDraftDetails = mutation({
	args: {
		publicationId: v.id('publications'),
		title: v.string(),
		description: v.string(),
		tags: v.array(v.string())
	},
	handler: async (ctx, args) => {
		const { authUser } = await requireAuthorWithProfile(ctx);
		const publication = await requireOwnedPublication(ctx, args.publicationId, authUser._id);
		if (publication.status !== 'draft') throw new Error('Only drafts can be updated here.');

		const title = cleanOptionalText(args.title, MAX_TITLE_LENGTH);
		const description = cleanOptionalText(args.description, MAX_DESCRIPTION_LENGTH);
		const tags = cleanTags(args.tags);

		await ctx.db.patch(args.publicationId, {
			title,
			description,
			tags,
			updatedAt: Date.now()
		});

		return { publicationId: args.publicationId };
	}
});

export const publish = mutation({
	args: {
		publicationId: v.id('publications'),
		rightsAccepted: v.boolean()
	},
	handler: async (ctx, args) => {
		if (!args.rightsAccepted) throw new Error('Rights confirmation is required.');

		const { authUser } = await requireAuthorWithProfile(ctx);
		const publication = await requireOwnedPublication(ctx, args.publicationId, authUser._id);
		if (publication.status !== 'draft') throw new Error('Only drafts can be published.');

		const title = cleanOptionalText(publication.title ?? '', MAX_TITLE_LENGTH);
		if (!title) throw new Error('Title is required.');

		const now = Date.now();
		const slug = publication.slug ?? (await createUniqueSlug(ctx, title));

		await ctx.db.patch(args.publicationId, {
			slug,
			status: 'published',
			publishedAt: now,
			rightsConfirmedAt: now,
			updatedAt: now
		});

		return { slug };
	}
});
