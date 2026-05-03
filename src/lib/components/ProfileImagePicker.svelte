<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import { invalidateAll } from '$app/navigation';
	import ImageUpIcon from '@lucide/svelte/icons/image-up';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import XIcon from '@lucide/svelte/icons/x';
	import type { ConvexClient } from 'convex/browser';
	import { onDestroy } from 'svelte';
	import { MAX_PROFILE_IMAGE_SIZE_BYTES } from '$lib/constants';

	type Props = {
		client: ConvexClient;
		displayName: string;
		image: string | null;
		editable: boolean;
	};

	const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

	let { client, displayName, image, editable }: Props = $props();

	let open = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let uploading = $state(false);
	let error: string | null = $state(null);
	let selectedFile: File | null = $state(null);
	let previewUrl: string | null = $state(null);
	const previewImage = $derived(previewUrl ?? image);

	function validateProfileImage(file: File): string | null {
		if (!PROFILE_IMAGE_TYPES.includes(file.type)) {
			return 'Choose a JPEG, PNG, WebP, or GIF.';
		}
		if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
			return 'Profile pictures can be up to 5 MB.';
		}
		return null;
	}

	function chooseProfileImage() {
		error = null;
		fileInput?.click();
	}

	function clearSelectedFile() {
		selectedFile = null;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = null;
		if (fileInput) fileInput.value = '';
	}

	function closeDialog() {
		if (uploading) return;
		open = false;
		error = null;
		clearSelectedFile();
	}

	function handleOpenChange(next: boolean) {
		if (next) {
			open = true;
			return;
		}
		closeDialog();
	}

	async function confirmProfileImage() {
		if (uploading || !selectedFile) return;
		const file = selectedFile;
		const validationError = validateProfileImage(file);
		if (validationError) {
			error = validationError;
			return;
		}

		uploading = true;
		error = null;
		try {
			const uploadUrl = await client.mutation(api.profiles.generateProfileImageUploadUrl, {});
			const response = await fetch(uploadUrl, {
				method: 'POST',
				headers: { 'Content-Type': file.type },
				body: file
			});
			if (!response.ok) throw new Error('Upload failed. Try again.');
			const result = (await response.json()) as { storageId: Id<'_storage'> };
			await client.mutation(api.profiles.updateProfileImage, {
				file: {
					storageId: result.storageId,
					name: file.name,
					mimeType: file.type
				}
			});
			await invalidateAll();
			open = false;
			clearSelectedFile();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not update your picture.';
		} finally {
			uploading = false;
		}
	}

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const validationError = validateProfileImage(file);
		if (validationError) {
			error = validationError;
			clearSelectedFile();
			return;
		}

		error = null;
		selectedFile = file;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = URL.createObjectURL(file);
	}

	onDestroy(clearSelectedFile);
</script>

<div class="relative size-40">
	{#if editable}
		<button
			type="button"
			class="profile-image-button relative block size-40 cursor-pointer rounded-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
			aria-label="Change profile picture"
			onclick={() => {
				error = null;
				open = true;
			}}
		>
			{#if image}
				<img
					src={image}
					alt={displayName}
					class="size-40 rounded-full border border-border object-cover shadow-md"
				/>
			{:else}
				<Avatar name={displayName} />
			{/if}
		</button>
	{:else if image}
		<img
			src={image}
			alt={displayName}
			class="size-40 rounded-full border border-border object-cover shadow-md"
		/>
	{:else}
		<Avatar name={displayName} />
	{/if}
</div>

<input
	bind:this={fileInput}
	type="file"
	accept="image/jpeg,image/png,image/webp,image/gif"
	class="sr-only"
	onchange={handleFileChange}
/>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content
		class="!max-w-[430px] !rounded-[2px] !border !border-border !bg-paper-warm-1 !p-0 !ring-0"
		showCloseButton={false}
	>
		<div class="flex flex-col gap-6 p-6">
			<div class="flex items-start justify-between gap-5">
				<div class="min-w-0">
					<div class="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
						Profile picture
					</div>
					<Dialog.Title
						class="mt-2 font-serif text-[30px] leading-[1.05] font-normal tracking-[-0.01em] text-ink"
					>
						Change your picture
					</Dialog.Title>
					<Dialog.Description class="mt-3 font-serif text-[15px] leading-[1.55] text-foreground">
						Upload a square or portrait image. Zinegeist will keep it as a round profile picture.
					</Dialog.Description>
				</div>
				<button
					type="button"
					class="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-paper-warm-2/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					aria-label="Close"
					disabled={uploading}
					onclick={closeDialog}
				>
					<XIcon class="size-4" />
				</button>
			</div>

			<div class="flex flex-col items-center gap-4">
				{#if previewImage}
					<img
						src={previewImage}
						alt=""
						class="size-36 rounded-full border border-border object-cover shadow-md"
					/>
				{:else}
					<div class="scale-90">
						<Avatar name={displayName} />
					</div>
				{/if}
				<div
					class="text-center font-mono text-[10px] leading-relaxed tracking-[0.16em] text-muted-foreground uppercase"
				>
					{#if selectedFile}
						Previewing selected image<br />
						Confirm to update
					{:else}
						JPEG, PNG, WebP, or GIF<br />
						5 MB maximum
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<button
					type="button"
					class="flex w-full items-center gap-4 rounded-[6px] border border-border bg-[color-mix(in_oklch,var(--paper-warm-2)_58%,transparent)] p-3.5 text-left font-sans text-[0.95rem] font-medium text-ink transition-[background,border-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px enabled:hover:border-ink enabled:hover:bg-paper-warm-2 disabled:cursor-wait disabled:opacity-70"
					disabled={uploading}
					onclick={chooseProfileImage}
				>
					<span
						class="inline-flex size-10 items-center justify-center rounded-full bg-paper-warm-2 text-ink"
					>
						<ImageUpIcon class="size-5" />
					</span>
					<span>{selectedFile ? 'Choose a different image' : 'Upload from device'}</span>
				</button>
				{#if error}
					<p class="font-mono text-[11px] tracking-[0.1em] text-destructive uppercase" role="alert">
						{error}
					</p>
				{/if}
			</div>

			{#if selectedFile}
				<div class="flex items-center justify-end gap-2 pt-1">
					<button
						type="button"
						class="zg-btn zg-btn-ghost"
						disabled={uploading}
						onclick={closeDialog}
					>
						Cancel
					</button>
					<button
						type="button"
						class="zg-btn zg-btn-primary"
						disabled={uploading}
						onclick={() => void confirmProfileImage()}
					>
						{#if uploading}
							<Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
						{/if}
						<span>{uploading ? 'Updating...' : 'Use this picture'}</span>
					</button>
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.profile-image-button::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 999px;
		background: color-mix(in oklch, var(--ink) 18%, transparent);
		opacity: 0;
		transition: opacity 150ms ease;
	}
	.profile-image-button:hover::after {
		opacity: 1;
	}
</style>
