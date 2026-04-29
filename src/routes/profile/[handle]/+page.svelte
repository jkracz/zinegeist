<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import SectionBar from '$lib/components/SectionBar.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { useConvexClient } from '@mmailaender/convex-svelte';
	import { api } from '$convex/_generated/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type Link = { label: string; url: string };
	type Draft = {
		handle: string;
		bio: string;
		location: string;
		links: Link[];
	};

	function snapshot(): Draft {
		return {
			handle: data.profileView.handle,
			bio: data.profileView.bio ?? '',
			location: data.profileView.location ?? '',
			links: data.profileView.links.map((l) => ({ label: l.label, url: l.url }))
		};
	}

	let editing = $state(false);
	let draft = $state<Draft>(snapshot());
	let saving = $state(false);
	let error = $state<string | null>(null);

	const client = useConvexClient();
	const displayName = $derived(data.profileView.name?.trim() || 'Writer');

	function startEdit() {
		draft = snapshot();
		error = null;
		editing = true;
	}

	function cancelEdit() {
		draft = snapshot();
		error = null;
		editing = false;
	}

	function addLink() {
		draft.links = [...draft.links, { label: '', url: '' }];
	}

	function removeLink(index: number) {
		draft.links = draft.links.filter((_, i) => i !== index);
	}

	async function save(event: SubmitEvent) {
		event.preventDefault();
		if (saving) return;
		saving = true;
		error = null;

		try {
			const cleanedLinks = draft.links
				.map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
				.filter((l) => l.label && l.url);

			const result = await client.mutation(api.profiles.updateProfile, {
				handle: draft.handle.trim().toLowerCase(),
				bio: draft.bio,
				location: draft.location,
				links: cleanedLinks
			});

			await invalidateAll();
			editing = false;
			if (result.handle !== data.profileView.handle) {
				await goto(resolve('/profile/[handle]', { handle: result.handle }), {
					invalidateAll: true
				});
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not save your profile.';
		} finally {
			saving = false;
		}
	}
</script>

<SectionBar crumbs={['Writer', displayName]}>
	{#snippet right()}
		{#if data.isOwnProfile}
			<Tooltip.Provider delayDuration={150}>
				{#if editing}
					<Tooltip.Root>
						<Tooltip.Trigger
							type="button"
							onclick={cancelEdit}
							disabled={saving}
							aria-label="Cancel"
							class="inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
						>
							<XIcon class="size-4" />
						</Tooltip.Trigger>
						<Tooltip.Content>Cancel</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root>
						<Tooltip.Trigger
							type="submit"
							form="profile-edit-form"
							disabled={saving}
							aria-label={saving ? 'Saving' : 'Save'}
							class="inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
						>
							{#if saving}
								<Loader2Icon class="size-4 animate-spin" />
							{:else}
								<CheckIcon class="size-4" />
							{/if}
						</Tooltip.Trigger>
						<Tooltip.Content>{saving ? 'Saving…' : 'Save'}</Tooltip.Content>
					</Tooltip.Root>
				{:else}
					<Tooltip.Root>
						<Tooltip.Trigger
							type="button"
							onclick={startEdit}
							aria-label="Edit profile"
							class="inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
						>
							<SquarePenIcon class="size-4" />
						</Tooltip.Trigger>
						<Tooltip.Content>Edit profile</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</Tooltip.Provider>
		{/if}
	{/snippet}
</SectionBar>

<div class="px-12 pb-24">
	<form id="profile-edit-form" onsubmit={save}>
		<div class="grid grid-cols-[180px_1fr] items-start gap-9 border-b border-border pt-14 pb-9">
			{#if data.profileView.image}
				<img
					src={data.profileView.image}
					alt={displayName}
					class="size-40 rounded-full border border-border object-cover shadow-md"
				/>
			{:else}
				<Avatar name={displayName} />
			{/if}

			<div class="flex flex-col gap-4">
				<div>
					<div class="eyebrow">Writer</div>
					<h1 class="font-serif text-[64px] leading-none font-normal tracking-[-0.025em]">
						{displayName}
					</h1>

					{#if editing}
						<div class="mt-4 flex max-w-md flex-col gap-1.5">
							<Label for="handle">Handle</Label>
							<div class="flex items-center gap-1.5">
								<span class="font-mono text-sm text-muted-foreground">@</span>
								<Input
									id="handle"
									type="text"
									bind:value={draft.handle}
									autocomplete="off"
									autocapitalize="none"
									spellcheck="false"
									required
									minlength={3}
									maxlength={30}
									disabled={saving}
									class="flex-1"
								/>
							</div>
						</div>
					{:else}
						<div class="mt-3 font-mono text-xs tracking-[0.1em] text-muted-foreground">
							@{data.profileView.handle}
						</div>
					{/if}
				</div>

				{#if editing}
					<div class="flex max-w-xl flex-col gap-1.5">
						<Label for="bio">Bio</Label>
						<Textarea
							id="bio"
							bind:value={draft.bio}
							rows={4}
							placeholder="Write a short bio."
							disabled={saving}
						/>
					</div>

					<div class="flex max-w-md flex-col gap-1.5">
						<Label for="location"
							>Location <span class="text-muted-foreground">(optional)</span></Label
						>
						<Input
							id="location"
							type="text"
							bind:value={draft.location}
							placeholder="e.g. Buenos Aires"
							disabled={saving}
						/>
					</div>

					<div class="flex max-w-2xl flex-col gap-2">
						<Label>Links <span class="text-muted-foreground">(optional)</span></Label>
						{#each draft.links as link, index (index)}
							<div class="flex items-center gap-2">
								<Input
									type="text"
									bind:value={link.label}
									placeholder="Label"
									disabled={saving}
									class="w-40 shrink-0"
								/>
								<Input
									type="url"
									bind:value={link.url}
									placeholder="https://"
									disabled={saving}
									class="flex-1"
								/>
								<button
									type="button"
									class="zg-btn zg-btn-ghost !px-3 !py-2 !text-xs"
									onclick={() => removeLink(index)}
									disabled={saving}
									aria-label="Remove link"
								>
									Remove
								</button>
							</div>
						{/each}
						<button
							type="button"
							class="zg-btn zg-btn-outline self-start !px-3 !py-2 !text-xs"
							onclick={addLink}
							disabled={saving}
						>
							＋ Add link
						</button>
					</div>

					{#if error}
						<p class="text-sm text-destructive" role="alert">{error}</p>
					{/if}
				{:else}
					{#if data.profileView.bio}
						<p class="max-w-[56ch] font-serif text-lg leading-[1.55] text-foreground">
							{data.profileView.bio}
						</p>
					{/if}

					{#if data.profileView.location}
						<div class="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
							{data.profileView.location}
						</div>
					{/if}

					{#if data.profileView.links.length > 0}
						<ul class="flex flex-col gap-2">
							{#each data.profileView.links as link (link.url)}
								<li>
									<a
										href={link.url}
										rel="noreferrer"
										target="_blank"
										class="font-serif text-base text-ink underline-offset-2 hover:underline"
									>
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</div>
		</div>
	</form>
</div>
