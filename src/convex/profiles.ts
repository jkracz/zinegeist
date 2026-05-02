import { v } from 'convex/values';
import { query, mutation, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';

const HANDLE_RE = /^[a-z0-9-]{3,30}$/;

function normalizeHandle(input: string): string {
	return input.trim().toLowerCase();
}

function assertValidHandle(handle: string): void {
	if (!HANDLE_RE.test(handle)) {
		throw new Error('Handle must be 3–30 characters, lowercase letters, numbers, or hyphens only.');
	}
}

async function findProfileByUserId(ctx: QueryCtx, userId: string) {
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

export const getMyProfile = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) return null;
		const profile = await findProfileByUserId(ctx, authUser._id);
		return {
			authUser: {
				id: authUser._id,
				name: authUser.name ?? null,
				email: authUser.email ?? null,
				image: authUser.image ?? null
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
			image: authUser?.image ?? null,
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
