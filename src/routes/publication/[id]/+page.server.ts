import { error } from '@sveltejs/kit';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { PageServerLoad } from './$types';
import { api } from '$convex/_generated/api';

export const load = (async ({ params, locals }) => {
	const slug = params.id;
	const client = locals.token
		? createConvexHttpClient({ token: locals.token })
		: createConvexHttpClient();
	const publication = await client.query(api.publications.getBySlug, { slug });

	if (!publication) {
		throw error(404, 'Publication not found');
	}

	return { publication };
}) satisfies PageServerLoad;
