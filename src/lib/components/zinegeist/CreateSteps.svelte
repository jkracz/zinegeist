<script lang="ts">
	type Props = {
		steps: string[];
		current: number;
	};
	let { steps, current }: Props = $props();
</script>

<div class="create-progress">
	{#each steps as label, i (label)}
		<div class="step" class:active={i === current} class:done={i < current}>
			<span class="dot">{i < current ? '✓' : i + 1}</span>
			<span>{label}</span>
		</div>
	{/each}
</div>

<style>
	.create-progress {
		display: flex;
		gap: 0;
		margin-bottom: 48px;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}
	.step {
		flex: 1;
		padding: 18px 16px;
		border-right: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.step:last-child {
		border-right: 0;
	}
	.step.active {
		color: var(--ink);
		background: color-mix(in oklch, var(--accent) 30%, transparent);
	}
	.step.done {
		color: var(--primary);
	}
	.dot {
		width: 18px;
		height: 18px;
		border-radius: 999px;
		border: 1px solid currentColor;
		display: grid;
		place-items: center;
		font-size: 10px;
	}
</style>
