<script lang="ts">
	import { resolve } from '$app/paths';
	import { ZINES } from '$lib/data/zines';
	import { SectionBar, HeroStage, EditorialGrid } from '$lib/components/zinegeist';

	const CREATE = resolve('/create');
</script>

<SectionBar crumbs={['Discover', 'Spring · 026']}>
	{#snippet right()}
		<span class="eyebrow">8 zines on the shelf this season</span>
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
				Zinegeist is for writers who still believe a paragraph deserves breathing room. Publish a
				zine, build a small shelf, and let readers find you the way they used to find a thin yellow
				book in the back of a shop.
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<a class="zg-btn zg-btn-primary" href="#discovery">
					Discover this season's zines
					<span aria-hidden="true">↓</span>
				</a>
				<a class="zg-btn zg-btn-outline" href={CREATE}>Publish your own</a>
				<span class="ml-1 font-mono text-[11px] text-muted-foreground">
					No feed · No follows · No metrics
				</span>
			</div>
		</div>
		<HeroStage />

		<div
			class="absolute bottom-7 left-0 flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase"
		>
			<span class="scroll-line"></span>
			<span>Scroll to read</span>
		</div>
	</section>

	<!-- DISCOVERY -->
	<section id="discovery">
		<div class="mb-9 flex items-end justify-between border-b border-border pt-14 pb-7">
			<div>
				<div class="eyebrow mb-3">Recently published · 8 zines</div>
				<h2 class="font-serif text-[44px] font-normal tracking-[-0.015em] text-ink">
					This season's <em class="text-primary italic">shelf</em>
				</h2>
			</div>
			<div
				class="flex items-center gap-[18px] font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase"
			>
				<span>Layout</span>
				<div class="layout-switch" role="tablist">
					<button class="active" type="button">Editorial</button>
					<button type="button">Shelf</button>
					<button type="button">List</button>
				</div>
			</div>
		</div>

		<EditorialGrid zines={ZINES} />
	</section>
</div>
