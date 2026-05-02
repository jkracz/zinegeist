import type { ConvexClient } from 'convex/browser';
import { toast } from 'svelte-sonner';
import { api } from '$convex/_generated/api';
import type { Id } from '$convex/_generated/dataModel';

export type UploadState =
	| 'idle'
	| 'uploading-pdf'
	| 'extracting-cover'
	| 'uploading-cover'
	| 'ready';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export class CreateDraft {
	#client: ConvexClient;

	state: UploadState = $state('idle');
	selectedFile: File | null = $state(null);
	coverPreviewUrl: string | null = $state(null);
	publicationId: Id<'publications'> | null = $state(null);
	publishedSlug: string | null = $state(null);
	error: string | null = $state(null);
	publishing: boolean = $state(false);
	deleting: boolean = $state(false);

	busy = $derived(this.state !== 'idle' && this.state !== 'ready');

	statusLabel = $derived.by(() => {
		if (this.state === 'uploading-pdf') return 'Uploading PDF...';
		if (this.state === 'extracting-cover') return 'Rendering the first page...';
		if (this.state === 'uploading-cover') return 'Uploading cover...';
		if (this.state === 'ready') return 'Draft ready.';
		return null;
	});

	constructor(client: ConvexClient) {
		this.#client = client;
	}

	#reset(options: { keepPublicationId?: boolean } = {}): void {
		if (this.coverPreviewUrl) URL.revokeObjectURL(this.coverPreviewUrl);
		this.coverPreviewUrl = null;
		if (!options.keepPublicationId) this.publicationId = null;
		this.publishedSlug = null;
	}

	#validate(file: File): string | null {
		if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
			return 'Choose a PDF file to continue.';
		}
		if (file.size > MAX_FILE_SIZE) {
			return 'PDFs can be up to 100 MB.';
		}
		return null;
	}

	async #uploadBlob(blob: Blob, contentType: string): Promise<Id<'_storage'>> {
		const uploadUrl = await this.#client.mutation(api.publications.generateUploadUrl, {});
		const response = await fetch(uploadUrl, {
			method: 'POST',
			headers: { 'Content-Type': contentType },
			body: blob
		});
		if (!response.ok) throw new Error('Upload failed. Try again.');
		const result = (await response.json()) as { storageId: Id<'_storage'> };
		return result.storageId;
	}

	async handleFile(file: File): Promise<boolean> {
		if (this.busy) return false;

		const validationError = this.#validate(file);
		if (validationError) {
			toast.error(validationError);
			return false;
		}

		const draftToReplace = this.publicationId && !this.publishedSlug ? this.publicationId : null;

		this.#reset({ keepPublicationId: Boolean(draftToReplace) });
		this.selectedFile = file;
		this.error = null;
		this.state = 'uploading-pdf';

		try {
			const pdfStorageId = await this.#uploadBlob(file, 'application/pdf');

			this.state = 'extracting-cover';
			const { preparePdfUpload } = await import('$lib/pdf/upload.client');
			const { coverBlob, pageCount } = await preparePdfUpload(file);
			const coverFile = new File([coverBlob], `${file.name.replace(/\.pdf$/i, '')}-cover.jpg`, {
				type: 'image/jpeg'
			});

			this.state = 'uploading-cover';
			const coverStorageId = await this.#uploadBlob(coverFile, 'image/jpeg');
			const draftArgs = {
				pdfFile: {
					storageId: pdfStorageId,
					name: file.name,
					mimeType: file.type || 'application/pdf'
				},
				coverFile: {
					storageId: coverStorageId,
					name: coverFile.name,
					mimeType: coverFile.type
				},
				pageCount
			};
			const draft = draftToReplace
				? await this.#client.mutation(api.publications.replaceDraftFiles, {
						publicationId: draftToReplace,
						...draftArgs
					})
				: await this.#client.mutation(api.publications.createDraft, draftArgs);

			this.publicationId = draft.publicationId;
			this.coverPreviewUrl = URL.createObjectURL(coverBlob);
			this.state = 'ready';
			return true;
		} catch (e) {
			this.#reset();
			this.error = e instanceof Error ? e.message : 'Could not prepare this PDF.';
			this.state = 'idle';
			return false;
		}
	}

	hydrateFromServer(input: { id: Id<'publications'>; coverUrl: string | null }): void {
		this.publicationId = input.id;
		this.coverPreviewUrl = input.coverUrl;
		this.state = 'ready';
		this.selectedFile = null;
		this.error = null;
	}

	async deleteDraft(): Promise<boolean> {
		if (!this.publicationId || this.deleting) return false;
		this.deleting = true;
		this.error = null;
		try {
			await this.#client.mutation(api.publications.deletePublication, {
				publicationId: this.publicationId
			});
			this.#reset();
			this.selectedFile = null;
			this.state = 'idle';
			return true;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Could not delete this draft.';
			return false;
		} finally {
			this.deleting = false;
		}
	}

	async publish(input: {
		title: string;
		description: string;
		tags: string[];
		rightsAccepted: boolean;
	}): Promise<string | null> {
		if (!this.publicationId) return null;
		this.publishing = true;
		this.error = null;
		try {
			await this.#client.mutation(api.publications.updateDraftDetails, {
				publicationId: this.publicationId,
				title: input.title,
				description: input.description,
				tags: input.tags
			});
			const result = await this.#client.mutation(api.publications.publish, {
				publicationId: this.publicationId,
				rightsAccepted: input.rightsAccepted
			});
			this.publishedSlug = result.slug;
			return result.slug;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Could not publish this draft.';
			return null;
		} finally {
			this.publishing = false;
		}
	}
}
