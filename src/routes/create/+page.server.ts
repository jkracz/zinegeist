import { redirect } from '@sveltejs/kit';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

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

	return {
		currentUser: result.authUser,
		profile: result.profile
	};
}) satisfies PageServerLoad;
