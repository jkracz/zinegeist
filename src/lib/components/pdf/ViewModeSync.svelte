<script lang="ts" module>
	import { ScrollStrategy } from '@embedpdf/plugin-scroll/svelte';
	import { SpreadMode } from '@embedpdf/plugin-spread/svelte';
	import type { ViewMode } from './ViewerToolbar.svelte';

	const VIEW_MODE_CONFIG: Record<ViewMode, { strategy: ScrollStrategy; spread: SpreadMode }> = {
		book: { strategy: ScrollStrategy.Horizontal, spread: SpreadMode.Odd },
		single: { strategy: ScrollStrategy.Horizontal, spread: SpreadMode.None },
		scroll: { strategy: ScrollStrategy.Vertical, spread: SpreadMode.None }
	};
</script>

<script lang="ts">
	import { useScroll } from '@embedpdf/plugin-scroll/svelte';
	import { useSpread } from '@embedpdf/plugin-spread/svelte';
	import { useZoom, ZoomMode } from '@embedpdf/plugin-zoom/svelte';

	interface Props {
		documentId: string;
		viewMode: ViewMode;
	}

	let { documentId, viewMode }: Props = $props();

	const scroll = useScroll(() => documentId);
	const spread = useSpread(() => documentId);
	const zoom = useZoom(() => documentId);

	$effect(() => {
		const config = VIEW_MODE_CONFIG[viewMode];
		if (!scroll.provides || !spread.provides) return;
		scroll.provides.setScrollStrategy(config.strategy);
		spread.provides.setSpreadMode(config.spread);
		zoom.provides?.requestZoom(ZoomMode.FitWidth);
	});
</script>
