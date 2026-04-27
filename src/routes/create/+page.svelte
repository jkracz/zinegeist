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

<div class="px-12 pb-24">
	<div class="mx-auto max-w-[920px] pt-14 pb-24">
		<CreateSteps steps={STEPS} current={0} />

		<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
			Bring us your <em class="text-primary italic">zine</em>.
		</h1>
		<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
			Upload a PDF — a single document, any size. We'll quietly pull the first page as a cover
			image, and you'll have a chance to approve it on the next step.
		</p>

		<div
			class="dropzone flex flex-col items-center gap-3.5 rounded-xl border-[1.5px] border-dashed border-border px-6 py-16 text-center"
		>
			<div class="icon-pdf"></div>
			<h3 class="font-serif text-2xl font-medium">Drag a PDF here</h3>
			<p class="m-0 text-sm text-muted-foreground">or</p>
			<button class="zg-btn zg-btn-outline" type="button">Choose a file</button>
			<p class="m-0 mt-3.5 text-xs text-muted-foreground">
				Up to 80 MB · single file · text-friendly
			</p>
		</div>

		<div
			class="cover-note mt-7 flex items-start gap-3 rounded-lg px-[18px] py-3.5 font-mono text-xs leading-[1.6] tracking-[0.04em] text-ink"
		>
			<span aria-hidden="true">✦</span>
			<div>
				<strong class="text-ink">How covers work.</strong> Zinegeist extracts a JPEG of your PDF's first
				page automatically. No separate upload, no template required — your zine comes as it is. You can
				also supply your own image on the next step.
			</div>
		</div>

		<div class="mt-9 flex items-center justify-between border-t border-border pt-6">
			<a class="zg-btn zg-btn-ghost" href={HOME}>← Cancel</a>
			<button class="zg-btn zg-btn-primary opacity-40" type="button" disabled>
				Continue to cover
			</button>
		</div>
	</div>
</div>

<style>
	.dropzone {
		background: color-mix(in oklch, var(--card) 60%, transparent);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.icon-pdf {
		width: 64px;
		height: 80px;
		border: 1.5px solid var(--ink);
		border-radius: 4px;
		position: relative;
		background: var(--paper-warm-1);
	}
	.icon-pdf::before {
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
	.icon-pdf::after {
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
	.cover-note {
		background: color-mix(in oklch, var(--accent) 50%, transparent);
	}
</style>
