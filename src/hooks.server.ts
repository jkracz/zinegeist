import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { getSessionCookie } from 'better-auth/cookies';
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server';
import { getPostHogClient } from '$lib/server/posthog';

const POSTHOG_PROXY_TIMEOUT_MS = 5000;
const SENSITIVE_PROXY_HEADERS = [
	'cookie',
	'authorization',
	'set-cookie',
	'x-api-key',
	'x-auth-token',
	'x-csrf-token'
];

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
	if (pathname === '/ingest' || pathname.startsWith('/ingest/')) {
		const useAssetHost =
			pathname.startsWith('/ingest/static/') || pathname.startsWith('/ingest/array/');
		const hostname = useAssetHost ? 'us-assets.i.posthog.com' : 'us.i.posthog.com';

		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace(/^\/ingest/, '');

		const headers = new Headers(event.request.headers);
		for (const header of SENSITIVE_PROXY_HEADERS) {
			headers.delete(header);
		}
		headers.set('host', hostname);
		headers.set('accept-encoding', '');

		const clientIp = event.request.headers.get('x-forwarded-for') || event.getClientAddress();
		if (clientIp) headers.set('x-forwarded-for', clientIp);

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), POSTHOG_PROXY_TIMEOUT_MS);

		try {
			return await fetch(url.toString(), {
				method: event.request.method,
				headers,
				body: event.request.body,
				signal: controller.signal,
				// @ts-expect-error - duplex is required for streaming request bodies
				duplex: 'half'
			});
		} catch (error) {
			console.warn('PostHog proxy request failed.', error);
			const timedOut = error instanceof DOMException && error.name === 'AbortError';
			return new Response(timedOut ? 'PostHog proxy timed out.' : 'PostHog proxy failed.', {
				status: timedOut ? 504 : 502
			});
		} finally {
			clearTimeout(timeout);
		}
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
