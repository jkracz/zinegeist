<script lang="ts">
	import './layout.css';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '@mmailaender/convex-svelte';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import { Header, PaperGrain } from '$lib/components/zinegeist';

	const { children } = $props();
	setupConvex(PUBLIC_CONVEX_URL);
	createSvelteAuthClient({ authClient });
</script>

<Header />

<main class="relative min-w-0">
	{@render children()}
</main>

<PaperGrain />
