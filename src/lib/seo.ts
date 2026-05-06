import { env } from '$env/dynamic/public';

export const SITE_NAME = 'Zinegeist';
export const DEFAULT_META_DESCRIPTION =
	'Zinegeist is a quiet home for independent writing, digital zines, essays, and small publications on the open web.';

const FALLBACK_SITE_URL = 'https://zinegeist.com';
const MAX_DESCRIPTION_LENGTH = 160;

function siteOrigin(): string {
	return (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');
}

export function formatMetaTitle(title?: string | null): string {
	const cleanTitle = title?.trim();
	if (!cleanTitle || cleanTitle === SITE_NAME) return SITE_NAME;
	return cleanTitle.includes(SITE_NAME) ? cleanTitle : `${cleanTitle} · ${SITE_NAME}`;
}

export function toMetaDescription(description?: string | null): string {
	const cleanDescription = description?.replace(/\s+/g, ' ').trim() || DEFAULT_META_DESCRIPTION;
	if (cleanDescription.length <= MAX_DESCRIPTION_LENGTH) return cleanDescription;

	const clipped = cleanDescription.slice(0, MAX_DESCRIPTION_LENGTH - 1);
	const lastSpace = clipped.lastIndexOf(' ');
	return `${clipped.slice(0, lastSpace > 80 ? lastSpace : clipped.length).trim()}…`;
}

export function absoluteUrl(pathOrUrl: string): string {
	return new URL(pathOrUrl, `${siteOrigin()}/`).toString();
}
