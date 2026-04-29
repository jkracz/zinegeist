<script lang="ts">
	import Check from '@lucide/svelte/icons/check';

	type Props = {
		steps: string[];
		current: number;
		canSelect?: (index: number) => boolean;
		onSelect?: (index: number) => void;
	};
	let { steps, current, canSelect, onSelect }: Props = $props();
</script>

<div class="mb-12 flex border-y border-border">
	{#each steps as label, i (label)}
		{@const enabled = i !== current && (canSelect?.(i) ?? Boolean(onSelect))}
		<button
			type="button"
			class="step flex flex-1 items-center gap-2.5 border-r border-border px-4 py-[18px] text-left font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase transition-colors last:border-r-0 enabled:hover:bg-[color-mix(in_oklch,var(--accent)_18%,transparent)] disabled:cursor-default"
			class:active={i === current}
			class:done={i < current}
			disabled={!enabled}
			aria-current={i === current ? 'step' : undefined}
			onclick={() => onSelect?.(i)}
		>
			<span
				class="grid size-[18px] place-items-center rounded-full border border-current font-sans text-[10px] leading-none tracking-normal"
				class:done-marker={i < current}
			>
				{#if i < current}
					<Check class="size-[12px]" strokeWidth={3} aria-hidden="true" />
				{:else}
					{i + 1}
				{/if}
			</span>
			<span>{label}</span>
		</button>
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
	.done-marker {
		background: var(--primary);
		border-color: var(--primary);
		color: var(--primary-foreground, var(--background));
	}
</style>
