import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { RequestHandler } from './$types';
import { api } from '$convex/_generated/api';
import { absoluteUrl } from '$lib/seo';

const STATIC_ROUTES = ['/', '/about', '/pricing', '/privacy', '/terms'];

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function urlEntry(path: string, updatedAt?: number | null): string {
	const lastmod = updatedAt ? `\n\t\t<lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : '';
	return `\t<url>\n\t\t<loc>${escapeXml(absoluteUrl(path))}</loc>${lastmod}\n\t</url>`;
}

export const GET: RequestHandler = async () => {
	const client = createConvexHttpClient();
	const entries = await client.query(api.publications.listSitemapEntries, {});

	const urls = [
		...STATIC_ROUTES.map((path) => urlEntry(path)),
		...entries.profiles.map((profile) =>
			urlEntry(`/profile/${encodeURIComponent(profile.handle)}`, profile.updatedAt)
		),
		...entries.publications.map((publication) =>
			urlEntry(`/publication/${encodeURIComponent(publication.slug)}`, publication.updatedAt)
		)
	].join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
		{
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=0, s-maxage=3600'
			}
		}
	);
};
