<script lang="ts">
	import { resolve } from '$app/paths';

	type Props = {
		currentStep: number;
		canContinueFromUpload: boolean;
		uploadBusy: boolean;
		detailsReady: boolean;
		publishDisabled: boolean;
		publishing: boolean;
		publishedSlug: string | null;
		onBack: () => void;
		onContinue: () => void;
		onReview: () => void;
		onPublish: () => void;
	};

	let {
		currentStep,
		canContinueFromUpload,
		uploadBusy,
		detailsReady,
		publishDisabled,
		publishing,
		publishedSlug,
		onBack,
		onContinue,
		onReview,
		onPublish
	}: Props = $props();

	const HOME = resolve('/');
</script>

<div class="mt-9 flex items-center justify-between border-t border-border pt-6">
	{#if currentStep === 0}
		<a class="zg-btn zg-btn-ghost" href={HOME}>Cancel</a>
	{:else}
		<button class="zg-btn zg-btn-ghost" type="button" disabled={publishing} onclick={onBack}>
			Back
		</button>
	{/if}

	{#if currentStep === 0}
		<button
			class="zg-btn zg-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
			type="button"
			disabled={!canContinueFromUpload || uploadBusy}
			onclick={onContinue}
		>
			Continue to cover
		</button>
	{:else if currentStep === 1}
		<button class="zg-btn zg-btn-primary" type="button" onclick={onContinue}>
			Continue to details
		</button>
	{:else if currentStep === 2}
		<button
			class="zg-btn zg-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
			type="button"
			disabled={!detailsReady}
			onclick={onReview}
		>
			Review publication
		</button>
	{:else if publishedSlug}
		<a class="zg-btn zg-btn-primary" href={resolve('/publication/[id]', { id: publishedSlug })}>
			View route
		</a>
	{:else}
		<button
			class="zg-btn zg-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
			type="button"
			disabled={publishDisabled}
			onclick={onPublish}
		>
			{publishing ? 'Publishing...' : 'Publish'}
		</button>
	{/if}
</div>
