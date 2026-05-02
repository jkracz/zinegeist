<script lang="ts">
	import { Viewport } from '@embedpdf/plugin-viewport/svelte';
	import { Scroller, useScroll, type RenderPageProps } from '@embedpdf/plugin-scroll/svelte';
	import { RenderLayer } from '@embedpdf/plugin-render/svelte';
	import type { ViewMode } from './ViewerToolbar.svelte';

	interface Props {
		documentId: string;
		viewMode: ViewMode;
	}

	let { documentId, viewMode }: Props = $props();

	const scroll = useScroll(() => documentId);
	const horizontal = $derived(viewMode !== 'scroll');

	const maxItemAspect = $derived.by(() => {
		if (!scroll.provides) return null;
		void scroll.state.totalPages;
		const spreads = scroll.provides.getSpreadPagesWithRotatedSize();
		if (!spreads.length) return null;
		let best = 0;
		for (const spread of spreads) {
			const w = spread.reduce((sum, p) => sum + p.rotatedSize.width, 0);
			const h = Math.max(...spread.map((p) => p.rotatedSize.height));
			if (h > 0) best = Math.max(best, w / h);
		}
		return best || null;
	});

	let parentW = $state(0);
	let parentH = $state(0);

	const boundedW = $derived(
		maxItemAspect && parentW && parentH ? Math.min(parentW, parentH * maxItemAspect) : parentW
	);
	const boundedH = $derived(
		horizontal && maxItemAspect && parentW && parentH
			? Math.min(parentH, parentW / maxItemAspect)
			: parentH
	);

	const viewportClass = $derived(
		`zg-pdf-viewport bg-paper-warm-2${horizontal ? ' zg-pdf-viewport-snap snap-x snap-mandatory' : ''}`
	);
</script>

{#snippet renderPage(page: RenderPageProps)}
	<div style:width="{page.width}px" style:height="{page.height}px" style:position="relative">
		<RenderLayer {documentId} pageIndex={page.pageIndex} />
	</div>
{/snippet}

<div
	class="absolute inset-0 flex items-center justify-center"
	bind:clientWidth={parentW}
	bind:clientHeight={parentH}
>
	<div class="relative" style:width="{boundedW}px" style:height="{boundedH}px">
		<Viewport {documentId} class={viewportClass}>
			<Scroller {documentId} {renderPage} />
		</Viewport>
	</div>
</div>
