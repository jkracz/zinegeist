<script lang="ts" module>
	export type ViewMode = 'book' | 'single' | 'scroll';
</script>

<script lang="ts">
	import { useScroll, ScrollStrategy } from '@embedpdf/plugin-scroll/svelte';
	import { useSpread, SpreadMode } from '@embedpdf/plugin-spread/svelte';
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

	interface Props {
		documentId: string;
		viewMode: ViewMode;
		setViewMode: (mode: ViewMode) => void;
		isMobile: boolean;
		containerEl: HTMLElement | null;
		isFullscreen: boolean;
	}

	let { documentId, viewMode, setViewMode, isMobile, containerEl, isFullscreen }: Props = $props();

	const scroll = useScroll(() => documentId);
	const spread = useSpread(() => documentId);
	const zoom = useZoom(() => documentId);

	const VIEW_MODE_CONFIG: Record<ViewMode, { strategy: ScrollStrategy; spread: SpreadMode }> = {
		book: { strategy: ScrollStrategy.Horizontal, spread: SpreadMode.Odd },
		single: { strategy: ScrollStrategy.Horizontal, spread: SpreadMode.None },
		scroll: { strategy: ScrollStrategy.Vertical, spread: SpreadMode.None }
	};

	$effect(() => {
		const config = VIEW_MODE_CONFIG[viewMode];
		if (!scroll.provides || !spread.provides) return;
		scroll.provides.setScrollStrategy(config.strategy);
		spread.provides.setSpreadMode(config.spread);
	});

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

	function toggleFullscreen() {
		if (!containerEl) return;
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			containerEl.requestFullscreen();
		}
	}
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
	</div>
</div>
