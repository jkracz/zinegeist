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

<div class="hero-stage relative flex h-[540px] items-center justify-center">
	{#each layers as layer (layer.id)}
		<div
			class="hero-zine absolute h-[380px] w-[280px] rounded-[2px_4px_4px_2px] shadow-page"
			style:transform={layer.transform}
			style:z-index={layer.z}
			style:opacity={layer.opacity}
		>
			<div class="relative h-full w-full">
				<ZineCover coverId={layer.id} />
				<div class="cover-edge"></div>
			</div>
		</div>
	{/each}
</div>

<style>
	.hero-stage {
		perspective: 1400px;
	}
	.hero-zine {
		transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
</style>
