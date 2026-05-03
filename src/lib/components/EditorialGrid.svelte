<script lang="ts">
	import { resolve } from '$app/paths';
	import { api } from '$convex/_generated/api';
	import type { FunctionReturnType } from 'convex/server';
	import ZineCard from './ZineCard.svelte';

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
	const featuredTags = $derived(featured?.tags.slice(0, 2).join(' · ') ?? 'Publication');
	const sideStack = $derived(publications.slice(1, 3));
	const tail = $derived(publications.slice(3));

	// Editorial pattern of column-spans for the tail row.
	const SPANS = [6, 3, 3, 4, 4, 4];

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
	<div class="grid auto-rows-[minmax(140px,auto)] grid-cols-12 gap-x-6 gap-y-8">
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
						<div
							class="mt-7 flex items-end justify-between gap-4 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase"
						>
							<span class="truncate">{featuredTags}</span>
							<span class="zg-btn zg-btn-outline shrink-0">Read</span>
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

		{#each tail as publication, i (publication.id)}
			<div class="tail-card min-w-0" style:--span={SPANS[i] ?? 4}>
				<ZineCard {publication} mini={(SPANS[i] ?? 4) < 5} href={pubHref(publication)} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.tail-card {
		grid-column: span var(--span);
	}

	@media (max-width: 48rem) {
		.tail-card {
			grid-column: span 12;
		}
	}
</style>
