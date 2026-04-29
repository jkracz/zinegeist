<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import { CreateDraft } from '$lib/components/create/create-draft.svelte';
	import CreateSteps from '$lib/components/create/CreateSteps.svelte';
	import UploadStep from '$lib/components/create/UploadStep.svelte';
	import CoverStep from '$lib/components/create/CoverStep.svelte';
	import DetailsStep from '$lib/components/create/DetailsStep.svelte';
	import ReviewStep from '$lib/components/create/ReviewStep.svelte';
	import StepNav from '$lib/components/create/StepNav.svelte';

	const STEPS = ['Upload', 'Cover', 'Details', 'Review'];

	const draft = new CreateDraft(useConvexClient());

	let currentStep = $state(0);
	let maxStepReached = $state(0);
	$effect(() => {
		if (currentStep > maxStepReached) maxStepReached = currentStep;
	});
	let title = $state('');
	let description = $state('');
	let tags = $state<string[]>([]);
	let rightsAccepted = $state(false);
	let detailsStep = $state<DetailsStep | null>(null);

	const detailsReady = $derived(title.trim().length > 0 && description.trim().length > 0);
	const publishDisabled = $derived(
		draft.publishing ||
			!draft.publicationId ||
			!detailsReady ||
			!rightsAccepted ||
			Boolean(draft.publishedSlug)
	);

	async function onFile(file: File): Promise<void> {
		currentStep = 0;
		const ok = await draft.handleFile(file);
		if (ok) currentStep = 1;
	}

	async function reviewDetails(): Promise<void> {
		detailsStep?.flushTags();
		if (!detailsReady) return;
		const ok = await draft.saveDetails({ title, description, tags });
		if (ok) currentStep = 3;
	}

	async function publishDraft(): Promise<void> {
		if (publishDisabled) return;
		const slug = await draft.publish({ title, description, tags, rightsAccepted });
		if (slug) {
			await goto(resolve('/publication/[id]', { id: slug }));
		}
	}
</script>

<SectionBar crumbs={['My shelf', 'New publication']}>
	{#snippet right()}
		<span class="eyebrow">{draft.publishedSlug ? 'Published' : 'Publication draft'}</span>
	{/snippet}
</SectionBar>

<div class="px-6 pb-24 md:px-12">
	<div class="mx-auto max-w-[920px] pt-12 pb-24 md:pt-14">
		<CreateSteps
			steps={STEPS}
			current={currentStep}
			canSelect={(i) => i <= maxStepReached && !draft.busy && !draft.publishing}
			onSelect={(i) => (currentStep = i)}
		/>

		{#if currentStep === 0}
			<UploadStep
				busy={draft.busy}
				statusLabel={draft.statusLabel}
				fileName={draft.selectedFile?.name ?? null}
				{onFile}
			/>
		{:else if currentStep === 1}
			<CoverStep coverPreviewUrl={draft.coverPreviewUrl} file={draft.selectedFile} />
		{:else if currentStep === 2}
			<DetailsStep
				bind:this={detailsStep}
				bind:title
				bind:description
				bind:tags
				onSubmit={reviewDetails}
			/>
		{:else}
			<ReviewStep
				coverPreviewUrl={draft.coverPreviewUrl}
				{title}
				{description}
				{tags}
				bind:rightsAccepted
			/>
		{/if}

		{#if draft.error}
			<p class="mt-6 text-sm text-destructive" role="alert">{draft.error}</p>
		{/if}

		<StepNav
			{currentStep}
			canContinueFromUpload={Boolean(draft.publicationId)}
			uploadBusy={draft.busy}
			{detailsReady}
			{publishDisabled}
			publishing={draft.publishing}
			onBack={() => (currentStep = Math.max(0, currentStep - 1))}
			onContinue={() => (currentStep = Math.min(STEPS.length - 1, currentStep + 1))}
			onReview={reviewDetails}
			onPublish={publishDraft}
		/>
	</div>
</div>
