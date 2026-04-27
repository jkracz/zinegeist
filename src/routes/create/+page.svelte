<script lang="ts">
	import { resolve } from '$app/paths';
	import { SectionBar, CreateSteps } from '$lib/components/zinegeist';

	const STEPS = ['Upload', 'Cover', 'Details', 'Review'];
	const HOME = resolve('/');
	const PROFILE = resolve('/profile');
</script>

<SectionBar crumbs={['My shelf', 'New publication']}>
	{#snippet right()}
		<span class="eyebrow">Draft · auto-saved</span>
		<a class="zg-btn zg-btn-ghost" href={PROFILE}>Save &amp; exit</a>
	{/snippet}
</SectionBar>

<div class="page">
	<div class="create-shell">
		<CreateSteps steps={STEPS} current={0} />

		<h1 class="create-title">Bring us your <em>zine</em>.</h1>
		<p class="create-sub">
			Upload a PDF — a single document, any size. We'll quietly pull the first page as a cover
			image, and you'll have a chance to approve it on the next step.
		</p>

		<div class="dropzone">
			<div class="icon-pdf"></div>
			<h3>Drag a PDF here</h3>
			<p>or</p>
			<button class="zg-btn zg-btn-outline" type="button">Choose a file</button>
			<p style="margin-top: 14px; font-size: 12px;">Up to 80 MB · single file · text-friendly</p>
		</div>

		<div class="cover-note">
			<span aria-hidden="true">✦</span>
			<div>
				<strong>How covers work.</strong> Zinegeist extracts a JPEG of your PDF's first page automatically.
				No separate upload, no template required — your zine comes as it is. You can also supply your
				own image on the next step.
			</div>
		</div>

		<div class="create-actions">
			<a class="zg-btn zg-btn-ghost" href={HOME}>← Cancel</a>
			<button class="zg-btn zg-btn-primary" type="button" disabled style="opacity: 0.4;">
				Continue to cover
			</button>
		</div>
	</div>
</div>

<style>
	.page {
		padding: 0 48px 96px;
	}
	.create-shell {
		max-width: 920px;
		margin: 0 auto;
		padding: 56px 0 96px;
	}
	.create-title {
		font-family: var(--font-serif);
		font-size: 44px;
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 1.05;
		margin-bottom: 12px;
	}
	.create-title :global(em) {
		font-style: italic;
		color: var(--primary);
	}
	.create-sub {
		font-family: var(--font-serif);
		font-size: 17px;
		color: var(--muted-foreground);
		max-width: 56ch;
		margin-bottom: 36px;
	}

	.dropzone {
		border: 1.5px dashed var(--border);
		border-radius: 12px;
		padding: 64px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		text-align: center;
		background: color-mix(in oklch, var(--card) 60%, transparent);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.dropzone .icon-pdf {
		width: 64px;
		height: 80px;
		border: 1.5px solid var(--ink);
		border-radius: 4px;
		position: relative;
		background: var(--paper-warm-1);
	}
	.dropzone .icon-pdf::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 18px;
		height: 18px;
		background: var(--background);
		border-left: 1.5px solid var(--ink);
		border-bottom: 1.5px solid var(--ink);
	}
	.dropzone .icon-pdf::after {
		content: 'PDF';
		position: absolute;
		bottom: 14px;
		left: 0;
		right: 0;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--ink);
	}
	.dropzone h3 {
		font-family: var(--font-serif);
		font-size: 24px;
		font-weight: 500;
	}
	.dropzone p {
		font-size: 14px;
		color: var(--muted-foreground);
		margin: 0;
	}

	.cover-note {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		padding: 14px 18px;
		border-radius: var(--radius);
		background: color-mix(in oklch, var(--accent) 50%, transparent);
		margin-top: 28px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--ink);
		letter-spacing: 0.04em;
		line-height: 1.6;
	}
	.cover-note strong {
		color: var(--ink);
	}

	.create-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 36px;
		padding-top: 24px;
		border-top: 1px solid var(--border);
	}
</style>
