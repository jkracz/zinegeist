<script lang="ts">
	import './layout.css';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	import { Header, PaperGrain } from '$lib/components/zinegeist';

	const { children } = $props();
	setupConvex(PUBLIC_CONVEX_URL);
</script>

<Header />

<main>
	{@render children()}
</main>

<PaperGrain />

<style>
	main {
		min-width: 0;
		position: relative;
	}
</style>
