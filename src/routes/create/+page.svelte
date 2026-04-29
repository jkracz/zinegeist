<script lang="ts">
	import { resolve } from '$app/paths';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { SectionBar, CreateSteps } from '$lib/components/zinegeist';

	const STEPS = ['Upload', 'Cover', 'Details', 'Review'];
	const HOME = resolve('/');
	const MAX_FILE_SIZE = 80 * 1024 * 1024;

	type UploadState = 'idle' | 'uploading-pdf' | 'extracting-cover' | 'uploading-cover' | 'ready';

	const client = useConvexClient();

	let fileInput = $state<HTMLInputElement | null>(null);
	let currentStep = $state(0);
	let dragActive = $state(false);
	let uploadState: UploadState = $state('idle');
	let selectedFile = $state<File | null>(null);
	let coverPreviewUrl = $state<string | null>(null);
	let publicationId = $state<Id<'publications'> | null>(null);
	let title = $state('');
	let description = $state('');
	let tagEntry = $state('');
	let tags = $state<string[]>([]);
	let rightsAccepted = $state(false);
	let error = $state<string | null>(null);
	let publishing = $state(false);
	let publishedSlug = $state<string | null>(null);

	const uploadBusy = $derived(uploadState !== 'idle' && uploadState !== 'ready');
	const titleReady = $derived(title.trim().length > 0);
	const detailsReady = $derived(titleReady && description.trim().length > 0);
	const publishDisabled = $derived(
		publishing || !publicationId || !detailsReady || !rightsAccepted || Boolean(publishedSlug)
	);

	const uploadStatus = $derived.by(() => {
		if (uploadState === 'uploading-pdf') return 'Uploading PDF...';
		if (uploadState === 'extracting-cover') return 'Rendering the first page...';
		if (uploadState === 'uploading-cover') return 'Uploading cover...';
		if (uploadState === 'ready') return 'Draft ready.';
		return null;
	});

	function resetDraftState(): void {
		if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
		coverPreviewUrl = null;
		publicationId = null;
		publishedSlug = null;
		rightsAccepted = false;
	}

	function validatePdf(file: File): string | null {
		if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
			return 'Choose a PDF file to continue.';
		}
		if (file.size > MAX_FILE_SIZE) {
			return 'PDFs can be up to 80 MB.';
		}
		return null;
	}

	async function uploadBlob(blob: Blob, contentType: string): Promise<Id<'_storage'>> {
		const uploadUrl = await client.mutation(api.publications.generateUploadUrl, {});
		const response = await fetch(uploadUrl, {
			method: 'POST',
			headers: { 'Content-Type': contentType },
			body: blob
		});

		if (!response.ok) {
			throw new Error('Upload failed. Try again.');
		}

		const result = (await response.json()) as { storageId: Id<'_storage'> };
		return result.storageId;
	}

	async function handleFile(file: File): Promise<void> {
		if (uploadBusy) return;

		const validationError = validatePdf(file);
		if (validationError) {
			error = validationError;
			return;
		}

		resetDraftState();
		selectedFile = file;
		error = null;
		uploadState = 'uploading-pdf';
		currentStep = 0;

		try {
			const pdfFileId = await uploadBlob(file, 'application/pdf');

			uploadState = 'extracting-cover';
			const { renderPdfCover } = await import('$lib/pdf/cover.client');
			const coverBlob = await renderPdfCover(file);
			const coverFile = new File([coverBlob], `${file.name.replace(/\.pdf$/i, '')}-cover.jpg`, {
				type: 'image/jpeg'
			});

			uploadState = 'uploading-cover';
			const coverFileId = await uploadBlob(coverFile, 'image/jpeg');
			const draft = await client.mutation(api.publications.createDraft, { pdfFileId, coverFileId });

			publicationId = draft.publicationId;
			coverPreviewUrl = URL.createObjectURL(coverBlob);
			uploadState = 'ready';
			currentStep = 1;
		} catch (e) {
			resetDraftState();
			error = e instanceof Error ? e.message : 'Could not prepare this PDF.';
			uploadState = 'idle';
		}
	}

	function handleInputChange(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) void handleFile(file);
		input.value = '';
	}

	function handleDrop(event: DragEvent): void {
		event.preventDefault();
		dragActive = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) void handleFile(file);
	}

	function addTag(): void {
		const value = tagEntry.trim().replace(/\s+/g, ' ');
		if (!value) return;
		if (!tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
			tags = [...tags, value].slice(0, 12);
		}
		tagEntry = '';
	}

	function handleTagKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addTag();
		}
	}

	function removeTag(tagToRemove: string): void {
		tags = tags.filter((tag) => tag !== tagToRemove);
	}

	async function saveDetailsAndReview(): Promise<void> {
		if (!publicationId || !detailsReady) return;
		addTag();
		error = null;

		try {
			await client.mutation(api.publications.updateDraftDetails, {
				publicationId,
				title,
				description,
				tags
			});
			currentStep = 3;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not save publication details.';
		}
	}

	async function publishPublication(): Promise<void> {
		if (publishDisabled || !publicationId) return;

		publishing = true;
		error = null;

		try {
			await client.mutation(api.publications.updateDraftDetails, {
				publicationId,
				title,
				description,
				tags
			});
			const result = await client.mutation(api.publications.publish, {
				publicationId,
				rightsAccepted
			});
			publishedSlug = result.slug;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not publish this draft.';
		} finally {
			publishing = false;
		}
	}
</script>

<SectionBar crumbs={['My shelf', 'New publication']}>
	{#snippet right()}
		<span class="eyebrow">{publishedSlug ? 'Published' : 'Publication draft'}</span>
	{/snippet}
</SectionBar>

<div class="px-6 pb-24 md:px-12">
	<div class="mx-auto max-w-[920px] pt-12 pb-24 md:pt-14">
		<CreateSteps steps={STEPS} current={currentStep} />

		{#if currentStep === 0}
			<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
				Bring us your <em class="text-primary italic">zine</em>.
			</h1>
			<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
				Upload a PDF, and Zinegeist will pull the first page as the cover for this publication.
			</p>

			<input
				bind:this={fileInput}
				class="sr-only"
				type="file"
				accept="application/pdf,.pdf"
				onchange={handleInputChange}
			/>

			<div
				class="dropzone flex flex-col items-center gap-3.5 rounded-xl border-[1.5px] border-dashed border-border px-6 py-16 text-center"
				class:drag-active={dragActive}
				role="group"
				aria-busy={uploadBusy}
				ondragenter={(event) => {
					event.preventDefault();
					dragActive = true;
				}}
				ondragover={(event) => event.preventDefault()}
				ondragleave={() => (dragActive = false)}
				ondrop={handleDrop}
			>
				<div class="icon-pdf"></div>
				<h3 class="font-serif text-2xl font-medium">
					{selectedFile ? selectedFile.name : 'Drag a PDF here'}
				</h3>
				{#if uploadStatus}
					<p class="m-0 text-sm text-muted-foreground">{uploadStatus}</p>
				{:else}
					<p class="m-0 text-sm text-muted-foreground">or</p>
				{/if}
				<button
					class="zg-btn zg-btn-outline disabled:cursor-not-allowed disabled:opacity-50"
					type="button"
					disabled={uploadBusy}
					onclick={() => fileInput?.click()}
				>
					Choose a file
				</button>
				<p class="m-0 mt-3.5 text-xs text-muted-foreground">Up to 80 MB · single file · PDF only</p>
			</div>

			<div
				class="cover-note mt-7 flex items-start gap-3 rounded-lg px-[18px] py-3.5 font-mono text-xs leading-[1.6] tracking-[0.04em] text-ink"
			>
				<span aria-hidden="true">✦</span>
				<div>
					<strong class="text-ink">How covers work.</strong> Zinegeist extracts a JPEG of your PDF's first
					page automatically. No separate upload, no template required.
				</div>
			</div>
		{:else if currentStep === 1}
			<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
				Cover pulled from page <em class="text-primary italic">one</em>.
			</h1>
			<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
				This image will represent the publication in future shelves and reading views.
			</p>

			<div class="cover-preview-grid">
				<div class="cover-frame">
					{#if coverPreviewUrl}
						<img src={coverPreviewUrl} alt="Generated publication cover preview" />
					{/if}
				</div>
				<div class="cover-meta">
					<p class="eyebrow">Source PDF</p>
					<h2 class="mt-2 font-serif text-3xl font-medium">{selectedFile?.name}</h2>
					<p class="mt-3 text-sm text-muted-foreground">
						{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : ''}
					</p>
				</div>
			</div>
		{:else if currentStep === 2}
			<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
				Give the issue a <em class="text-primary italic">name</em>.
			</h1>
			<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
				These details become the metadata attached to the published route.
			</p>

			<form
				class="flex flex-col gap-6"
				onsubmit={(event) => {
					event.preventDefault();
					void saveDetailsAndReview();
				}}
			>
				<div class="flex flex-col gap-2">
					<Label for="title">Title</Label>
					<Input id="title" bind:value={title} maxlength={140} placeholder="On Slowness" required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						bind:value={description}
						maxlength={1200}
						rows={7}
						placeholder="A short note for readers."
						required
					/>
				</div>
				<div class="flex flex-col gap-2">
					<Label for="tags">Tags</Label>
					<div class="tag-input">
						{#each tags as tag (tag)}
							<button class="tag-chip" type="button" onclick={() => removeTag(tag)}>
								{tag}<span aria-hidden="true">×</span>
							</button>
						{/each}
						<input
							id="tags"
							bind:value={tagEntry}
							type="text"
							maxlength={32}
							placeholder={tags.length ? '' : 'essay, art, poetry'}
							onblur={addTag}
							onkeydown={handleTagKeydown}
						/>
					</div>
				</div>
			</form>
		{:else}
			<h1 class="mb-3 font-serif text-[44px] leading-[1.05] font-normal tracking-[-0.015em]">
				Review and <em class="text-primary italic">publish</em>.
			</h1>
			<p class="mb-9 max-w-[56ch] font-serif text-[17px] text-muted-foreground">
				Confirm the publication details before making this route public.
			</p>

			<div class="review-grid">
				<div class="cover-frame small">
					{#if coverPreviewUrl}
						<img src={coverPreviewUrl} alt="Generated publication cover preview" />
					{/if}
				</div>
				<div class="review-copy">
					<p class="eyebrow">Publication</p>
					<h2 class="mt-2 font-serif text-4xl font-medium">{title}</h2>
					<p class="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
					{#if tags.length}
						<div class="mt-5 flex flex-wrap gap-2">
							{#each tags as tag (tag)}
								<span class="tag-pill">{tag}</span>
							{/each}
						</div>
					{/if}
					<label class="rights-check mt-7 flex items-start gap-3 text-sm leading-6">
						<input
							type="checkbox"
							bind:checked={rightsAccepted}
							disabled={Boolean(publishedSlug)}
						/>
						<span>I own or have permission to publish this PDF on Zinegeist.</span>
					</label>
					{#if publishedSlug}
						<div class="published-box mt-7">
							<p class="eyebrow">Public route</p>
							<a href={resolve('/publication/[id]', { id: publishedSlug })}>
								{resolve('/publication/[id]', { id: publishedSlug })}
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if error}
			<p class="mt-6 text-sm text-destructive" role="alert">{error}</p>
		{/if}

		<div class="mt-9 flex items-center justify-between border-t border-border pt-6">
			{#if currentStep === 0}
				<a class="zg-btn zg-btn-ghost" href={HOME}>Cancel</a>
			{:else}
				<button
					class="zg-btn zg-btn-ghost"
					type="button"
					disabled={publishing}
					onclick={() => (currentStep = Math.max(0, currentStep - 1))}
				>
					Back
				</button>
			{/if}

			{#if currentStep === 0}
				<button
					class="zg-btn zg-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
					type="button"
					disabled={!publicationId || uploadBusy}
					onclick={() => (currentStep = 1)}
				>
					Continue to cover
				</button>
			{:else if currentStep === 1}
				<button class="zg-btn zg-btn-primary" type="button" onclick={() => (currentStep = 2)}>
					Continue to details
				</button>
			{:else if currentStep === 2}
				<button
					class="zg-btn zg-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
					type="button"
					disabled={!detailsReady}
					onclick={() => void saveDetailsAndReview()}
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
					onclick={() => void publishPublication()}
				>
					{publishing ? 'Publishing...' : 'Publish'}
				</button>
			{/if}
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
	.dropzone.drag-active {
		border-color: var(--ink);
		background: color-mix(in oklch, var(--accent) 45%, transparent);
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
	.cover-preview-grid,
	.review-grid {
		display: grid;
		grid-template-columns: minmax(220px, 340px) 1fr;
		gap: 36px;
		align-items: start;
	}
	.cover-frame {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--paper-warm-1);
		box-shadow: var(--shadow-page);
		aspect-ratio: 0.72;
	}
	.cover-frame.small {
		max-width: 260px;
	}
	.cover-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.cover-meta,
	.review-copy {
		padding-top: 10px;
	}
	.tag-input {
		display: flex;
		min-height: 46px;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--input);
		border-radius: var(--radius);
		background: transparent;
		padding: 7px 9px;
	}
	.tag-input:focus-within {
		border-color: var(--ring);
		box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 25%, transparent);
	}
	.tag-input input {
		min-width: 160px;
		flex: 1;
		border: 0;
		background: transparent;
		padding: 4px 2px;
		font-size: 14px;
		outline: 0;
	}
	.tag-chip,
	.tag-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: color-mix(in oklch, var(--accent) 45%, transparent);
		padding: 5px 10px;
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 1;
		color: var(--ink);
	}
	.tag-chip {
		cursor: pointer;
	}
	.rights-check input {
		margin-top: 5px;
		border-color: var(--border);
		color: var(--ink);
	}
	.published-box {
		border-top: 1px solid var(--border);
		padding-top: 18px;
	}
	.published-box a {
		display: inline-block;
		margin-top: 8px;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	@media (max-width: 760px) {
		.cover-preview-grid,
		.review-grid {
			grid-template-columns: 1fr;
		}
		.cover-frame,
		.cover-frame.small {
			max-width: 320px;
		}
	}
</style>
