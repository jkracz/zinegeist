<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '$convex/_generated/api';
	import * as Command from '$lib/components/ui/command';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let query = $state('');
	const trimmedQuery = $derived(query.trim());
	const hasQuery = $derived(trimmedQuery.length > 0);

	const latest = useQuery(api.search.latestSuggestions, () => (hasQuery ? 'skip' : {}));
	const publications = useQuery(api.search.searchPublications, () =>
		hasQuery ? { query: trimmedQuery } : 'skip'
	);
	const profiles = useQuery(api.search.searchProfiles, () =>
		hasQuery ? { query: trimmedQuery } : 'skip'
	);

	const publicationResults = $derived(
		hasQuery ? (publications.data ?? []) : (latest.data?.publications ?? [])
	);
	const profileResults = $derived(hasQuery ? (profiles.data ?? []) : (latest.data?.profiles ?? []));

	const isLoading = $derived(
		hasQuery ? publications.isLoading || profiles.isLoading : latest.isLoading
	);

	const showEmpty = $derived(
		hasQuery && !isLoading && publicationResults.length === 0 && profileResults.length === 0
	);
	const showSkeleton = $derived(
		isLoading && publicationResults.length === 0 && profileResults.length === 0
	);

	function selectPublication(slug: string) {
		open = false;
		query = '';
		void goto(resolve('/publication/[id]', { id: slug }));
	}

	function selectProfile(handle: string) {
		open = false;
		query = '';
		void goto(resolve('/profile/[handle]', { handle }));
	}

	function initials(name: string | null, handle: string): string {
		const source = name?.trim() || handle;
		const parts = source.split(/\s+/).slice(0, 2);
		return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
	}

	$effect(() => {
		if (!open) query = '';
	});
</script>

<Command.Dialog bind:open shouldFilter={false} title="Search" description="Find zines and writers">
	<Command.Input bind:value={query} placeholder="Search zines and writers..." />
	<Command.List>
		{#if showEmpty}
			<Command.Empty>No results found.</Command.Empty>
		{/if}

		{#if showSkeleton}
			<div class="overflow-hidden p-1" role="presentation" aria-hidden="true">
				{#each Array.from({ length: 4 }), i (i)}
					<div class="flex items-center gap-2 px-2 py-1.5">
						<Skeleton class="size-8 shrink-0 rounded-sm" />
						<div class="flex min-w-0 flex-1 flex-col gap-1.5">
							<Skeleton class="h-3 w-3/5" />
							<Skeleton class="h-2.5 w-2/5" />
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if publicationResults.length > 0}
			<Command.Group heading={hasQuery ? 'Publications' : 'Recent publications'}>
				{#each publicationResults as pub (pub.id)}
					<Command.Item
						value={`publication:${pub.id}`}
						onSelect={() => selectPublication(pub.slug)}
					>
						{#if pub.coverUrl}
							<img
								src={pub.coverUrl}
								alt=""
								class="size-8 shrink-0 rounded-sm object-cover"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground"
							>
								<BookOpenIcon class="size-4" />
							</div>
						{/if}
						<div class="flex min-w-0 flex-1 flex-col">
							<span class="truncate text-sm font-medium">{pub.title}</span>
							{#if pub.authorName || pub.authorHandle}
								<span class="truncate text-xs text-muted-foreground">
									by {pub.authorName ?? `@${pub.authorHandle}`}
								</span>
							{/if}
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}

		{#if publicationResults.length > 0 && profileResults.length > 0}
			<Command.Separator />
		{/if}

		{#if profileResults.length > 0}
			<Command.Group heading={hasQuery ? 'Writers' : 'Recent writers'}>
				{#each profileResults as profile (profile.handle)}
					<Command.Item
						value={`profile:${profile.handle}`}
						onSelect={() => selectProfile(profile.handle)}
					>
						<Avatar.Root class="size-8 shrink-0">
							{#if profile.image}
								<Avatar.Image src={profile.image} alt={profile.name ?? profile.handle} />
							{/if}
							<Avatar.Fallback class="text-xs">
								{initials(profile.name, profile.handle)}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex min-w-0 flex-1 flex-col">
							<span class="truncate text-sm font-medium">
								{profile.name ?? `@${profile.handle}`}
							</span>
							<span class="truncate text-xs text-muted-foreground">@{profile.handle}</span>
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
