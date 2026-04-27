<script lang="ts">
	import ZineCover from './ZineCover.svelte';

	const layers = [
		{
			id: 'c7',
			transform: 'rotate(-8deg) translateX(-100px) translateY(20px) rotateY(8deg)',
			z: 1,
			opacity: 0.85
		},
		{
			id: 'c4',
			transform: 'rotate(3deg) translateX(60px) translateY(-10px) rotateY(-6deg)',
			z: 2,
			opacity: 0.92
		},
		{ id: 'c1', transform: 'rotate(-2deg) translateY(-8px) rotateY(2deg)', z: 3, opacity: 1 }
	];
</script>

<div class="hero-stage">
	{#each layers as layer (layer.id)}
		<div
			class="hero-zine"
			style:transform={layer.transform}
			style:z-index={layer.z}
			style:opacity={layer.opacity}
		>
			<div class="cover">
				<ZineCover coverId={layer.id} />
				<div class="cover-edge"></div>
			</div>
		</div>
	{/each}
</div>

<style>
	.hero-stage {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		perspective: 1400px;
		height: 540px;
	}
	.hero-zine {
		position: absolute;
		width: 280px;
		height: 380px;
		border-radius: 2px 4px 4px 2px;
		box-shadow: var(--shadow-page);
		transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.cover {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
