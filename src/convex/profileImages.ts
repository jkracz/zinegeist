import type { Doc } from './_generated/dataModel';
import type { QueryCtx } from './_generated/server';

export async function resolveProfileImageUrl(
	ctx: QueryCtx,
	profile: Pick<Doc<'profiles'>, 'profileImageFileId'> | null,
	fallback: string | null | undefined
): Promise<string | null> {
	if (!profile?.profileImageFileId) return fallback ?? null;
	const file = await ctx.db.get(profile.profileImageFileId);
	if (!file) return fallback ?? null;
	return (await ctx.storage.getUrl(file.storageId)) ?? fallback ?? null;
}
