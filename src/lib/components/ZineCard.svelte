<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { FunctionReturnType } from 'convex/server';

	type HomePublication = FunctionReturnType<typeof api.publications.listRecentPublished>[number];

	type Props = {
		publication: HomePublication;
		mini?: boolean;
		href: string;
	};

	let { publication, mini = false, href }: Props = $props();

	const dateFormatter = new Intl.DateTimeFormat('en', {
		month: 'short',
		year: 'numeric'
	});

	const dateLabel = $derived(
		dateFormatter.format(new Date(publication.publishedAt ?? publication.updatedAt))
	);
	const authorLabel = $derived(
		publication.author.name ?? publication.author.handle ?? 'Zinegeist writer'
	);
	const tagLabel = $derived(publication.tags.slice(0, 2).join(' · '));
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="zcard flex min-w-0 cursor-pointer flex-col gap-3.5 text-inherit no-underline" {href}>
	<div class="relative">
		<div
			class="cover relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-muted shadow-page"
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
	</div>
	<div
		class="flex items-center justify-between font-mono text-[11px] tracking-[0.06em] text-muted-foreground"
	>
		<span class="truncate">{tagLabel}</span>
		<span class="shrink-0">{dateLabel}</span>
	</div>
	<h3
		class="font-serif text-[22px] leading-[1.15] font-medium tracking-[-0.01em] [overflow-wrap:anywhere]"
	>
		{publication.title}
	</h3>
	<div class="text-[13px] text-muted-foreground italic">by {authorLabel}</div>
	{#if !mini && publication.description}
		<p class="desc m-0 overflow-hidden font-serif text-sm leading-[1.5] text-foreground">
			{publication.description}
		</p>
	{/if}
</a>

<style>
	.cover {
		transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.zcard:hover .cover {
		transform: translateY(-4px) rotate(-0.6deg);
	}
	.desc {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
