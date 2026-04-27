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

<div class="page">
	<!-- HERO -->
	<section class="hero">
		<div>
			<div class="eyebrow hero-eyebrow">A small press, on the open web</div>
			<h1>
				A quiet home for<br />
				<em>independent</em> writing.
			</h1>
			<p class="lede">
				Zinegeist is for writers who still believe a paragraph deserves breathing room. Publish a
				zine, build a small shelf, and let readers find you the way they used to find a thin yellow
				book in the back of a shop.
			</p>
			<div class="hero-cta">
				<a class="zg-btn zg-btn-primary" href="#discovery">
					Discover this season's zines
					<span aria-hidden="true">↓</span>
				</a>
				<a class="zg-btn zg-btn-outline" href={CREATE}> Publish your own </a>
				<span class="meta">No feed · No follows · No metrics</span>
			</div>
		</div>
		<HeroStage />

		<div class="scroll-hint">
			<span class="scroll-line"></span>
			<span>Scroll to read</span>
		</div>
	</section>

	<!-- DISCOVERY -->
	<section id="discovery">
		<div class="section-head">
			<div>
				<div class="eyebrow" style="margin-bottom: 12px;">Recently published · 8 zines</div>
				<h2>This season's <em>shelf</em></h2>
			</div>
			<div class="section-meta">
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

<style>
	.page {
		padding: 0 48px 96px;
	}

	.hero {
		min-height: calc(100vh - 130px);
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 64px;
		align-items: center;
		padding: 64px 0 80px;
		position: relative;
	}
	.hero-eyebrow {
		margin-bottom: 22px;
	}
	.hero h1 {
		font-family: var(--font-serif);
		font-size: clamp(48px, 6.2vw, 96px);
		line-height: 0.98;
		letter-spacing: -0.025em;
		font-weight: 400;
		color: var(--ink);
	}
	.hero h1 :global(em) {
		font-style: italic;
		font-weight: 300;
		color: var(--primary);
	}
	.hero p.lede {
		font-family: var(--font-serif);
		font-size: 19px;
		line-height: 1.55;
		color: var(--foreground);
		max-width: 44ch;
		margin: 28px 0 36px;
	}
	.hero-cta {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
	}
	.hero-cta .meta {
		margin-left: 4px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted-foreground);
	}

	.scroll-hint {
		position: absolute;
		left: 0;
		bottom: 28px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted-foreground);
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		padding: 56px 0 28px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 36px;
	}
	.section-head h2 {
		font-family: var(--font-serif);
		font-size: 44px;
		font-weight: 400;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	.section-head h2 :global(em) {
		font-style: italic;
		color: var(--primary);
	}
	.section-meta {
		display: flex;
		align-items: center;
		gap: 18px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted-foreground);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
</style>
