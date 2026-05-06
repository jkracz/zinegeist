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
			profile: null,
			billingPlan: Promise.resolve(null)
		};
	}

	const authState = getAuthState();
	const token = locals.token;
	if (!token) {
		return { authState, currentUser: null, profile: null, billingPlan: Promise.resolve(null) };
	}

	try {
		const client = createConvexHttpClient({ token });
		const result = await client.query(api.profiles.getMyProfile, {});
		const billingPlan = client.query(api.billing.getMyPlan, {}).catch(() => null);
		return {
			authState,
			currentUser: result?.authUser ?? null,
			profile: result?.profile ?? null,
			billingPlan
		};
	} catch {
		return { authState, currentUser: null, profile: null, billingPlan: Promise.resolve(null) };
	}
}) satisfies LayoutServerLoad;
