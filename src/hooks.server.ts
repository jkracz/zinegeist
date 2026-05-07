import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { getSessionCookie } from 'better-auth/cookies';
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server';
import { getPostHogClient } from '$lib/server/posthog';

const PUBLIC_EXACT = new Set<string>(['/', '/pricing']);
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

const posthogProxy: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	if (pathname.startsWith('/ingest')) {
		const useAssetHost =
			pathname.startsWith('/ingest/static/') || pathname.startsWith('/ingest/array/');
		const hostname = useAssetHost ? 'us-assets.i.posthog.com' : 'us.i.posthog.com';

		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace(/^\/ingest/, '');

		const headers = new Headers(event.request.headers);
		headers.set('host', hostname);
		headers.set('accept-encoding', '');

		const clientIp = event.request.headers.get('x-forwarded-for') || event.getClientAddress();
		if (clientIp) headers.set('x-forwarded-for', clientIp);

		return fetch(url.toString(), {
			method: event.request.method,
			headers,
			body: event.request.body,
			// @ts-expect-error - duplex is required for streaming request bodies
			duplex: 'half'
		});
	}
	return resolve(event);
};

export const handle = sequence(posthogProxy, requireAuth, setTokenFromCookies);

export const handleError: HandleServerError = async ({ error, status, message }) => {
	const posthog = getPostHogClient();
	if (posthog) {
		posthog.capture({
			distinctId: 'server',
			event: 'server_error',
			properties: {
				error: error instanceof Error ? error.message : String(error),
				status,
				message
			}
		});
	}
	return { message, status };
};
