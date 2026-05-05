<script lang="ts">
	import { resolve } from '$app/paths';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { authClient } from '$lib/auth-client';
	import { invalidateAll } from '$app/navigation';
	import CustomerPortalButton from '$lib/components/billing/CustomerPortalButton.svelte';

	type CurrentUser = { name?: string | null; image?: string | null } | null | undefined;
	type BillingPlan =
		| { isPlus: boolean; plan?: 'free' | 'plus'; publicationLimit?: number }
		| null
		| undefined;

	type Props = { currentUser: CurrentUser; billingPlan?: BillingPlan };
	let { currentUser, billingPlan }: Props = $props();

	const PRICING = resolve('/pricing');

	const initials = $derived.by(() => {
		const name = currentUser?.name?.trim();
		if (!name) return '?';
		return name
			.split(/\s+/)
			.map((part) => part[0])
			.filter(Boolean)
			.slice(0, 2)
			.join('')
			.toUpperCase();
	});

	let signingOut = $state(false);

	async function handleSignOut() {
		if (signingOut) return;
		signingOut = true;
		try {
			await authClient.signOut();
			await invalidateAll();
		} finally {
			signingOut = false;
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="rounded-full ring-0 ring-border transition outline-none hover:ring-2 focus-visible:ring-2"
		aria-label="User menu"
	>
		<Avatar.Root class="size-9">
			{#if currentUser?.image}
				<Avatar.Image src={currentUser.image} alt={currentUser.name ?? 'You'} />
			{/if}
			<Avatar.Fallback
				class="bg-gradient-to-br from-[#e8d4b3] to-[#9b7a5e] font-serif text-sm text-[#3a2418] italic"
			>
				{initials}
			</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-52">
		<div class="px-1.5 pt-1 pb-2">
			<div class="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
				{billingPlan?.isPlus ? 'Plus shelf' : 'Free shelf'}
			</div>
			<div class="mt-1 font-serif text-[15px] text-ink">
				{billingPlan?.publicationLimit ?? 5} publications
			</div>
		</div>
		{#if billingPlan?.isPlus}
			<CustomerPortalButton
				class="relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
				label="Manage subscription"
			/>
		{:else}
			<a
				class="relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm no-underline outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
				href={PRICING}
			>
				Plus and billing
			</a>
		{/if}
		<DropdownMenu.Item onclick={handleSignOut} disabled={signingOut}>
			{signingOut ? 'Signing out…' : 'Sign out'}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
