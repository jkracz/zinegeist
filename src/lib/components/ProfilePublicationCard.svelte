<script lang="ts">
	import { resolve } from '$app/paths';
	import PublicationStatusBadge from '$lib/components/PublicationStatusBadge.svelte';
	import TagInput from '$lib/components/create/TagInput.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	type PublicationStatus = 'draft' | 'published' | 'unpublished';

	type ProfilePublication = {
		id: string;
		title: string;
		description: string | null;
		tags: string[];
		status: PublicationStatus;
		slug: string | null;
		publishedAt: number | null;
		updatedAt: number;
		coverUrl: string | null;
	};

	type Action = 'edit' | 'unpublish' | 'republish' | 'delete';

	type Props = {
		publication: ProfilePublication;
		ownerMode?: boolean;
		editing?: boolean;
		saving?: boolean;
		editError?: string | null;
		onAction?: (action: Action, publication: ProfilePublication) => void;
		onSaveEdit?: (
			id: string,
			payload: { title: string; description: string; tags: string[] }
		) => void;
		onCancelEdit?: () => void;
	};

	let {
		publication,
		ownerMode = false,
		editing = false,
		saving = false,
		editError = null,
		onAction,
		onSaveEdit,
		onCancelEdit
	}: Props = $props();

	const dateFormatter = new Intl.DateTimeFormat('en', {
		month: 'short',
		year: 'numeric'
	});

	const dateLabel = $derived.by(() => {
		const timestamp = publication.publishedAt ?? publication.updatedAt;
		return dateFormatter.format(new Date(timestamp));
	});

	const tagLabel = $derived(publication.tags.join(' · '));

	let editTitle = $state('');
	let editDescription = $state('');
	let editTags = $state<string[]>([]);
	let tagInput = $state<TagInput | null>(null);
	let lastEditingId: string | null = null;

	$effect(() => {
		if (editing && lastEditingId !== publication.id) {
			editTitle = publication.title;
			editDescription = publication.description ?? '';
			editTags = [...publication.tags];
			lastEditingId = publication.id;
		} else if (!editing) {
			lastEditingId = null;
		}
	});

	function handleSave(event: SubmitEvent) {
		event.preventDefault();
		tagInput?.flush();
		onSaveEdit?.(publication.id, {
			title: editTitle,
			description: editDescription,
			tags: editTags
		});
	}
</script>

{#snippet coverFrame()}
	<div class="relative">
		<div
			class="cover-frame relative aspect-3/4 w-full overflow-hidden rounded-[2px] bg-muted shadow-page transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:-translate-y-1.5"
		>
			{#if publication.coverUrl}
				<img
					src={publication.coverUrl}
					alt="{publication.title} cover"
					class="absolute inset-0 size-full object-cover"
				/>
			{:else}
				<div class="absolute inset-0 flex flex-col justify-between bg-paper-warm-2 p-4">
					<div
						class="flex justify-between font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase"
					>
						<span>{dateLabel}</span>
						<span>ZG</span>
					</div>
					<div class="min-w-0">
						<div
							class="line-clamp-4 font-serif text-[24px] leading-[1.05] font-medium text-balance [overflow-wrap:anywhere] text-ink"
						>
							{publication.title}
						</div>
						{#if tagLabel}
							<div
								class="mt-2 truncate font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase"
							>
								{tagLabel}
							</div>
						{/if}
					</div>
				</div>
			{/if}
			<div class="cover-edge"></div>
		</div>
		{#if !editing}
			<div
				class="hover-rule pointer-events-none absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-ink/70 transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-x-100"
			></div>
		{/if}
	</div>
{/snippet}

{#snippet readingMeta()}
	<div
		class="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.06em] text-muted-foreground"
	>
		{#if tagLabel}
			<span class="truncate">{tagLabel}</span>
		{:else}
			<span></span>
		{/if}
		<span class="shrink-0">{dateLabel}</span>
	</div>
	<h3
		class="font-serif text-[22px] leading-[1.15] font-medium tracking-[-0.01em] text-balance [overflow-wrap:anywhere] hyphens-auto"
	>
		{publication.title}
	</h3>
	{#if publication.description}
		<p
			class="m-0 line-clamp-3 overflow-hidden font-serif text-sm leading-[1.5] [overflow-wrap:anywhere] text-foreground"
		>
			{publication.description}
		</p>
	{/if}
{/snippet}

<div class="flex min-w-0 flex-col gap-3.5">
	{#if editing}
		<div class="flex min-w-0 flex-col gap-3.5">
			{@render coverFrame()}

			<form class="flex flex-col gap-3" onsubmit={handleSave}>
				<div class="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/80 uppercase">
					Editing
				</div>
				<Input
					id="edit-title-{publication.id}"
					bind:value={editTitle}
					placeholder="Title"
					maxlength={140}
					required
					disabled={saving}
					class="!h-auto !rounded-[2px] !border-border !bg-background !px-2 !py-1.5 font-serif !text-[20px] !leading-[1.15] font-medium tracking-[-0.01em]"
				/>
				<Textarea
					id="edit-description-{publication.id}"
					bind:value={editDescription}
					placeholder="A short note for readers."
					maxlength={1200}
					rows={4}
					disabled={saving}
					class="!rounded-[2px] !border-border !bg-background font-serif !text-sm !leading-[1.5]"
				/>
				<TagInput bind:this={tagInput} bind:tags={editTags} id="edit-tags-{publication.id}" />
				{#if editError}
					<p class="text-xs text-destructive" role="alert">{editError}</p>
				{/if}
				<div class="mt-1 flex items-center gap-2 border-t border-border/70 pt-3">
					<button
						type="button"
						class="card-action"
						disabled={saving}
						onclick={() => onCancelEdit?.()}
					>
						Cancel
					</button>
					<span aria-hidden="true" class="action-sep">·</span>
					<button type="submit" class="card-action card-action-strong" disabled={saving}>
						{#if saving}
							<Loader2Icon class="inline size-3 animate-spin" aria-hidden="true" />
							<span>Saving</span>
						{:else}
							<span>Save changes</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	{:else if publication.slug && publication.status !== 'draft'}
		<a
			class="group flex min-w-0 cursor-pointer flex-col gap-3.5 text-inherit no-underline"
			href={resolve('/publication/[id]', { id: publication.slug })}
		>
			{@render coverFrame()}
			{#if ownerMode}
				<PublicationStatusBadge status={publication.status} />
			{/if}
			{@render readingMeta()}
		</a>
	{:else}
		<div class="group flex min-w-0 cursor-default flex-col gap-3.5 text-inherit">
			{@render coverFrame()}
			{#if ownerMode}
				<PublicationStatusBadge status={publication.status} />
			{/if}
			{@render readingMeta()}
		</div>
	{/if}

	{#if ownerMode && !editing}
		<div
			class="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/70 pt-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
		>
			{#if publication.status === 'draft'}
				<a
					class="card-action"
					href="{resolve('/create')}?draft={publication.id}"
					aria-label="Resume draft: {publication.title}"
				>
					Resume
				</a>
			{:else if publication.status === 'unpublished'}
				<button
					type="button"
					class="card-action"
					onclick={() => onAction?.('republish', publication)}
				>
					Republish
				</button>
				<span aria-hidden="true" class="action-sep">·</span>
				<button type="button" class="card-action" onclick={() => onAction?.('edit', publication)}>
					Edit
				</button>
			{:else}
				<button type="button" class="card-action" onclick={() => onAction?.('edit', publication)}>
					Edit
				</button>
				<span aria-hidden="true" class="action-sep">·</span>
				<button
					type="button"
					class="card-action"
					onclick={() => onAction?.('unpublish', publication)}
				>
					Unpublish
				</button>
			{/if}
			<button
				type="button"
				class="card-action card-action-destructive ml-auto"
				onclick={() => onAction?.('delete', publication)}
			>
				Delete
			</button>
		</div>
	{/if}
</div>

<style>
	.group:hover .cover-frame {
		box-shadow:
			0 1px 0 hsl(20 18% 35% / 0.14),
			0 16px 28px -10px hsl(20 18% 30% / 0.26),
			0 36px 60px -22px hsl(20 18% 25% / 0.3);
	}

	.card-action {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 2px 0;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: var(--muted-foreground);
		background: transparent;
		border-radius: 2px;
		text-decoration: none;
		transition:
			color 150ms ease,
			text-decoration-color 150ms ease;
	}
	.card-action:hover:not(:disabled),
	.card-action:focus-visible {
		color: var(--ink);
		outline: none;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-decoration-color: var(--ink);
		text-underline-offset: 4px;
	}
	.card-action:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.card-action-strong {
		color: var(--ink);
	}
	.card-action-destructive {
		color: oklch(0.5 0.1 30);
	}
	.card-action-destructive:hover:not(:disabled),
	.card-action-destructive:focus-visible {
		color: oklch(0.4 0.14 30);
		text-decoration-color: oklch(0.4 0.14 30);
	}
	.action-sep {
		color: color-mix(in oklch, var(--muted-foreground) 50%, transparent);
	}
</style>
