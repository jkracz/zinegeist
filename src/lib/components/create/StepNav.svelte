<script lang="ts">
	import { Button } from '$lib/components/ui/button';

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
		<Button variant="ghost" type="button" onclick={onCancel}>Cancel</Button>
		<Button type="button" disabled={!canContinueFromUpload || uploadBusy} onclick={onContinue}>
			Continue to preview
		</Button>
	{:else}
		<Button variant="ghost" type="button" disabled={publishing} onclick={onBack}>Back</Button>
		<Button type="button" disabled={publishDisabled} onclick={onPublish}>
			{publishing ? 'Publishing…' : 'Publish'}
		</Button>
	{/if}
</div>
