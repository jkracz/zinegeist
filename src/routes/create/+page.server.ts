import { redirect } from '@sveltejs/kit';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';
import type { Id } from '$convex/_generated/dataModel';

export const load = (async ({ locals, url }) => {
	if (!locals.token) {
		throw redirect(307, `/?signin=1&redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const client = createConvexHttpClient({ token: locals.token });
	const result = await client.query(api.profiles.getMyProfile, {});

	if (!result?.authUser) {
		throw redirect(307, `/?signin=1&redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	if (!result.profile) {
		throw redirect(307, '/onboarding/handle');
	}

	const draftParam = url.searchParams.get('draft');
	let resumeDraft: Awaited<
		ReturnType<typeof client.query<typeof api.publications.getDraftForResume>>
	> | null = null;
	if (draftParam) {
		try {
			resumeDraft = await client.query(api.publications.getDraftForResume, {
				publicationId: draftParam as Id<'publications'>
			});
		} catch {
			resumeDraft = null;
		}
	}

	const shelfStatus = await client.query(api.publications.getMyShelfStatus, {});
	const shelfFull = Boolean(shelfStatus?.isFull) && !resumeDraft;

	return {
		currentUser: result.authUser,
		profile: result.profile,
		resumeDraft,
		shelfFull
	};
}) satisfies PageServerLoad;
