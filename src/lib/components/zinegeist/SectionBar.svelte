<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		crumbs: string[];
		right?: Snippet;
	};

	let { crumbs, right }: Props = $props();
</script>

<div class="section-bar">
	<div class="crumbs">
		{#each crumbs as crumb, i (i)}
			{#if i > 0}<span class="sep">/</span>{/if}
			{#if i === crumbs.length - 1}
				<strong>{crumb}</strong>
			{:else}
				<span>{crumb}</span>
			{/if}
		{/each}
	</div>
	<div class="right">
		{#if right}{@render right()}{/if}
	</div>
</div>

<style>
	.section-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 48px;
		border-bottom: 1px solid var(--border);
		background: var(--background);
	}
	.crumbs {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}
	.crumbs strong {
		color: var(--ink);
		font-weight: 500;
	}
	.sep {
		margin: 0 10px;
	}
	.right {
		display: flex;
		align-items: center;
		gap: 12px;
	}
</style>
