<script lang="ts">
	type Props = {
		steps: string[];
		current: number;
	};
	let { steps, current }: Props = $props();
</script>

<div class="mb-12 flex border-y border-border">
	{#each steps as label, i (label)}
		<div
			class="step flex flex-1 items-center gap-2.5 border-r border-border px-4 py-[18px] font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase last:border-r-0"
			class:active={i === current}
			class:done={i < current}
		>
			<span
				class="grid size-[18px] place-items-center rounded-full border border-current text-[10px]"
			>
				{i < current ? '✓' : i + 1}
			</span>
			<span>{label}</span>
		</div>
	{/each}
</div>

<style>
	.step.active {
		color: var(--ink);
		background: color-mix(in oklch, var(--accent) 30%, transparent);
	}
	.step.done {
		color: var(--primary);
	}
</style>
