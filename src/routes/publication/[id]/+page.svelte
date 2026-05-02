<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const publication = $derived(data.publication);
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

	const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
	const dateLabel = $derived(
		publication.publishedAt ? dateFormatter.format(new Date(publication.publishedAt)) : null
	);
</script>

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
						<span class="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
							No cover
						</span>
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
					No description filed for this issue.
				</p>
			{/if}

			<dl
				class="mt-7 grid grid-cols-2 gap-x-8 gap-y-[18px] border-y border-border/70 py-[20px] font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase"
			>
				<div>
					<dt>Filed</dt>
					<dd class="dossier-fact">{dateLabel ?? '—'}</dd>
				</div>
				<div>
					<dt>Tags</dt>
					<dd class="dossier-fact">
						{publication.tags.length > 0 ? publication.tags.join(' · ') : '—'}
					</dd>
				</div>
			</dl>

			<div class="mt-7">
				{#if publication.pdfUrl}
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a class="zg-btn zg-btn-primary" href={publication.pdfUrl} target="_blank" rel="noopener">
						Read now →
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{:else}
					<button class="zg-btn zg-btn-primary" type="button" disabled>Read now →</button>
				{/if}
			</div>

			<footer class="mt-9 border-t border-border/70 pt-7">
				<div class="eyebrow mb-3">About the writer</div>
				<div class="flex items-start gap-4">
					{#if publication.author.image}
						<img
							src={publication.author.image}
							alt={authorName}
							class="size-12 shrink-0 rounded-full border border-border object-cover shadow-sm"
						/>
					{:else}
						<div
							class="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-serif text-base text-ink/70 italic shadow-sm"
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
								<span class="font-mono text-[11px] tracking-[0.08em] text-muted-foreground"
									>@{publication.author.handle}</span
								>
							{/if}
							{#if publication.author.location}
								<span
									class="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase"
								>
									· {publication.author.location}
								</span>
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
