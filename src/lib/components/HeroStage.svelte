<script lang="ts">
	import { base } from '$app/paths';

	const heroSrc = `${base}/zinegeistHero.png`;
</script>

<div class="hero-stage relative flex h-full min-h-[600px] w-full items-center justify-center">
	<img
		src={heroSrc}
		alt="A reader's desk — an open notebook, a stack of zines, a coffee mug, and a pen"
		class="illustration"
		width="500"
		height="320"
		draggable="false"
	/>
</div>

<style>
	.illustration {
		width: 100%;
		max-width: 760px;
		height: auto;
		display: block;
		mix-blend-mode: multiply;
		filter: contrast(1.05) saturate(0.95);
		user-select: none;
		-webkit-user-drag: none;
	}
</style>
