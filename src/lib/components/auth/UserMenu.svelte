<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { authClient } from '$lib/auth-client';
	import { invalidateAll } from '$app/navigation';

	type CurrentUser = { name?: string | null; image?: string | null } | null | undefined;

	type Props = { currentUser: CurrentUser };
	let { currentUser }: Props = $props();

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
	<DropdownMenu.Content align="end" class="w-44">
		<DropdownMenu.Item onclick={handleSignOut} disabled={signingOut}>
			{signingOut ? 'Signing out…' : 'Sign out'}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
