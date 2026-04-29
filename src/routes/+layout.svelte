<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '@mmailaender/convex-svelte';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import Header from '$lib/components/Header.svelte';
	import PaperGrain from '$lib/components/PaperGrain.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children, data } = $props();
	const convexClient = setupConvex(PUBLIC_CONVEX_URL);
	if (browser) {
		createSvelteAuthClient({ authClient, convexClient, getServerState: () => data.authState });
	}
</script>

<Toaster position="top-center" richColors />

<Header {data} />

<main class="relative min-w-0">
	{@render children()}
</main>

<PaperGrain />
