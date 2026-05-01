<script lang="ts">
	type Props = {
		currentStep: number;
		canContinueFromUpload: boolean;
		uploadBusy: boolean;
		publishDisabled: boolean;
		publishing: boolean;
		onCancel: () => void;
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
		onCancel,
		onBack,
		onContinue,
		onPublish
	}: Props = $props();
</script>

<div class="mt-9 flex items-center justify-between border-t border-border pt-6">
	{#if currentStep === 0}
		<button class="zg-btn zg-btn-ghost" type="button" onclick={onCancel}> Cancel </button>
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
