<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import PublicationStatusBadge from '$lib/components/PublicationStatusBadge.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { CreateDraft } from '$lib/components/create/create-draft.svelte';
	import CreateSteps from '$lib/components/create/CreateSteps.svelte';
	import UploadStep from '$lib/components/create/UploadStep.svelte';
	import PreviewStep from '$lib/components/create/PreviewStep.svelte';
	import StepNav from '$lib/components/create/StepNav.svelte';
	import ShelfFullCard from '$lib/components/ShelfFullCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const STEPS = ['Upload', 'Preview'];
	const HOME = resolve('/');
	const profileHandle = untrack(() => data.profile.handle);
	const initialResume = untrack(() => data.resumeDraft);

	const draft = new CreateDraft(useConvexClient());

	const initialStep = initialResume ? 1 : 0;
	let currentStep = $state(initialStep);
	let maxStepReached = $state(initialStep);
	$effect(() => {
		if (currentStep > maxStepReached) maxStepReached = currentStep;
	});
	let title = $state(initialResume?.title ?? '');
	let description = $state(initialResume?.description ?? '');
	let tags = $state<string[]>(initialResume?.tags ?? []);
	let rightsAccepted = $state(false);
	let previewStep = $state<PreviewStep | null>(null);
	let deleteDialogOpen = $state(false);

	if (initialResume) {
		draft.hydrateFromServer({
			id: initialResume.id,
			coverUrl: initialResume.coverUrl
		});
	}

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

	async function confirmDeleteDraft(): Promise<void> {
		const ok = await draft.deleteDraft();
		if (!ok) return;
		deleteDialogOpen = false;
		await goto(resolve('/profile/[handle]', { handle: profileHandle }));
	}
</script>

<SectionBar
	crumbs={[
		{
			label: profileHandle,
			href: resolve('/profile/[handle]', { handle: profileHandle })
		},
		data.shelfFull ? 'Shelf full' : initialResume ? 'Resume draft' : 'New publication'
	]}
>
	{#snippet right()}
		{#if !data.shelfFull && draft.publicationId && !draft.publishedSlug}
			<button
				type="button"
				class="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				disabled={draft.busy || draft.publishing || draft.deleting}
				onclick={() => (deleteDialogOpen = true)}
			>
				<Trash2Icon class="size-3.5" aria-hidden="true" />
				<span>Delete draft</span>
			</button>
		{/if}
		{#if !data.shelfFull}
			<PublicationStatusBadge status={draft.publishedSlug ? 'published' : 'draft'} />
		{/if}
	{/snippet}
</SectionBar>

{#if data.shelfFull}
	<ShelfFullCard variant="page">
		{#snippet footer()}
			<a
				class="zg-btn zg-btn-outline !px-5 !py-2.5 !text-[13px]"
				href={resolve('/profile/[handle]', { handle: profileHandle })}
			>
				Back to your shelf
			</a>
		{/snippet}
	</ShelfFullCard>
{:else}
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

	<ConfirmDialog
		bind:open={deleteDialogOpen}
		title="Delete this draft?"
		body="Deleting this draft will remove the file and discard your progress. This cannot be undone."
		confirmLabel={draft.deleting ? 'Deleting…' : 'Delete draft'}
		destructive
		busy={draft.deleting}
		onConfirm={confirmDeleteDraft}
	/>
{/if}
