<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SignInDialog from '$lib/components/auth/SignInDialog.svelte';
	import UserMenu from '$lib/components/auth/UserMenu.svelte';

	type HeaderData = {
		authState?: { isAuthenticated: boolean };
		currentUser?: { name?: string | null; image?: string | null } | null;
		profile?: { handle: string } | null;
	};

	let { data, onOpenSearch }: { data?: HeaderData; onOpenSearch?: () => void } = $props();

	const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
	const shortcutLabel = $derived(isMac ? '⌘K' : 'Ctrl K');

	const isAuthenticated = $derived(data?.authState?.isAuthenticated ?? false);
	const profileHref = $derived(
		data?.profile?.handle
			? resolve('/profile/[handle]', { handle: data.profile.handle })
			: resolve('/onboarding/handle')
	);

	const HOME = resolve('/');
	const CREATE = resolve('/create');

	const isActive = (href: string) => {
		if (href === HOME) return page.url.pathname === HOME;
		return page.url.pathname.startsWith(href);
	};

	let signInDialogOpen = $state(false);

	$effect(() => {
		if (page.url.searchParams.get('signin') === '1' && !isAuthenticated) {
			signInDialogOpen = true;
			const url = new URL(page.url);
			url.searchParams.delete('signin');
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			void goto(url.pathname + url.search + url.hash, {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
		}
	});
</script>

<header
	class="header sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-border px-12 py-4 max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-6"
>
	<div class="flex items-center gap-7">
		<a
			class="flex cursor-pointer items-center gap-2.5 text-inherit no-underline"
			href={HOME}
			aria-label="Zinegeist home"
		>
			<img
				src="/zinegeistLogo.png"
				alt="Zinegeist logo"
				class="block size-7 shrink-0 object-contain"
				width="28"
				height="28"
			/>
			<div class="font-serif text-[22px] font-medium tracking-[-0.01em] text-ink">Zinegeist</div>
		</a>
	</div>

	<nav
		class="header-nav flex items-center gap-1 justify-self-center max-[900px]:hidden"
		aria-label="Primary"
	>
		<a class:active={isActive(HOME)} href={HOME}>Discover</a>
		{#if isAuthenticated}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class:active={page.url.pathname.startsWith('/profile')} href={profileHref}>My shelf</a>
		{/if}
	</nav>

	<div class="flex items-center gap-2.5 justify-self-end">
		<button
			type="button"
			class="header-search inline-flex min-w-[200px] cursor-text items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 font-mono text-xs tracking-[0.04em] text-muted-foreground max-[900px]:hidden"
			onclick={() => onOpenSearch?.()}
			aria-label="Search zines and writers"
		>
			<span class="text-[13px]" aria-hidden="true">⌕</span>
			<span>Search zines &amp; writers</span>
			<span class="kbd ml-auto">{shortcutLabel}</span>
		</button>
		<a class="zg-btn zg-btn-primary !px-4 !py-2 !text-[13px]" href={CREATE}> ＋ Publish </a>

		{#if isAuthenticated}
			<UserMenu currentUser={data?.currentUser} />
		{:else}
			<button
				type="button"
				class="zg-btn zg-btn-primary !px-4 !py-2 !text-[13px]"
				onclick={() => (signInDialogOpen = true)}
			>
				Sign in
			</button>
		{/if}
	</div>
</header>

<SignInDialog bind:open={signInDialogOpen} />

<style>
	.header {
		background: color-mix(in oklch, var(--background) 86%, transparent);
		backdrop-filter: blur(12px) saturate(140%);
	}
	.header-nav a {
		padding: 8px 14px;
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--foreground);
		transition:
			background 0.15s,
			color 0.15s;
		cursor: pointer;
		text-decoration: none;
	}
	.header-nav a:hover {
		background: color-mix(in oklch, var(--accent) 50%, transparent);
		color: var(--ink);
	}
	.header-nav a.active {
		background: var(--ink);
		color: var(--paper-warm-1);
	}
	.header-search {
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.header-search:hover {
		border-color: var(--ink);
	}
</style>
