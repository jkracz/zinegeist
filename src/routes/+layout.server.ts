import {
	createConvexHttpClient,
	getAuthState
} from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { LayoutServerLoad } from './$types';
import { api } from '$convex/_generated/api';
import { building } from '$app/environment';

export const load = (async ({ locals }) => {
	if (building) {
		return {
			authState: { isAuthenticated: false },
			currentUser: null,
			profile: null
		};
	}

	const authState = getAuthState();
	const token = locals.token;
	if (!token) {
		return { authState, currentUser: null, profile: null };
	}

	try {
		const client = createConvexHttpClient({ token });
		const result = await client.query(api.profiles.getMyProfile, {});
		return {
			authState,
			currentUser: result?.authUser ?? null,
			profile: result?.profile ?? null
		};
	} catch {
		return { authState, currentUser: null, profile: null };
	}
}) satisfies LayoutServerLoad;
