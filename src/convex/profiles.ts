import { v } from 'convex/values';
import { query, mutation, type MutationCtx, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';
import { resolveProfileImageUrl } from './profileImages';
import type { Id } from './_generated/dataModel';

const HANDLE_RE = /^[a-z0-9-]{3,30}$/;
const MAX_FILE_NAME_LENGTH = 240;
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const PROFILE_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

type AuthedCtx = QueryCtx | MutationCtx;
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

function normalizeHandle(input: string): string {
	return input.trim().toLowerCase();
}

function assertValidHandle(handle: string): void {
	if (!HANDLE_RE.test(handle)) {
		throw new Error('Handle must be 3–30 characters, lowercase letters, numbers, or hyphens only.');
	}
}

async function findProfileByUserId(ctx: AuthedCtx, userId: string) {
	return ctx.db
		.query('profiles')
		.withIndex('by_userId', (q) => q.eq('userId', userId))
		.unique();
}

async function findProfileByHandle(ctx: QueryCtx, handle: string) {
	return ctx.db
		.query('profiles')
		.withIndex('by_handle', (q) => q.eq('handle', handle))
		.unique();
}

function cleanOptionalText(input: string, maxLength: number): string | undefined {
	const cleaned = input.trim().replace(/\s+/g, ' ');
	return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function cleanFileName(input: string): string {
	return cleanOptionalText(input, MAX_FILE_NAME_LENGTH) ?? 'profile-image';
}

function cleanMimeType(input: string | undefined): string {
	return cleanOptionalText(input ?? '', 120)?.toLowerCase() ?? 'application/octet-stream';
}

async function acquireProfileImageFile(
	ctx: MutationCtx,
	uploaderId: string,
	file: UploadedFileInput
): Promise<Id<'files'>> {
	const metadata = await ctx.db.system.get('_storage', file.storageId);
	if (!metadata) throw new Error('Uploaded file not found.');

	const mimeType = cleanMimeType(metadata.contentType ?? file.mimeType);
	if (!PROFILE_IMAGE_MIME_TYPES.has(mimeType)) {
		throw new Error('Profile picture must be a JPEG, PNG, WebP, or GIF.');
	}
	if (metadata.size > MAX_PROFILE_IMAGE_SIZE) {
		throw new Error('Profile pictures can be up to 5 MB.');
	}

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
		kind: 'profile_image',
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

export const getMyProfile = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) return null;
		const profile = await findProfileByUserId(ctx, authUser._id);
		const image = profile
			? await resolveProfileImageUrl(ctx, profile, authUser.image)
			: (authUser.image ?? null);
		return {
			authUser: {
				id: authUser._id,
				name: authUser.name ?? null,
				email: authUser.email ?? null,
				image
			},
			profile: profile
				? {
						handle: profile.handle,
						bio: profile.bio ?? null,
						location: profile.location ?? null,
						links: profile.links ?? []
					}
				: null
		};
	}
});

export const getProfileByHandle = query({
	args: { handle: v.string() },
	handler: async (ctx, { handle }) => {
		const normalized = normalizeHandle(handle);
		const profile = await findProfileByHandle(ctx, normalized);
		if (!profile) return null;

		const authUser = await authComponent.getAnyUserById(ctx, profile.userId);

		return {
			handle: profile.handle,
			bio: profile.bio ?? null,
			location: profile.location ?? null,
			links: profile.links ?? [],
			name: authUser?.name ?? null,
			image: await resolveProfileImageUrl(ctx, profile, authUser?.image),
			userId: profile.userId
		};
	}
});

export const isHandleAvailable = query({
	args: { handle: v.string() },
	handler: async (ctx, { handle }) => {
		const normalized = normalizeHandle(handle);
		if (!HANDLE_RE.test(normalized)) {
			return { ok: false, reason: 'invalid' as const };
		}
		const existing = await findProfileByHandle(ctx, normalized);
		return existing ? { ok: false, reason: 'taken' as const } : { ok: true as const };
	}
});

export const createProfile = mutation({
	args: {
		handle: v.string(),
		bio: v.optional(v.string()),
		location: v.optional(v.string()),
		links: v.optional(v.array(v.object({ label: v.string(), url: v.string() })))
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) throw new Error('Not authenticated.');

		const handle = normalizeHandle(args.handle);
		assertValidHandle(handle);

		const existingForUser = await findProfileByUserId(ctx, authUser._id);
		if (existingForUser) throw new Error('Profile already exists.');

		const taken = await findProfileByHandle(ctx, handle);
		if (taken) throw new Error('Handle is already taken.');

		await ctx.db.insert('profiles', {
			userId: authUser._id,
			handle,
			name: authUser.name ?? undefined,
			bio: args.bio,
			location: args.location,
			links: args.links
		});

		return { handle };
	}
});

export const updateProfile = mutation({
	args: {
		handle: v.optional(v.string()),
		bio: v.optional(v.string()),
		location: v.optional(v.string()),
		links: v.optional(v.array(v.object({ label: v.string(), url: v.string() })))
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) throw new Error('Not authenticated.');

		const profile = await findProfileByUserId(ctx, authUser._id);
		if (!profile) throw new Error('Profile not found.');

		const patch: Partial<{
			handle: string;
			name: string | undefined;
			bio: string | undefined;
			location: string | undefined;
			links: { label: string; url: string }[] | undefined;
		}> = {};

		const currentName = authUser.name ?? undefined;
		if (currentName !== profile.name) {
			patch.name = currentName;
		}

		if (args.handle !== undefined) {
			const handle = normalizeHandle(args.handle);
			assertValidHandle(handle);
			if (handle !== profile.handle) {
				const taken = await findProfileByHandle(ctx, handle);
				if (taken && taken._id !== profile._id) {
					throw new Error('Handle is already taken.');
				}
				patch.handle = handle;
			}
		}

		if (args.bio !== undefined) patch.bio = args.bio.trim() || undefined;
		if (args.location !== undefined) patch.location = args.location.trim() || undefined;
		if (args.links !== undefined) {
			const cleaned = args.links
				.map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
				.filter((l) => l.label && l.url);
			patch.links = cleaned.length > 0 ? cleaned : undefined;
		}

		await ctx.db.patch(profile._id, patch);
		return { handle: patch.handle ?? profile.handle };
	}
});

export const generateProfileImageUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) throw new Error('Not authenticated.');
		const profile = await findProfileByUserId(ctx, authUser._id);
		if (!profile) throw new Error('Profile not found.');
		return ctx.storage.generateUploadUrl();
	}
});

export const updateProfileImage = mutation({
	args: {
		file: uploadedFileValidator
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) throw new Error('Not authenticated.');

		const profile = await findProfileByUserId(ctx, authUser._id);
		if (!profile) throw new Error('Profile not found.');

		const profileImageFileId = await acquireProfileImageFile(ctx, authUser._id, args.file);
		await ctx.db.patch(profile._id, { profileImageFileId });

		if (profile.profileImageFileId) {
			await releaseFileReference(ctx, profile.profileImageFileId);
		}

		return { ok: true };
	}
});
