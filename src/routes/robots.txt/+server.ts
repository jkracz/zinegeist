import type { RequestHandler } from './$types';
import { absoluteUrl } from '$lib/seo';

export const GET: RequestHandler = async () =>
	new Response(
		[
			'User-agent: *',
			'Allow: /',
			'Disallow: /create',
			'Disallow: /onboarding',
			`Sitemap: ${absoluteUrl('/sitemap.xml')}`
		].join('\n'),
		{
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'public, max-age=0, s-maxage=3600'
			}
		}
	);
