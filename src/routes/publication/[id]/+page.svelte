<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import Share2 from '@lucide/svelte/icons/share-2';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import PublicationViewer from '$lib/components/pdf/PublicationViewer.svelte';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/Seo.svelte';
	import { sharePublication } from '$lib/utils/share';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let readerOpen = $state(false);

	const publication = $derived(data.publication);

	function share() {
		if (!browser) return;
		sharePublication({
			title: publication.title,
			url: window.location.href
		});
	}
	const authorName = $derived(publication.author.name?.trim() || 'Writer');
	const authorHref = $derived(
		publication.author.handle
			? resolve('/profile/[handle]', { handle: publication.author.handle })
			: null
	);
	const authorInitials = $derived(
		authorName
			.split(' ')
			.filter(Boolean)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.slice(0, 2)
			.join('')
	);

	const dateFormatter = new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
	const dateLabel = $derived(
		publication.publishedAt ? dateFormatter.format(new Date(publication.publishedAt)) : null
	);

	const pageDescription = $derived(
		publication.description ?? `${publication.title} by ${authorName} on Zinegeist`
	);
</script>

<Seo
	title={publication.title}
	description={pageDescription}
	type="article"
	image={publication.coverUrl}
	imageAlt="{publication.title} cover"
	noindex={publication.status !== 'published'}
/>

<SectionBar
	crumbs={[
		'Writer',
		authorHref ? { label: authorName, href: authorHref } : authorName,
		publication.title
	]}
/>

<div class="px-6 pb-24 md:px-12">
	<div
		class="flex flex-col items-stretch gap-10 pt-10 md:grid md:grid-cols-[auto_minmax(0,1fr)] md:items-stretch md:gap-x-[72px] md:gap-y-0 md:pt-14 md:pb-6"
	>
		<div class="w-full md:sticky md:top-24 md:block md:w-auto md:self-start">
			<div class="mx-auto w-fit md:mx-0">
				{#if publication.tags.length > 0}
					<div class="eyebrow-sm mb-3 flex flex-wrap gap-x-2 gap-y-1">
						{#each publication.tags as tag, i (tag)}
							<span>{tag}</span>
							{#if i < publication.tags.length - 1}
								<span aria-hidden="true">·</span>
							{/if}
						{/each}
					</div>
				{/if}
				{#if publication.coverUrl}
					<img
						src={publication.coverUrl}
						alt="{publication.title} cover"
						class="block h-auto max-h-[55svh] w-auto max-w-full rounded-[2px] shadow-page md:max-h-[78svh] md:max-w-[40vw]"
					/>
				{:else}
					<div
						class="flex aspect-[3/4] w-[min(220px,72vw)] items-end rounded-[2px] bg-paper-warm-2 p-4 shadow-page md:w-[clamp(220px,26vw,340px)]"
					>
						<span class="eyebrow-sm">No cover</span>
					</div>
				{/if}
			</div>
		</div>

		<article class="flex w-full min-w-0 flex-col">
			<h1
				class="font-serif text-[36px] leading-[1.04] font-normal tracking-[-0.025em] text-balance [overflow-wrap:anywhere] text-ink md:text-[56px]"
			>
				{publication.title}
			</h1>

			<div class="mt-2 font-serif text-base text-muted-foreground italic md:text-lg">
				by
				{#if authorHref}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="text-primary underline decoration-1 underline-offset-[3px]" href={authorHref}>
						{authorName}
					</a>
				{:else}
					{authorName}
				{/if}
			</div>

			{#if publication.description}
				<p
					class="mt-6 max-w-[58ch] font-serif text-base leading-[1.6] text-foreground md:text-[17px]"
				>
					{publication.description}
				</p>
			{:else}
				<p
					class="mt-6 max-w-[58ch] font-serif text-base leading-[1.6] text-muted-foreground italic"
				>
					No description added for this publication.
				</p>
			{/if}

			<dl
				class="eyebrow-sm mt-7 grid grid-cols-2 gap-x-8 gap-y-[18px] border-y border-border/70 py-[20px]"
			>
				<div>
					<dt>Published</dt>
					<dd class="dossier-fact">{dateLabel ?? 'Not yet'}</dd>
				</div>
				<div>
					<dt>Pages</dt>
					<dd class="dossier-fact">
						{publication.pageCount ?? '·'}
					</dd>
				</div>
			</dl>

			<div class="mt-7 flex flex-wrap items-center gap-3">
				{#if publication.pdfUrl}
					<Button type="button" onclick={() => (readerOpen = true)}>Read now</Button>
				{:else}
					<Button type="button" disabled>Read now</Button>
				{/if}
				<Button variant="outline" type="button" onclick={share} aria-label="Share publication">
					<Share2 class="size-4" />
					Share
				</Button>
			</div>

			<footer class="mt-9 border-t border-border/70 pt-7">
				<div class="eyebrow mb-3">About the author</div>
				<div class="flex items-start gap-4">
					{#if publication.author.image}
						<img
							src={publication.author.image}
							alt={authorName}
							class="size-12 shrink-0 rounded-full border border-border object-cover"
						/>
					{:else}
						<div
							class="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-serif text-base text-ink/70 italic"
						>
							{authorInitials}
						</div>
					{/if}
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
							{#if authorHref}
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a
									class="font-serif text-lg font-medium text-ink underline-offset-2 hover:underline"
									href={authorHref}
								>
									{authorName}
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{:else}
								<span class="font-serif text-lg font-medium text-ink">{authorName}</span>
							{/if}
							{#if publication.author.handle}
								<span class="font-mono text-[11px] text-muted-foreground"
									>@{publication.author.handle}</span
								>
							{/if}
							{#if publication.author.location}
								<span class="eyebrow-sm">· {publication.author.location}</span>
							{/if}
						</div>
						{#if publication.author.bio}
							<p class="mt-1.5 max-w-[56ch] font-serif text-sm leading-[1.55] text-foreground">
								{publication.author.bio}
							</p>
						{/if}
					</div>
				</div>
			</footer>
		</article>
	</div>
</div>

{#if publication.pdfUrl}
	<PublicationViewer
		pdfUrl={publication.pdfUrl}
		open={readerOpen}
		onClose={() => (readerOpen = false)}
		onShare={share}
	/>
{/if}

<style>
	.dossier-fact {
		font-family: var(--font-serif);
		text-transform: none;
		letter-spacing: 0;
		font-size: 14px;
		color: var(--ink);
		margin-top: 4px;
	}
</style>
