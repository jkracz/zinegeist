<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const textareaVariants = tv({
		base: 'field-sizing-content flex w-full border border-border text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
		variants: {
			variant: {
				default: 'rounded-[2px] bg-paper-warm-2 min-h-16 px-2.5 py-2 text-[14px]',
				serif:
					'rounded-[2px] bg-background min-h-16 px-2 py-1.5 font-serif text-[14px] leading-[1.5]'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type TextareaVariant = VariantProps<typeof textareaVariants>['variant'];
</script>

<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		variant = 'default',
		'data-slot': dataSlot = 'textarea',
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
		variant?: TextareaVariant;
	} = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(textareaVariants({ variant }), className)}
	bind:value
	{...restProps}
></textarea>
