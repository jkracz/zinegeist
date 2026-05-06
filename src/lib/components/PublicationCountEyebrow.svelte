<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	let {
		count,
		limit,
		isPlus = false
	}: { count: number; limit: number; isPlus?: boolean } = $props();

	const safeCount = $derived(Math.max(0, Math.min(count, limit)));
	const safeLimit = $derived(Math.max(1, limit));
	const visible = $derived(safeCount >= 3);
	const isWarning = $derived(safeCount === safeLimit - 1);
	const isFull = $derived(safeCount >= safeLimit);
	const showTooltip = $derived(!isPlus && (isWarning || isFull));

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
					class="eyebrow-sm {toneClass} cursor-help rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					aria-label="About the publication limit"
				>
					{label}
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={8} class="eyebrow-sm">
					Free shelves are limited to {safeLimit} publications. Subscribe to Plus for a larger shelf.
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	{:else}
		<span class="eyebrow-sm {toneClass}">
			{label}
		</span>
	{/if}
{/if}
