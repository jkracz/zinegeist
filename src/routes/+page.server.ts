import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

export const load = (async () => {
	const client = createConvexHttpClient();
	const [publications, totalPublished] = await Promise.all([
		client.query(api.publications.listRecentPublished, {}),
		client.query(api.publications.countPublished, {})
	]);

	return { publications, totalPublished };
}) satisfies PageServerLoad;
