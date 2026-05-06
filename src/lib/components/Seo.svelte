<script lang="ts">
	import { page } from '$app/state';
	import {
		DEFAULT_META_DESCRIPTION,
		SITE_NAME,
		absoluteUrl,
		formatMetaTitle,
		toMetaDescription
	} from '$lib/seo';

	type Props = {
		title?: string;
		description?: string | null;
		type?: 'website' | 'article' | 'profile';
		image?: string | null;
		imageAlt?: string | null;
		noindex?: boolean;
	};

	let {
		title,
		description = DEFAULT_META_DESCRIPTION,
		type = 'website',
		image = null,
		imageAlt = null,
		noindex = false
	}: Props = $props();

	const metaTitle = $derived(formatMetaTitle(title));
	const metaDescription = $derived(toMetaDescription(description));
	const canonicalUrl = $derived(absoluteUrl(page.url.pathname));
	const imageUrl = $derived(image ? absoluteUrl(image) : null);
	const twitterCard = $derived(imageUrl ? 'summary_large_image' : 'summary');
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={canonicalUrl} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:url" content={canonicalUrl} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		{#if imageAlt}
			<meta property="og:image:alt" content={imageAlt} />
		{/if}
	{/if}

	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={metaDescription} />
	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
	{/if}
</svelte:head>
