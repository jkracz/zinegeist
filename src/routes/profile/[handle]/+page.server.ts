import { error } from '@sveltejs/kit';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

export const load = (async ({ params, locals }) => {
	const handle = params.handle;
	const publicClient = createConvexHttpClient();
	const profileView = await publicClient.query(api.profiles.getProfileByHandle, { handle });

	if (!profileView) {
		throw error(404, 'Profile not found');
	}

	let isOwnProfile = false;
	let publicationClient = publicClient;
	if (locals.token) {
		const authedClient = createConvexHttpClient({ token: locals.token });
		const me = await authedClient.query(api.profiles.getMyProfile, {});
		isOwnProfile = me?.authUser?.id === profileView.userId;
		publicationClient = authedClient;
	}

	const publications = publicationClient.query(api.publications.listForProfile, { handle });
	const shelfStatus =
		isOwnProfile && locals.token
			? publicationClient.query(api.publications.getMyShelfStatus, {})
			: Promise.resolve(null);

	return { profileView, isOwnProfile, publications, shelfStatus };
}) satisfies PageServerLoad;
