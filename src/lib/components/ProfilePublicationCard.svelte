<script lang="ts">
	import { resolve } from '$app/paths';
	import PublicationStatusBadge from '$lib/components/PublicationStatusBadge.svelte';

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

	type Props = {
		publication: ProfilePublication;
		showStatus?: boolean;
	};

	let { publication, showStatus = false }: Props = $props();

	const dateFormatter = new Intl.DateTimeFormat('en', {
		month: 'short',
		year: 'numeric'
	});

	const dateLabel = $derived.by(() => {
		if (publication.status === 'draft') return 'Draft';
		if (publication.status === 'unpublished') return 'Unpublished';
		const timestamp = publication.publishedAt ?? publication.updatedAt;
		return dateFormatter.format(new Date(timestamp));
	});

	const tagLabel = $derived(publication.tags.slice(0, 2).join(' / ') || 'Published');
</script>

{#snippet cardContents()}
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
					<div>
						<div class="font-serif text-[24px] leading-[1.05] font-medium text-ink">
							{publication.title}
						</div>
						<div
							class="mt-2 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase"
						>
							{tagLabel}
						</div>
					</div>
				</div>
			{/if}
			<div class="cover-edge"></div>
		</div>
		<div
			class="hover-rule pointer-events-none absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-ink/70 transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-x-100"
		></div>
	</div>

	{#if showStatus}
		<div>
			<PublicationStatusBadge status={publication.status} />
		</div>
	{/if}

	<div
		class="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.06em] text-muted-foreground"
	>
		<span class="truncate">{tagLabel}</span>
		<span class="shrink-0">{dateLabel}</span>
	</div>
	<h3 class="line-clamp-2 font-serif text-[22px] leading-[1.15] font-medium tracking-[-0.01em]">
		{publication.title}
	</h3>
	{#if publication.description}
		<p class="m-0 line-clamp-2 overflow-hidden font-serif text-sm leading-[1.5] text-foreground">
			{publication.description}
		</p>
	{/if}
{/snippet}

{#if publication.slug}
	<a
		class="group flex min-w-0 cursor-pointer flex-col gap-3.5 text-inherit no-underline"
		href={resolve('/publication/[id]', { id: publication.slug })}
	>
		{@render cardContents()}
	</a>
{:else}
	<div class="group flex min-w-0 cursor-default flex-col gap-3.5 text-inherit">
		{@render cardContents()}
	</div>
{/if}

<style>
	.group:hover .cover-frame {
		box-shadow:
			0 1px 0 hsl(20 18% 35% / 0.14),
			0 16px 28px -10px hsl(20 18% 30% / 0.26),
			0 36px 60px -22px hsl(20 18% 25% / 0.3);
	}
</style>
