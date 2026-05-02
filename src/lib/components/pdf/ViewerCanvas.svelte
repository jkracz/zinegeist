<script lang="ts">
	import { Viewport } from '@embedpdf/plugin-viewport/svelte';
	import { Scroller, type RenderPageProps } from '@embedpdf/plugin-scroll/svelte';
	import { RenderLayer } from '@embedpdf/plugin-render/svelte';

	interface Props {
		documentId: string;
	}

	let { documentId }: Props = $props();
</script>

{#snippet renderPage(page: RenderPageProps)}
	<div style:width="{page.width}px" style:height="{page.height}px" style:position="relative">
		<RenderLayer {documentId} pageIndex={page.pageIndex} />
	</div>
{/snippet}

<Viewport {documentId} class="absolute inset-0 bg-paper-warm-2">
	<Scroller {documentId} {renderPage} />
</Viewport>
