<script lang="ts">
	import { browser } from '$app/environment';
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
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import { useIsMobile } from '$lib/hooks/useIsMobile.svelte';
	import { useFullscreen } from '$lib/hooks/useFullscreen.svelte';
	import ViewerToolbar, { type ViewMode } from './ViewerToolbar.svelte';
	import ViewerCanvas from './ViewerCanvas.svelte';
	import ViewModeSync from './ViewModeSync.svelte';

	interface Props {
		pdfUrl: string;
		open: boolean;
		onClose: () => void;
		onShare: () => void;
	}

	let { pdfUrl, open, onClose, onShare }: Props = $props();

	const mobile = useIsMobile();
	let viewMode = $state<ViewMode>('book');
	let didInit = $state(false);

	$effect(() => {
		if (didInit || !open) return;
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
		createPluginRegistration(ZoomPluginPackage, { defaultZoomLevel: ZoomMode.FitWidth })
	]);

	let containerEl = $state<HTMLDivElement | null>(null);
	const fullscreen = useFullscreen(() => containerEl);

	$effect(() => {
		if (!browser || !open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});

	$effect(() => {
		if (!browser || !open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && !document.fullscreenElement) onClose();
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

{#snippet status(text: string, spinning: boolean)}
	<div class="flex flex-1 items-center justify-center bg-paper-warm-2 px-6 text-center">
		<div class="flex items-center gap-2 text-muted-foreground">
			{#if spinning}
				<Loader2 class="size-4 animate-spin" />
			{/if}
			<span class="font-mono text-xs tracking-wide">{text}</span>
		</div>
	</div>
{/snippet}

{#if open}
	<div
		bind:this={containerEl}
		class="fixed inset-0 z-50 flex flex-col bg-background"
		role="dialog"
		aria-modal="true"
		aria-label="Publication reader"
	>
		{#if pdfEngine.isLoading || !pdfEngine.engine}
			{@render status('Loading viewer…', true)}
		{:else if pdfEngine.error}
			{@render status('Couldn’t load PDF engine.', false)}
		{:else}
			<EmbedPDF engine={pdfEngine.engine} {plugins}>
				{#snippet children({ activeDocumentId })}
					{#if activeDocumentId}
						{@const documentId = activeDocumentId}
						<DocumentContent {documentId}>
							{#snippet children(state)}
								{#if state.isLoaded}
									<ViewModeSync {documentId} {viewMode} />
									<ViewerToolbar
										{documentId}
										{viewMode}
										{setViewMode}
										isMobile={mobile.current}
										isFullscreen={fullscreen.current}
										toggleFullscreen={fullscreen.toggle}
										{onShare}
										{onClose}
									/>
									<div class="relative flex-1 bg-paper-warm-2">
										{#key viewMode}
											<ViewerCanvas {documentId} {viewMode} />
										{/key}
									</div>
								{:else if state.isError}
									{@render status('Couldn’t open the document.', false)}
								{:else}
									{@render status('Loading document…', true)}
								{/if}
							{/snippet}
						</DocumentContent>
					{/if}
				{/snippet}
			</EmbedPDF>
		{/if}
	</div>
{/if}
