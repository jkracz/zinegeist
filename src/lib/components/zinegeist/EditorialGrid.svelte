<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Zine } from '$lib/data/zines';
	import { WRITERS } from '$lib/data/zines';
	import ZineCard from './ZineCard.svelte';

	type Props = { zines: Zine[] };
	let { zines }: Props = $props();

	const featured = $derived(zines[0]);
	const featuredWriter = $derived(WRITERS[featured.writer]);
	const featuredHref = $derived(resolve('/publication/[id]', { id: featured.id }));
	const sideStack = $derived(zines.slice(1, 3));
	const tail = $derived(zines.slice(3));

	// Editorial pattern of column-spans for the tail row.
	const SPANS = [6, 3, 3, 4, 4, 4];

	const pubHref = (id: string) => resolve('/publication/[id]', { id });
</script>

<div class="grid-editorial">
	<!-- Featured wide hero card -->
	<a class="featured" href={featuredHref}>
		<div class="featured-cover">
			<div class="featured-inner">
				<div class="featured-left">
					<div class="eyebrow" style="color: #3a2418; opacity: 0.7;">
						Featured · {featured.issue}
					</div>
					<div>
						<div class="featured-by">by {featuredWriter.name}</div>
						<div class="featured-title">
							On<br /><em>Slowness</em>.
						</div>
					</div>
				</div>
				<div class="featured-right">
					<p class="featured-quote">
						“There is a particular hour in early spring when the light slows down. It does not
						soften, exactly, nor warm — it simply takes longer to cross the kitchen floor.”
					</p>
					<div class="featured-meta">
						<span class="mono featured-stats">
							{featured.pages} pp · {featured.date}
						</span>
						<span class="zg-btn zg-btn-outline" style="border-color: #3a2418; color: #3a2418;">
							Read →
						</span>
					</div>
				</div>
			</div>
			<div class="cover-edge"></div>
		</div>
	</a>

	<!-- Side stack of 2 cards -->
	<div class="side-stack">
		{#each sideStack as zine (zine.id)}
			<ZineCard {zine} mini href={pubHref(zine.id)} />
		{/each}
	</div>

	<!-- Section break -->
	<div class="section-break">
		<div class="rule"></div>
		<span class="eyebrow">More from this season</span>
		<div class="rule"></div>
	</div>

	{#each tail as zine, i (zine.id)}
		<div class="cell" style:grid-column="span {SPANS[i] ?? 4}">
			<ZineCard {zine} mini={(SPANS[i] ?? 4) < 5} href={pubHref(zine.id)} />
		</div>
	{/each}
</div>

<style>
	.grid-editorial {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-auto-rows: minmax(140px, auto);
		gap: 32px 24px;
	}
	.featured {
		grid-column: span 7;
		text-decoration: none;
		color: inherit;
		display: block;
	}
	.featured-cover {
		position: relative;
		aspect-ratio: 5 / 3;
		border-radius: 2px;
		box-shadow: var(--shadow-page);
		overflow: hidden;
	}
	.featured-inner {
		position: absolute;
		inset: 0;
		background: linear-gradient(110deg, #e8d4b3 0%, #c89870 55%, #8a5a3c 100%);
		display: grid;
		grid-template-columns: 1fr 1.1fr;
	}
	.featured-left {
		padding: 40px 36px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: #3a2418;
	}
	.featured-by {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 20px;
		color: #5a3a24;
		margin-bottom: 6px;
	}
	.featured-title {
		font-family: var(--font-serif);
		font-size: 64px;
		line-height: 0.95;
		letter-spacing: -0.025em;
		color: #26170d;
	}
	.featured-title em {
		font-style: italic;
	}
	.featured-right {
		border-left: 1px solid rgba(60, 40, 25, 0.2);
		padding: 40px 36px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.featured-quote {
		font-family: var(--font-serif);
		font-size: 17px;
		line-height: 1.6;
		color: #3a2418;
		margin: 0;
	}
	.featured-meta {
		display: flex;
		justify-content: space-between;
		align-items: end;
		color: #3a2418;
	}
	.featured-stats {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.side-stack {
		grid-column: span 5;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px 24px;
		align-content: start;
	}

	.section-break {
		grid-column: span 12;
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 12px 0;
	}
	.section-break .rule {
		flex: 1;
		height: 1px;
		background: var(--border);
	}

	.cell {
		min-width: 0;
	}
</style>
