<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ToggleGroupPrimitive.ItemProps = $props();
</script>

<ToggleGroupPrimitive.Item
	bind:ref
	data-slot="toggle-group-item"
	class={cn(
		'eyebrow inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent px-3.5 py-1.5 transition-colors duration-150',
		'hover:text-ink!',
		'data-[state=on]:bg-ink data-[state=on]:text-paper-warm-1! data-[state=on]:hover:text-paper-warm-1!',
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
		'disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}
/>
