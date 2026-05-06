<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	type Variant = 'compact' | 'page';
	let { variant = 'compact', footer }: { variant?: Variant; footer?: Snippet } = $props();

	const PRICING = resolve('/pricing');
</script>

{#if variant === 'compact'}
	<div class="group flex min-w-0 flex-col gap-3.5">
		<div class="relative">
			<div
				class="relative aspect-3/4 w-full rounded-[2px] bg-paper-warm-2/20 ring-1 ring-border/70 ring-inset"
			>
				<span class="absolute top-1.5 left-1.5 size-2.5 border-t border-l border-border"></span>
				<span class="absolute top-1.5 right-1.5 size-2.5 border-t border-r border-border"></span>
				<span class="absolute bottom-1.5 left-1.5 size-2.5 border-b border-l border-border"></span>
				<span class="absolute right-1.5 bottom-1.5 size-2.5 border-r border-b border-border"></span>
				<a
					href={PRICING}
					aria-label="Shelf full — subscribe to Plus for more room"
					class="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center no-underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
				>
					<div class="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
						Shelf full
					</div>
					<div
						class="font-serif text-[28px] leading-[1.04] font-normal tracking-[-0.015em] text-ink"
					>
						Subscribe for
						<span class="text-primary italic">more</span>
						room.
					</div>
				</a>
			</div>
		</div>
	</div>
{:else}
	<section class="px-6 pt-20 pb-32 md:px-12 md:pt-28">
		<div class="mx-auto max-w-[680px] text-center">
			<div class="mb-10 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
				Shelf full
			</div>
			<h1
				class="font-serif text-[clamp(48px,6.2vw,84px)] leading-[0.98] font-normal tracking-tight text-ink"
			>
				Your shelf is
				<span class="text-primary italic">full</span>.
			</h1>
			<p class="mx-auto mt-10 max-w-[44ch] font-serif text-[19px] leading-[1.55] text-foreground">
				Subscribe to Plus for more space.
			</p>
			<div class="mt-12 flex flex-wrap items-center justify-center gap-3">
				<a class="zg-btn zg-btn-primary !px-5 !py-2.5 !text-[13px]" href={PRICING}> See Plus </a>
				{#if footer}
					{@render footer()}
				{/if}
			</div>
		</div>
	</section>
{/if}
