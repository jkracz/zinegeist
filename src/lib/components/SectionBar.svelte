<script lang="ts">
	import type { Snippet } from 'svelte';

	export type Crumb = string | { label: string; href: string };

	type Props = {
		crumbs: Crumb[];
		right?: Snippet;
	};

	let { crumbs, right }: Props = $props();

	function labelOf(c: Crumb): string {
		return typeof c === 'string' ? c : c.label;
	}
	function hrefOf(c: Crumb): string | null {
		return typeof c === 'string' ? null : c.href;
	}
</script>

<div class="flex h-12 items-center justify-between border-b border-border bg-background px-12">
	<div class="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
		{#each crumbs as crumb, i (i)}
			{#if i > 0}<span class="mx-2.5">/</span>{/if}
			{#if i === crumbs.length - 1}
				<strong class="font-medium text-ink">{labelOf(crumb)}</strong>
			{:else if hrefOf(crumb)}
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					href={hrefOf(crumb)}
					class="transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
				>
					{labelOf(crumb)}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{:else}
				<span>{labelOf(crumb)}</span>
			{/if}
		{/each}
	</div>
	<div class="flex items-center gap-3">
		{#if right}{@render right()}{/if}
	</div>
</div>
