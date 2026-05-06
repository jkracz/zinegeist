<script lang="ts">
	import { navigating } from '$app/state';

	const DELAY_MS = 150;

	let visible = $state(false);

	$effect(() => {
		if (navigating.to) {
			const timer = setTimeout(() => {
				visible = true;
			}, DELAY_MS);
			return () => {
				clearTimeout(timer);
				visible = false;
			};
		}
	});
</script>

{#if visible}
	<div
		class="pointer-events-none fixed inset-x-0 top-0 z-[100] h-px overflow-hidden"
		role="progressbar"
		aria-busy="true"
		aria-label="Loading"
	>
		<div class="nav-progress-shimmer h-full w-1/3 bg-primary"></div>
	</div>
{/if}

<style>
	.nav-progress-shimmer {
		animation: nav-progress-slide 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	@keyframes nav-progress-slide {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(400%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.nav-progress-shimmer {
			animation: none;
			width: 100%;
			opacity: 0.6;
		}
	}
</style>
