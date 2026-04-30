<script lang="ts">
	import { resolve } from '$app/paths';

	type Props = {
		currentStep: number;
		canContinueFromUpload: boolean;
		uploadBusy: boolean;
		publishDisabled: boolean;
		publishing: boolean;
		onBack: () => void;
		onContinue: () => void;
		onPublish: () => void;
	};

	let {
		currentStep,
		canContinueFromUpload,
		uploadBusy,
		publishDisabled,
		publishing,
		onBack,
		onContinue,
		onPublish
	}: Props = $props();

	const HOME = resolve('/');
</script>

<div class="mt-9 flex items-center justify-between border-t border-border pt-6">
	{#if currentStep === 0}
		<a class="zg-btn zg-btn-ghost" href={HOME}>Cancel</a>
		<button
			class="zg-btn zg-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
			type="button"
			disabled={!canContinueFromUpload || uploadBusy}
			onclick={onContinue}
		>
			Continue to preview
		</button>
	{:else}
		<button class="zg-btn zg-btn-ghost" type="button" disabled={publishing} onclick={onBack}>
			Back
		</button>
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
