<script lang="ts">
	import { browser } from '$app/environment';
	import { useAction } from '@mmailaender/convex-svelte';
	import { api } from '$convex/_generated/api';
	import { toast } from 'svelte-sonner';

	type Props = {
		class?: string;
		label?: string;
		returnUrl?: string;
	};

	let { class: className = '', label = 'Manage subscription', returnUrl }: Props = $props();

	const generateCustomerPortalUrl = useAction(api.polar.generateCustomerPortalUrl);
	let loading = $state(false);

	async function openPortal(): Promise<void> {
		if (!browser || loading) return;
		loading = true;

		try {
			const { url } = await generateCustomerPortalUrl({
				returnUrl: returnUrl ?? window.location.href
			});
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch {
			toast.error('Could not open billing. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<button type="button" class={className} disabled={loading} onclick={openPortal}>
	{loading ? 'Opening...' : label}
</button>
