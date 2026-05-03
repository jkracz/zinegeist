<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	let { count, limit }: { count: number; limit: number } = $props();

	const safeCount = $derived(Math.max(0, Math.min(count, limit)));
	const safeLimit = $derived(Math.max(1, limit));
	const visible = $derived(safeCount >= 3);
	const isWarning = $derived(safeCount === safeLimit - 1);
	const isFull = $derived(safeCount >= safeLimit);
	const showTooltip = $derived(isWarning || isFull);

	const label = $derived.by(() => {
		if (!visible) return '';
		if (isFull) return `${safeCount} of ${safeLimit} published`;
		if (isWarning) return `${safeCount} of ${safeLimit} – 1 slot left`;
		return `${safeCount} of ${safeLimit} published`;
	});

	const toneClass = $derived(isWarning || isFull ? 'text-primary' : 'text-muted-foreground');
</script>

{#if visible}
	{#if showTooltip}
		<Tooltip.Provider delayDuration={150}>
			<Tooltip.Root>
				<Tooltip.Trigger
					type="button"
					class="font-mono text-[10px] tracking-[0.2em] uppercase {toneClass} cursor-help focus-visible:outline-none"
					aria-label="About the publication limit"
				>
					{label}
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={8} class="font-mono text-[10px] tracking-[0.16em] uppercase">
					Shelves are currently limited to {safeLimit} publications.
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	{:else}
		<span class="font-mono text-[10px] tracking-[0.2em] uppercase {toneClass}">
			{label}
		</span>
	{/if}
{/if}
