import { customAlphabet } from 'nanoid';
import { v } from 'convex/values';
import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';
import type { Doc, Id } from './_generated/dataModel';

const ROUTE_SUFFIX_ALPHABET = '23456789abcdefghijkmnopqrstuvwxyz';
const makeRouteSuffix = customAlphabet(ROUTE_SUFFIX_ALPHABET, 6);
const PROFILE_PUBLICATIONS_LIMIT = 10;
const MAX_SLUG_LENGTH = 72;
const MAX_TITLE_LENGTH = 140;
const MAX_DESCRIPTION_LENGTH = 1200;
const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 32;
const MAX_FILE_NAME_LENGTH = 240;

type AuthedCtx = QueryCtx | MutationCtx;
type FileKind = 'publication_pdf' | 'publication_cover';

type UploadedFileInput = {
	storageId: Id<'_storage'>;
	name: string;
	mimeType: string;
};

const uploadedFileValidator = v.object({
	storageId: v.id('_storage'),
	name: v.string(),
	mimeType: v.string()
});

async function findProfileByUserId(ctx: AuthedCtx, userId: string) {
	return ctx.db
		.query('profiles')
		.withIndex('by_userId', (q) => q.eq('userId', userId))
		.unique();
}

async function findProfileByHandle(ctx: QueryCtx, handle: string) {
	return ctx.db
		.query('profiles')
		.withIndex('by_handle', (q) => q.eq('handle', handle.trim().toLowerCase()))
		.unique();
}

async function requireAuthorWithProfile(ctx: AuthedCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) throw new Error('Not authenticated.');

	const profile = await findProfileByUserId(ctx, authUser._id);
	if (!profile) throw new Error('Profile required.');

	return { authUser, profile };
}

async function publicationCoverUrl(
	ctx: QueryCtx,
	coverFileId: Id<'files'>
): Promise<string | null> {
	const file = await ctx.db.get(coverFileId);
	if (!file) return null;
	return await ctx.storage.getUrl(file.storageId);
}

async function publicationPdfUrl(ctx: QueryCtx, pdfFileId: Id<'files'>): Promise<string | null> {
	const file = await ctx.db.get(pdfFileId);
	if (!file) return null;
	return await ctx.storage.getUrl(file.storageId);
}

async function presentProfilePublication(ctx: QueryCtx, publication: Doc<'publications'>) {
	return {
		id: publication._id,
		title: publication.title ?? 'Untitled publication',
		description: publication.description ?? null,
		tags: publication.tags ?? [],
		status: publication.status,
		slug: publication.slug ?? null,
		publishedAt: publication.publishedAt ?? null,
		updatedAt: publication.updatedAt,
		coverUrl: await publicationCoverUrl(ctx, publication.coverFileId)
	};
}

function cleanOptionalText(input: string, maxLength: number): string | undefined {
	const cleaned = input.trim().replace(/\s+/g, ' ');
	return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function cleanFileName(input: string): string {
	return cleanOptionalText(input, MAX_FILE_NAME_LENGTH) ?? 'untitled';
}

function cleanMimeType(input: string | undefined): string {
	return cleanOptionalText(input ?? '', 120)?.toLowerCase() ?? 'application/octet-stream';
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

function assertExpectedMimeType(kind: FileKind, mimeType: string): void {
	if (kind === 'publication_pdf' && mimeType !== 'application/pdf') {
		throw new Error('Publication file must be a PDF.');
	}
	if (kind === 'publication_cover' && mimeType !== 'image/jpeg') {
		throw new Error('Cover file must be a JPEG.');
	}
}

async function acquireFileForPublication(
	ctx: MutationCtx,
	uploaderId: string,
	file: UploadedFileInput,
	kind: FileKind
): Promise<Id<'files'>> {
	const metadata = await ctx.db.system.get('_storage', file.storageId);
	if (!metadata) throw new Error('Uploaded file not found.');

	const mimeType = cleanMimeType(metadata.contentType ?? file.mimeType);
	assertExpectedMimeType(kind, mimeType);

	const existing = await ctx.db
		.query('files')
		.withIndex('by_sha256', (q) => q.eq('sha256', metadata.sha256))
		.unique();

	if (existing) {
		await ctx.db.patch(existing._id, {
			refCount: existing.refCount + 1
		});
		if (existing.storageId !== file.storageId) {
			await ctx.storage.delete(file.storageId);
		}
		return existing._id;
	}

	return await ctx.db.insert('files', {
		uploaderId,
		storageId: file.storageId,
		name: cleanFileName(file.name),
		mimeType,
		sha256: metadata.sha256,
		size: metadata.size,
		kind,
		refCount: 1
	});
}

async function releaseFileReference(ctx: MutationCtx, fileId: Id<'files'>): Promise<void> {
	const file = await ctx.db.get(fileId);
	if (!file) return;

	if (file.refCount <= 1) {
		await ctx.storage.delete(file.storageId);
		await ctx.db.delete(file._id);
		return;
	}

	await ctx.db.patch(file._id, {
		refCount: file.refCount - 1
	});
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

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const publication = await ctx.db
			.query('publications')
			.withIndex('by_slug', (q) => q.eq('slug', slug))
			.unique();

		if (!publication || publication.status !== 'published') return null;

		const profile = await ctx.db
			.query('profiles')
			.withIndex('by_userId', (q) => q.eq('userId', publication.authorId))
			.unique();
		const authUser = await authComponent.getAnyUserById(ctx, publication.authorId);

		return {
			id: publication._id,
			slug: publication.slug ?? null,
			title: publication.title ?? 'Untitled publication',
			description: publication.description ?? null,
			tags: publication.tags ?? [],
			publishedAt: publication.publishedAt ?? null,
			updatedAt: publication.updatedAt,
			coverUrl: await publicationCoverUrl(ctx, publication.coverFileId),
			pdfUrl: await publicationPdfUrl(ctx, publication.pdfFileId),
			author: {
				handle: profile?.handle ?? null,
				name: authUser?.name ?? null,
				bio: profile?.bio ?? null,
				location: profile?.location ?? null,
				image: authUser?.image ?? null
			}
		};
	}
});

export const listForProfile = query({
	args: { handle: v.string() },
	handler: async (ctx, { handle }) => {
		const profile = await findProfileByHandle(ctx, handle);
		if (!profile) return [];

		const authUser = await authComponent.safeGetAuthUser(ctx);
		const isOwner = authUser?._id === profile.userId;

		const publications = isOwner
			? await ctx.db
					.query('publications')
					.withIndex('by_authorId_and_updatedAt', (q) => q.eq('authorId', profile.userId))
					.order('desc')
					.take(PROFILE_PUBLICATIONS_LIMIT)
			: await ctx.db
					.query('publications')
					.withIndex('by_authorId_and_status_and_updatedAt', (q) =>
						q.eq('authorId', profile.userId).eq('status', 'published')
					)
					.order('desc')
					.take(PROFILE_PUBLICATIONS_LIMIT);

		return await Promise.all(
			publications.map((publication) => presentProfilePublication(ctx, publication))
		);
	}
});

export const createDraft = mutation({
	args: {
		pdfFile: uploadedFileValidator,
		coverFile: uploadedFileValidator
	},
	handler: async (ctx, args) => {
		const { authUser } = await requireAuthorWithProfile(ctx);
		const pdfFileId = await acquireFileForPublication(
			ctx,
			authUser._id,
			args.pdfFile,
			'publication_pdf'
		);
		const coverFileId = await acquireFileForPublication(
			ctx,
			authUser._id,
			args.coverFile,
			'publication_cover'
		);

		const now = Date.now();
		const publicationId = await ctx.db.insert('publications', {
			authorId: authUser._id,
			updatedAt: now,
			pdfFileId,
			coverFileId,
			status: 'draft'
		});

		return { publicationId };
	}
});

export const replaceDraftFiles = mutation({
	args: {
		publicationId: v.id('publications'),
		pdfFile: uploadedFileValidator,
		coverFile: uploadedFileValidator
	},
	handler: async (ctx, args) => {
		const { authUser } = await requireAuthorWithProfile(ctx);
		const publication = await requireOwnedPublication(ctx, args.publicationId, authUser._id);
		if (publication.status !== 'draft') throw new Error('Only draft files can be replaced.');

		const pdfFileId = await acquireFileForPublication(
			ctx,
			authUser._id,
			args.pdfFile,
			'publication_pdf'
		);
		const coverFileId = await acquireFileForPublication(
			ctx,
			authUser._id,
			args.coverFile,
			'publication_cover'
		);

		await ctx.db.patch(args.publicationId, {
			pdfFileId,
			coverFileId,
			updatedAt: Date.now()
		});

		await releaseFileReference(ctx, publication.pdfFileId);
		await releaseFileReference(ctx, publication.coverFileId);

		return { publicationId: args.publicationId };
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
