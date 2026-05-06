import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

export const load = (async () => {
	const client = createConvexHttpClient();
	const totalPublished = await client.query(api.publications.countPublished, {});
	const publications = client.query(api.publications.listRecentPublished, {});

	return { publications, totalPublished };
}) satisfies PageServerLoad;
