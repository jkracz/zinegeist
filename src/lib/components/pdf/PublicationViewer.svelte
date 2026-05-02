<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { usePdfiumEngine } from '@embedpdf/engines/svelte';
	import { EmbedPDF } from '@embedpdf/core/svelte';
	import { createPluginRegistration } from '@embedpdf/core';
	import {
		DocumentManagerPluginPackage,
		DocumentContent
	} from '@embedpdf/plugin-document-manager/svelte';
	import { ViewportPluginPackage } from '@embedpdf/plugin-viewport/svelte';
	import { ScrollPluginPackage, ScrollStrategy } from '@embedpdf/plugin-scroll/svelte';
	import { SpreadPluginPackage, SpreadMode } from '@embedpdf/plugin-spread/svelte';
	import { RenderPluginPackage } from '@embedpdf/plugin-render/svelte';
	import { ZoomPluginPackage, ZoomMode } from '@embedpdf/plugin-zoom/svelte';
	import { Loader2 } from '@lucide/svelte';
	import { useIsMobile } from '$lib/hooks/useIsMobile.svelte';
	import ViewerToolbar, { type ViewMode } from './ViewerToolbar.svelte';
	import ViewerCanvas from './ViewerCanvas.svelte';

	interface Props {
		pdfUrl: string;
	}

	let { pdfUrl }: Props = $props();

	const mobile = useIsMobile();
	let viewMode = $state<ViewMode>('book');
	let didInit = $state(false);

	$effect(() => {
		if (didInit) return;
		viewMode = mobile.current ? 'single' : 'book';
		didInit = true;
	});

	$effect(() => {
		if (mobile.current && viewMode === 'book') {
			viewMode = 'single';
		}
	});

	function setViewMode(mode: ViewMode) {
		viewMode = mode;
	}

	const pdfEngine = usePdfiumEngine();

	const plugins = $derived([
		createPluginRegistration(DocumentManagerPluginPackage, {
			initialDocuments: [{ url: pdfUrl }]
		}),
		createPluginRegistration(ViewportPluginPackage),
		createPluginRegistration(ScrollPluginPackage, {
			defaultStrategy: ScrollStrategy.Horizontal
		}),
		createPluginRegistration(SpreadPluginPackage, { defaultSpreadMode: SpreadMode.None }),
		createPluginRegistration(RenderPluginPackage),
		createPluginRegistration(ZoomPluginPackage, { defaultZoomLevel: ZoomMode.FitPage })
	]);

	let containerEl = $state<HTMLDivElement | null>(null);
	let isFullscreen = $state(false);

	function handleFullscreenChange() {
		isFullscreen = document.fullscreenElement === containerEl;
	}

	$effect(() => {
		if (!browser) return;
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	});

	onDestroy(() => {
		if (browser && document.fullscreenElement === containerEl) {
			document.exitFullscreen().catch(() => {});
		}
	});
</script>

<div
	bind:this={containerEl}
	class="overflow-hidden rounded-md border border-border bg-background shadow-sm"
	class:fixed={isFullscreen}
	class:inset-0={isFullscreen}
	class:z-50={isFullscreen}
>
	{#if pdfEngine.isLoading || !pdfEngine.engine}
		<div class="flex h-[640px] items-center justify-center bg-paper-warm-2">
			<div class="flex items-center gap-2 text-muted-foreground">
				<Loader2 class="size-4 animate-spin" />
				<span class="font-mono text-xs tracking-wide">Loading viewer…</span>
			</div>
		</div>
	{:else if pdfEngine.error}
		<div class="flex h-[640px] items-center justify-center bg-paper-warm-2 px-6 text-center">
			<span class="font-mono text-xs tracking-wide text-muted-foreground">
				Couldn’t load PDF engine.
			</span>
		</div>
	{:else}
		<EmbedPDF engine={pdfEngine.engine} {plugins}>
			{#snippet children({ activeDocumentId })}
				{#if activeDocumentId}
					{@const documentId = activeDocumentId}
					<DocumentContent {documentId}>
						{#snippet children(state)}
							{#if state.isLoaded}
								<ViewerToolbar
									{documentId}
									{viewMode}
									{setViewMode}
									isMobile={mobile.current}
									{containerEl}
									{isFullscreen}
								/>
								<div
									class="relative bg-paper-warm-2"
									class:h-[calc(100vh-49px)]={isFullscreen}
									class:h-[640px]={!isFullscreen}
								>
									<ViewerCanvas {documentId} />
								</div>
							{:else if state.isError}
								<div
									class="flex h-[640px] items-center justify-center bg-paper-warm-2 px-6 text-center"
								>
									<span class="font-mono text-xs tracking-wide text-muted-foreground">
										Couldn’t open the document.
									</span>
								</div>
							{:else}
								<div class="flex h-[640px] items-center justify-center bg-paper-warm-2">
									<div class="flex items-center gap-2 text-muted-foreground">
										<Loader2 class="size-4 animate-spin" />
										<span class="font-mono text-xs tracking-wide">Loading document…</span>
									</div>
								</div>
							{/if}
						{/snippet}
					</DocumentContent>
				{/if}
			{/snippet}
		</EmbedPDF>
	{/if}
</div>
