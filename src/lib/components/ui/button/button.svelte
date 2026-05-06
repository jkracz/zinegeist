<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent font-sans font-medium whitespace-nowrap transition-[transform,background-color,border-color,color] duration-150 outline-none select-none active:not-aria-[haspopup]:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default:
					'bg-ink text-paper-warm-1 hover:bg-[color-mix(in_oklch,var(--ink)_88%,var(--primary)_12%)]',
				outline:
					'border-ink bg-transparent text-ink hover:bg-ink hover:text-paper-warm-1 aria-expanded:bg-ink aria-expanded:text-paper-warm-1',
				ghost:
					'bg-transparent text-ink hover:bg-[color-mix(in_oklch,var(--accent)_60%,transparent)] aria-expanded:bg-[color-mix(in_oklch,var(--accent)_60%,transparent)]',
				secondary: 'bg-card text-ink hover:bg-[color-mix(in_oklch,var(--accent)_60%,transparent)]',
				destructive:
					'border-[oklch(0.42_0.13_30)] bg-[oklch(0.42_0.13_30)] text-paper-warm-1 hover:border-[oklch(0.36_0.14_30)] hover:bg-[oklch(0.36_0.14_30)]',
				link: 'text-ink underline-offset-4 hover:underline'
			},
			size: {
				default: 'px-[18px] py-[10px] text-[14px]',
				sm: 'px-4 py-2 text-[13px]',
				xs: 'px-3 py-1.5 text-[12px]',
				lg: 'px-[22px] py-3 text-[15px]',
				icon: 'size-10 p-0',
				'icon-xs': "size-7 p-0 [&_svg:not([class*='size-'])]:size-3.5",
				'icon-sm': 'size-8 p-0',
				'icon-lg': 'size-11 p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
