<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import HeroStage from '$lib/components/HeroStage.svelte';
	import EditorialGrid from '$lib/components/EditorialGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const CREATE = resolve('/create');
	const totalLabel = $derived(
		data.totalPublished === 1 ? '1 publication' : `${data.totalPublished} publications`
	);
</script>

<SectionBar crumbs={['Discover']}>
	{#snippet right()}
		<span class="eyebrow">{totalLabel}</span>
	{/snippet}
</SectionBar>

<div class="px-12 pb-24">
	<!-- HERO -->
	<section
		class="hero relative grid min-h-[calc(100vh-130px)] grid-cols-[1.15fr_1fr] items-center gap-16 pt-16 pb-20"
	>
		<div>
			<div class="eyebrow mb-[22px]">A small press, on the open web</div>
			<h1
				class="font-serif text-[clamp(48px,6.2vw,96px)] leading-[0.98] font-normal tracking-[-0.025em] text-ink"
			>
				A quiet home for<br />
				<em class="font-light text-primary italic">independent</em> writing.
			</h1>
			<p class="my-7 mb-9 max-w-[44ch] font-serif text-[19px] leading-[1.55] text-foreground">
				Zinegeist is for writers who still believe a paragraph deserves breathing room. Publish your
				writing, build a small shelf, and let readers find you the way they used to find a thin
				yellow book in the back of a shop.
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<a class="zg-btn zg-btn-primary" href="#discovery">Browse the shelf</a>
				<a class="zg-btn zg-btn-outline" href={CREATE}>Publish your own</a>
				<span class="ml-1 font-mono text-[11px] text-muted-foreground">
					No AI · No doomscrolling · Just stories
				</span>
			</div>
		</div>
		<HeroStage />
	</section>

	<!-- DISCOVERY -->
	<section id="discovery">
		<div class="mb-9 flex items-end justify-between border-b border-border pt-14 pb-7">
			<h2 class="font-serif text-[44px] font-normal tracking-[-0.015em] text-ink">
				The latest <em class="text-primary italic">shelf</em>
			</h2>
		</div>

		<EditorialGrid publications={data.publications} />
	</section>
</div>
