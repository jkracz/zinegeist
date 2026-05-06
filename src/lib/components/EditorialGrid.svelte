<script lang="ts">
	import { resolve } from '$app/paths';
	import { api } from '$convex/_generated/api';
	import type { FunctionReturnType } from 'convex/server';
	import ZineCard from './ZineCard.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type HomePublication = FunctionReturnType<typeof api.publications.listRecentPublished>[number];
	type Props = { publications: HomePublication[] };
	let { publications }: Props = $props();

	const featured = $derived(publications[0]);
	const featuredHref = $derived(
		featured?.slug ? resolve('/publication/[id]', { id: featured.slug }) : '#'
	);
	const featuredDate = $derived(
		featured
			? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(
					new Date(featured.publishedAt ?? featured.updatedAt)
				)
			: ''
	);
	const featuredAuthor = $derived(
		featured?.author.name ?? featured?.author.handle ?? 'Zinegeist writer'
	);
	const featuredTags = $derived(featured?.tags.slice(0, 2).join(' · ') ?? '');
	const sideStack = $derived(publications.slice(1, 3));
	const tail = $derived(publications.slice(3));

	const pubHref = (publication: HomePublication) =>
		publication.slug ? resolve('/publication/[id]', { id: publication.slug }) : '#';
</script>

{#if publications.length === 0}
	<div class="border-y border-border py-14">
		<p class="m-0 max-w-[42ch] font-serif text-[28px] leading-[1.2] tracking-[-0.01em] text-ink">
			The shelf is waiting for its first publication.
		</p>
	</div>
{:else}
	<!-- Editorial featured row: hero + side stack -->
	<div class="grid grid-cols-12 gap-x-6 gap-y-8">
		<!-- Featured wide hero card -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="col-span-7 block text-inherit no-underline max-lg:col-span-12" href={featuredHref}>
			<div class="relative aspect-[5/3] overflow-hidden rounded-[2px] shadow-page">
				<div
					class="absolute inset-0 grid grid-cols-[1fr_0.78fr] bg-paper-warm-2 max-sm:grid-cols-1"
				>
					<div class="flex min-w-0 flex-col justify-between px-9 py-10 max-sm:px-6 max-sm:py-7">
						<div class="eyebrow">Newest · {featuredDate}</div>
						<div class="min-w-0">
							<div class="mb-2 font-serif text-[20px] text-primary italic">by {featuredAuthor}</div>
							<div
								class="line-clamp-3 font-serif text-[clamp(38px,5vw,64px)] leading-[1.05] tracking-[-0.025em] text-balance [overflow-wrap:anywhere] text-ink"
							>
								{featured.title}
							</div>
						</div>
						<div class="eyebrow mt-7 flex items-end justify-between gap-4">
							<span class="truncate">{featuredTags}</span>
							<span class={cn(buttonVariants({ variant: 'outline' }), 'shrink-0')}>Read</span>
						</div>
					</div>
					<div class="relative border-l border-border max-sm:hidden">
						{#if featured.coverUrl}
							<img
								src={featured.coverUrl}
								alt="{featured.title} cover"
								class="absolute inset-0 size-full object-cover"
							/>
						{:else}
							<div
								class="absolute inset-0 bg-[linear-gradient(160deg,var(--paper-warm-1),var(--paper-warm-3))]"
							></div>
						{/if}
					</div>
				</div>
				<div class="cover-edge"></div>
			</div>
		</a>

		<!-- Side stack of 2 cards -->
		<div class="col-span-5 grid grid-cols-2 content-start gap-x-6 gap-y-8 max-lg:col-span-12">
			{#each sideStack as publication (publication.id)}
				<ZineCard {publication} mini href={pubHref(publication)} />
			{/each}
		</div>
	</div>

	{#if tail.length > 0}
		<!-- Shelf tail: uniform browse grid -->
		<div class="mt-16 border-t border-border pt-12">
			<div class="eyebrow mb-9">More on the shelf</div>
			<div
				class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] items-start gap-x-8 gap-y-14"
			>
				{#each tail as publication (publication.id)}
					<ZineCard {publication} mini href={pubHref(publication)} />
				{/each}
			</div>
		</div>
	{/if}
{/if}
