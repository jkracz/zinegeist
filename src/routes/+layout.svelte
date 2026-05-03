<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '@mmailaender/convex-svelte';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PaperGrain from '$lib/components/PaperGrain.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children, data } = $props();
	const convexClient = setupConvex(PUBLIC_CONVEX_URL);
	if (browser) {
		createSvelteAuthClient({ authClient, convexClient, getServerState: () => data.authState });
	}

	let commandOpen = $state(false);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			commandOpen = !commandOpen;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Toaster position="top-center" richColors />

<Header {data} onOpenSearch={() => (commandOpen = true)} />

<CommandPalette bind:open={commandOpen} />

<main class="relative min-w-0">
	{@render children()}
</main>

<Footer {data} />

<PaperGrain />
