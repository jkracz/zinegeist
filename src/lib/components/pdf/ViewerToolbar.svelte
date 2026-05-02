<script lang="ts" module>
	export type ViewMode = 'book' | 'single' | 'scroll';
</script>

<script lang="ts">
	import { useScroll } from '@embedpdf/plugin-scroll/svelte';
	import { useZoom } from '@embedpdf/plugin-zoom/svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import Maximize from '@lucide/svelte/icons/maximize';
	import Minimize from '@lucide/svelte/icons/minimize';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import FileText from '@lucide/svelte/icons/file-text';
	import Rows from '@lucide/svelte/icons/rows-3';
	import X from '@lucide/svelte/icons/x';

	interface Props {
		documentId: string;
		viewMode: ViewMode;
		setViewMode: (mode: ViewMode) => void;
		isMobile: boolean;
		isFullscreen: boolean;
		toggleFullscreen: () => void;
		onClose: () => void;
	}

	let {
		documentId,
		viewMode,
		setViewMode,
		isMobile,
		isFullscreen,
		toggleFullscreen,
		onClose
	}: Props = $props();

	const scroll = useScroll(() => documentId);
	const zoom = useZoom(() => documentId);

	const modes = $derived(
		[
			!isMobile && { value: 'book' as const, label: 'Book', icon: BookOpen },
			{ value: 'single' as const, label: 'Page', icon: FileText },
			{ value: 'scroll' as const, label: 'Scroll', icon: Rows }
		].filter(Boolean) as Array<{
			value: ViewMode;
			label: string;
			icon: typeof BookOpen;
		}>
	);
</script>

<div
	class="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-3 py-2"
>
	<div class="flex items-center gap-1">
		<Button
			variant="ghost"
			size="icon-sm"
			onclick={() => scroll.provides?.scrollToPreviousPage('smooth')}
			disabled={scroll.state.currentPage <= 1}
			aria-label="Previous page"
		>
			<ChevronLeft />
		</Button>
		<span class="font-mono text-[11px] tracking-wide text-muted-foreground tabular-nums">
			{scroll.state.currentPage} / {scroll.state.totalPages || '—'}
		</span>
		<Button
			variant="ghost"
			size="icon-sm"
			onclick={() => scroll.provides?.scrollToNextPage('smooth')}
			disabled={scroll.state.currentPage >= scroll.state.totalPages}
			aria-label="Next page"
		>
			<ChevronRight />
		</Button>
	</div>

	<div role="radiogroup" class="inline-flex rounded-lg border border-border bg-background p-0.5">
		{#each modes as mode (mode.value)}
			{@const Icon = mode.icon}
			{@const active = viewMode === mode.value}
			<button
				type="button"
				role="radio"
				aria-checked={active}
				onclick={() => setViewMode(mode.value)}
				class={cn(
					'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors',
					active
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'text-muted-foreground hover:bg-muted hover:text-foreground'
				)}
			>
				<Icon class="size-3.5" />
				<span class="hidden sm:inline">{mode.label}</span>
			</button>
		{/each}
	</div>

	<div class="flex items-center gap-1">
		<Button
			variant="ghost"
			size="icon-sm"
			onclick={() => zoom.provides?.zoomOut()}
			aria-label="Zoom out"
		>
			<ZoomOut />
		</Button>
		<Button
			variant="ghost"
			size="icon-sm"
			onclick={() => zoom.provides?.zoomIn()}
			aria-label="Zoom in"
		>
			<ZoomIn />
		</Button>
		<Button
			variant="ghost"
			size="icon-sm"
			onclick={toggleFullscreen}
			aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
		>
			{#if isFullscreen}
				<Minimize />
			{:else}
				<Maximize />
			{/if}
		</Button>
		<div class="mx-1 h-5 w-px bg-border" aria-hidden="true"></div>
		<Button variant="ghost" size="icon-sm" onclick={onClose} aria-label="Close reader">
			<X />
		</Button>
	</div>
</div>
