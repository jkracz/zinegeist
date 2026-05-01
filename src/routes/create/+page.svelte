<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import PublicationStatusBadge from '$lib/components/PublicationStatusBadge.svelte';
	import { CreateDraft } from '$lib/components/create/create-draft.svelte';
	import CreateSteps from '$lib/components/create/CreateSteps.svelte';
	import UploadStep from '$lib/components/create/UploadStep.svelte';
	import PreviewStep from '$lib/components/create/PreviewStep.svelte';
	import StepNav from '$lib/components/create/StepNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const STEPS = ['Upload', 'Preview'];
	const HOME = resolve('/');

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
	let previewStep = $state<PreviewStep | null>(null);

	const detailsReady = $derived(title.trim().length > 0 && description.trim().length > 0);
	const publishDisabled = $derived(
		draft.publishing ||
			!draft.publicationId ||
			!detailsReady ||
			!rightsAccepted ||
			Boolean(draft.publishedSlug)
	);

	function fileNameWithoutExtension(name: string): string {
		const dot = name.lastIndexOf('.');
		return dot > 0 ? name.slice(0, dot) : name;
	}

	function cancelCreate(): void {
		if (history.length > 1) {
			history.back();
			return;
		}

		void goto(HOME);
	}

	async function onFile(file: File): Promise<void> {
		currentStep = 0;
		const ok = await draft.handleFile(file);
		if (ok) {
			title = fileNameWithoutExtension(file.name);
			currentStep = 1;
		}
	}

	async function publishDraft(): Promise<void> {
		previewStep?.flushTags();
		if (publishDisabled) return;
		const slug = await draft.publish({ title, description, tags, rightsAccepted });
		if (slug) {
			await goto(resolve('/publication/[id]', { id: slug }));
		}
	}
</script>

<SectionBar
	crumbs={[
		{
			label: data.profile.handle,
			href: resolve('/profile/[handle]', { handle: data.profile.handle })
		},
		'New publication'
	]}
>
	{#snippet right()}
		<PublicationStatusBadge status={draft.publishedSlug ? 'published' : 'draft'} />
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
		{:else}
			<PreviewStep
				bind:this={previewStep}
				coverPreviewUrl={draft.coverPreviewUrl}
				bind:title
				bind:description
				bind:tags
				bind:rightsAccepted
				onSubmit={publishDraft}
			/>
		{/if}

		{#if draft.error}
			<p class="mt-6 text-sm text-destructive" role="alert">{draft.error}</p>
		{/if}

		<StepNav
			{currentStep}
			canContinueFromUpload={Boolean(draft.publicationId)}
			uploadBusy={draft.busy}
			{publishDisabled}
			publishing={draft.publishing}
			onCancel={cancelCreate}
			onBack={() => (currentStep = Math.max(0, currentStep - 1))}
			onContinue={() => (currentStep = Math.min(STEPS.length - 1, currentStep + 1))}
			onPublish={publishDraft}
		/>
	</div>
</div>
