<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { findZine, WRITERS } from '$lib/data/zines';
	import { SectionBar, ZineCover } from '$lib/components/zinegeist';

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

<div class="page">
	<div class="pub-detail">
		<div class="pub-cover-wrap">
			<div class="pub-cover">
				<ZineCover coverId={zine.coverId} big />
				<div class="cover-edge"></div>
			</div>
			<div class="cover-caption mono">cover · auto-extracted from PDF p.1</div>
		</div>

		<div class="pub-meta">
			<div class="eyebrow">{zine.issue} · {zine.tags.join(' · ')}</div>
			<h1 class="pub-title">{zine.title}</h1>
			<div class="pub-byline">
				by <a href={PROFILE}>{writer.name}</a>
			</div>
			<p class="pub-desc">{zine.desc}</p>

			<div class="pub-facts">
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

			<div class="pub-actions">
				<button class="zg-btn zg-btn-primary" type="button">Begin reading →</button>
				<button class="zg-btn zg-btn-outline" type="button">Save for later</button>
				<button class="zg-btn zg-btn-ghost" type="button">Download PDF</button>
			</div>

			<div class="divider-tape"></div>

			<div class="eyebrow" style="margin-bottom: 14px;">From the editor's note</div>
			<p class="editor-note serif">
				“Six essays for the slow reader — meant to be opened on a Sunday morning, not a Tuesday
				inbox. Read one. Put it down. Come back.”
			</p>
		</div>
	</div>
</div>

<style>
	.page {
		padding: 0 48px 96px;
	}
	.pub-detail {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 72px;
		padding: 56px 0 24px;
	}
	.pub-cover-wrap {
		position: sticky;
		top: 96px;
		align-self: start;
	}
	.pub-cover {
		width: 100%;
		aspect-ratio: 3 / 4;
		border-radius: 2px;
		box-shadow: var(--shadow-page);
		position: relative;
		overflow: hidden;
	}
	.cover-caption {
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		text-align: center;
		margin-top: 14px;
	}
	.pub-meta .eyebrow {
		margin-bottom: 16px;
	}
	.pub-title {
		font-family: var(--font-serif);
		font-size: 60px;
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1.02;
		color: var(--ink);
	}
	.pub-byline {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 18px;
		margin-top: 12px;
		color: var(--muted-foreground);
	}
	.pub-byline a {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}
	.pub-desc {
		font-family: var(--font-serif);
		font-size: 18px;
		line-height: 1.65;
		margin: 28px 0;
		max-width: 58ch;
	}
	.pub-facts {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 18px 32px;
		padding: 22px 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		margin-bottom: 28px;
	}
	.fact-value {
		font-family: var(--font-serif);
		text-transform: none;
		letter-spacing: 0;
		font-size: 15px;
		color: var(--ink);
		margin-top: 4px;
	}
	.pub-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	.editor-note {
		font-size: 17px;
		line-height: 1.7;
		font-style: italic;
		color: var(--foreground);
		max-width: 56ch;
	}
</style>
