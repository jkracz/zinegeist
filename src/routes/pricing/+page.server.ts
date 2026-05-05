import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

export const load = (async ({ locals }) => {
	const client = locals.token
		? createConvexHttpClient({ token: locals.token })
		: createConvexHttpClient();
	const products = await client.query(api.polar.getConfiguredProducts, {});

	return {
		products,
		isAuthenticated: Boolean(locals.token)
	};
}) satisfies PageServerLoad;
