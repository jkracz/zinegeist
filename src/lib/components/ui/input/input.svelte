<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const inputVariants = tv({
		base: 'w-full min-w-0 border border-border text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
		variants: {
			variant: {
				default: 'rounded-[2px] bg-paper-warm-2 h-9 px-2.5 py-1 text-[14px]',
				pill: 'rounded-full bg-card h-9 px-3.5 py-2 text-[13px]',
				serif:
					'rounded-[2px] bg-background h-auto px-2 py-1.5 font-serif text-[20px] leading-[1.15] font-medium tracking-[-0.01em] [&::placeholder]:font-sans [&::placeholder]:text-[14px] [&::placeholder]:font-normal [&::placeholder]:tracking-normal'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type InputVariant = VariantProps<typeof inputVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	> & { variant?: InputVariant };

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		variant = 'default',
		'data-slot': dataSlot = 'input',
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(inputVariants({ variant }), className)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(inputVariants({ variant }), className)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
