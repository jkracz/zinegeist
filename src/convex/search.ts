import { v } from 'convex/values';
import { query, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';
import type { Doc, Id } from './_generated/dataModel';

const SEARCH_LIMIT = 5;
const LATEST_LIMIT = 3;

type PublicationResult = {
	id: Id<'publications'>;
	title: string;
	slug: string;
	coverUrl: string | null;
	authorHandle: string | null;
	authorName: string | null;
};

type ProfileResult = {
	handle: string;
	name: string | null;
	image: string | null;
	bio: string | null;
};

async function publicationCoverUrl(
	ctx: QueryCtx,
	coverFileId: Id<'files'>
): Promise<string | null> {
	const file = await ctx.db.get(coverFileId);
	if (!file) return null;
	return await ctx.storage.getUrl(file.storageId);
}

async function presentPublication(
	ctx: QueryCtx,
	publication: Doc<'publications'>
): Promise<PublicationResult | null> {
	if (!publication.slug || !publication.title) return null;

	const profile = await ctx.db
		.query('profiles')
		.withIndex('by_userId', (q) => q.eq('userId', publication.authorId))
		.unique();
	const authUser = await authComponent.getAnyUserById(ctx, publication.authorId);

	return {
		id: publication._id,
		title: publication.title,
		slug: publication.slug,
		coverUrl: await publicationCoverUrl(ctx, publication.coverFileId),
		authorHandle: profile?.handle ?? null,
		authorName: authUser?.name ?? null
	};
}

async function presentProfile(ctx: QueryCtx, profile: Doc<'profiles'>): Promise<ProfileResult> {
	const authUser = await authComponent.getAnyUserById(ctx, profile.userId);
	return {
		handle: profile.handle,
		name: profile.name ?? authUser?.name ?? null,
		image: authUser?.image ?? null,
		bio: profile.bio ?? null
	};
}

function dedupeProfiles(profiles: Doc<'profiles'>[]): Doc<'profiles'>[] {
	const seen = new Set<string>();
	const unique: Doc<'profiles'>[] = [];
	for (const p of profiles) {
		if (seen.has(p._id)) continue;
		seen.add(p._id);
		unique.push(p);
	}
	return unique;
}

export const searchPublications = query({
	args: { query: v.string() },
	handler: async (ctx, { query: q }) => {
		const trimmed = q.trim();
		if (!trimmed) return [];

		const publications = await ctx.db
			.query('publications')
			.withSearchIndex('search_title', (s) => s.search('title', trimmed).eq('status', 'published'))
			.take(SEARCH_LIMIT);

		const presented = await Promise.all(publications.map((p) => presentPublication(ctx, p)));
		return presented.filter((p): p is PublicationResult => p !== null);
	}
});

export const searchProfiles = query({
	args: { query: v.string() },
	handler: async (ctx, { query: q }) => {
		const trimmed = q.trim();
		if (!trimmed) return [];

		const [byHandle, byName] = await Promise.all([
			ctx.db
				.query('profiles')
				.withSearchIndex('search_handle', (s) => s.search('handle', trimmed))
				.take(SEARCH_LIMIT),
			ctx.db
				.query('profiles')
				.withSearchIndex('search_name', (s) => s.search('name', trimmed))
				.take(SEARCH_LIMIT)
		]);

		const merged = dedupeProfiles([...byHandle, ...byName]).slice(0, SEARCH_LIMIT);
		return await Promise.all(merged.map((p) => presentProfile(ctx, p)));
	}
});

export const latestSuggestions = query({
	args: {},
	handler: async (ctx) => {
		const [publications, profiles] = await Promise.all([
			ctx.db
				.query('publications')
				.withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
				.order('desc')
				.take(LATEST_LIMIT),
			ctx.db.query('profiles').order('desc').take(LATEST_LIMIT)
		]);

		const presentedPublications = (
			await Promise.all(publications.map((p) => presentPublication(ctx, p)))
		).filter((p): p is PublicationResult => p !== null);
		const presentedProfiles = await Promise.all(profiles.map((p) => presentProfile(ctx, p)));

		return {
			publications: presentedPublications,
			profiles: presentedProfiles
		};
	}
});
