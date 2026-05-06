<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { useAction } from '@mmailaender/convex-svelte';
	import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
	import { api } from '$convex/_generated/api';
	import { toast } from 'svelte-sonner';

	type Props = {
		productIds: string[];
		class?: string;
		label?: string;
		metadata?: Record<string, string>;
	};

	let {
		productIds,
		class: className = 'zg-btn zg-btn-primary',
		label = 'Subscribe to Plus',
		metadata
	}: Props = $props();

	const generateCheckoutLink = useAction(api.polar.generateCheckoutLink);
	let loading = $state(false);

	async function openCheckout(): Promise<void> {
		if (!browser || loading) return;
		loading = true;

		try {
			const { url } = await generateCheckoutLink({
				productIds,
				origin: window.location.origin,
				successUrl: window.location.href,
				metadata
			});
			const checkout = await PolarEmbedCheckout.create(url, { theme: 'light' });
			checkout.addEventListener(
				'success',
				() => {
					void invalidateAll();
				},
				{ once: true }
			);
		} catch {
			toast.error('Could not open checkout. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<button type="button" class={className} disabled={loading} onclick={openCheckout}>
	{loading ? 'Opening checkout...' : label}
</button>
