<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { findZine, WRITERS } from '$lib/data/zines';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import ZineCover from '$lib/components/ZineCover.svelte';

	const HOME = resolve('/');
	const PROFILE = resolve('/profile');

	const zine = $derived(findZine(page.params.id ?? 'z1'));
	const writer = $derived(WRITERS[zine.writer]);
	const readMinutes = $derived(Math.round(zine.pages * 0.7));
</script>

<SectionBar crumbs={['Discover', writer.name, zine.title]}>
	{#snippet right()}
		<span class="eyebrow">{zine.issue} · {zine.date}</span>
		<a class="zg-btn zg-btn-ghost" href={HOME}>← Back to shelf</a>
	{/snippet}
</SectionBar>

<div class="px-12 pb-24">
	<div class="grid grid-cols-[1fr_1.4fr] gap-[72px] pt-14 pb-6">
		<div class="sticky top-24 self-start">
			<div class="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] shadow-page">
				<ZineCover coverId={zine.coverId} big />
				<div class="cover-edge"></div>
			</div>
			<div
				class="mt-3.5 text-center font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
			>
				cover · auto-extracted from PDF p.1
			</div>
		</div>

		<div>
			<div class="eyebrow mb-4">{zine.issue} · {zine.tags.join(' · ')}</div>
			<h1 class="font-serif text-[60px] leading-[1.02] font-normal tracking-[-0.025em] text-ink">
				{zine.title}
			</h1>
			<div class="mt-3 font-serif text-lg text-muted-foreground italic">
				by
				<a class="text-primary underline decoration-1 underline-offset-[3px]" href={PROFILE}>
					{writer.name}
				</a>
			</div>
			<p class="my-7 max-w-[58ch] font-serif text-lg leading-[1.65]">
				{zine.desc}
			</p>

			<div
				class="mb-7 grid grid-cols-2 gap-x-8 gap-y-[18px] border-y border-border py-[22px] font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase"
			>
				<div>
					<div>Pages</div>
					<div class="fact-value">{zine.pages} pp</div>
				</div>
				<div>
					<div>Published</div>
					<div class="fact-value">{zine.date}</div>
				</div>
				<div>
					<div>Read time</div>
					<div class="fact-value">~{readMinutes} min</div>
				</div>
				<div>
					<div>Format</div>
					<div class="fact-value">PDF · 5.5 × 8.5 in</div>
				</div>
			</div>

			<div class="flex flex-wrap gap-3">
				<button class="zg-btn zg-btn-primary" type="button">Begin reading →</button>
				<button class="zg-btn zg-btn-outline" type="button">Save for later</button>
				<button class="zg-btn zg-btn-ghost" type="button">Download PDF</button>
			</div>

			<div class="divider-tape"></div>

			<div class="eyebrow mb-3.5">From the editor's note</div>
			<p class="max-w-[56ch] font-serif text-[17px] leading-[1.7] text-foreground italic">
				“Six essays for the slow reader — meant to be opened on a Sunday morning, not a Tuesday
				inbox. Read one. Put it down. Come back.”
			</p>
		</div>
	</div>
</div>

<style>
	.fact-value {
		font-family: var(--font-serif);
		text-transform: none;
		letter-spacing: 0;
		font-size: 15px;
		color: var(--ink);
		margin-top: 4px;
	}
</style>
