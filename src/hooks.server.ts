import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import { getSessionCookie } from 'better-auth/cookies';
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server';

const PUBLIC_EXACT = new Set<string>(['/']);
const PUBLIC_PREFIXES = ['/api/auth', '/publication/'];

const isPublic = (pathname: string): boolean => {
	if (PUBLIC_EXACT.has(pathname)) return true;
	if (pathname.startsWith('/profile/')) return true;
	return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const requireAuth: Handle = async ({ event, resolve }) => {
	if (building) return resolve(event);

	const { pathname, search } = event.url;
	if (isPublic(pathname)) return resolve(event);

	const sessionCookie = getSessionCookie(event.request);
	if (sessionCookie) return resolve(event);

	const redirectTo = encodeURIComponent(pathname + search);
	throw redirect(307, `/?signin=1&redirectTo=${redirectTo}`);
};

const setTokenFromCookies: Handle = async ({ event, resolve }) => {
	if (building) return resolve(event);

	const token = getToken(event.cookies);
	event.locals.token = token;

	return withServerConvexToken(token, () => resolve(event));
};

export const handle = sequence(requireAuth, setTokenFromCookies);
