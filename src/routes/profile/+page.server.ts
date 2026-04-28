import { redirect } from '@sveltejs/kit';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

export const load = (async ({ locals }) => {
	if (!locals.token) {
		throw redirect(307, '/?signin=1&redirectTo=%2Fprofile');
	}

	const client = createConvexHttpClient({ token: locals.token });
	const result = await client.query(api.profiles.getMyProfile, {});

	if (!result?.authUser) {
		throw redirect(307, '/?signin=1&redirectTo=%2Fprofile');
	}

	if (!result.profile) {
		throw redirect(307, '/onboarding/handle');
	}

	throw redirect(307, `/profile/${result.profile.handle}`);
}) satisfies PageServerLoad;
