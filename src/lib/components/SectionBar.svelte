<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		crumbs: string[];
		right?: Snippet;
	};

	let { crumbs, right }: Props = $props();
</script>

<div class="flex h-12 items-center justify-between border-b border-border bg-background px-12">
	<div class="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
		{#each crumbs as crumb, i (i)}
			{#if i > 0}<span class="mx-2.5">/</span>{/if}
			{#if i === crumbs.length - 1}
				<strong class="font-medium text-ink">{crumb}</strong>
			{:else}
				<span>{crumb}</span>
			{/if}
		{/each}
	</div>
	<div class="flex items-center gap-3">
		{#if right}{@render right()}{/if}
	</div>
</div>
